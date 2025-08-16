import * as functions from 'firebase-functions';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import * as CryptoJS from 'crypto-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:8080',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request) => {
    return req.headers['x-forwarded-for'] as string || req.ip || req.connection.remoteAddress || 'unknown';
  }
});

// Stricter rate limiting for AI enhancement endpoint
const aiEnhancementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 minutes per IP
  message: { error: 'AI enhancement limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request) => {
    return req.headers['x-forwarded-for'] as string || req.ip || req.connection.remoteAddress || 'unknown';
  }
});

// Per-field rate limiting (5 attempts per field per IP per 15 minutes)
const fieldSpecificLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per field per 15 minutes per IP
  message: { error: 'Too many attempts for this field. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request) => {
    const field = req.body?.field || 'unknown';
    const ip = req.headers['x-forwarded-for'] as string || req.ip || req.connection.remoteAddress || 'unknown';
    return `${ip}-${field}`;
  }
});

const pdfExportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'PDF export limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request) => {
    return req.headers['x-forwarded-for'] as string || req.ip || req.connection.remoteAddress || 'unknown';
  }
});

app.use(generalLimiter);

const validateSecurePdfRequest = (req: Request, res: Response, next: NextFunction): void => {
  const SHARED_SECRET = process.env.SHARED_SECRET;
  if (!SHARED_SECRET) {
    res.status(500).json({ error: 'Server configuration error: SHARED_SECRET not set' });
    return;
  }

  const { encryptedData, signature } = req.body;
  
  if (!encryptedData || !signature) {
    res.status(400).json({ error: 'Encrypted data and signature are required' });
    return;
  }
  
  if (typeof encryptedData !== 'string' || typeof signature !== 'string') {
    res.status(400).json({ error: 'Invalid data format' });
    return;
  }
  
  // Validate HMAC signature
  const expectedSignature = CryptoJS.HmacSHA256(encryptedData, SHARED_SECRET).toString();
  if (expectedSignature !== signature) {
    res.status(403).json({ error: 'Invalid signature' });
    return;
  }
  
  next();
};

app.post('/export-pdf', pdfExportLimiter, validateSecurePdfRequest, async (req: Request, res: Response): Promise<void> => {
  try {
    const SHARED_SECRET = process.env.SHARED_SECRET;
    if (!SHARED_SECRET) {
      res.status(500).json({ error: 'Server configuration error: SHARED_SECRET not set' });
      return;
    }

    const { encryptedData } = req.body;
    
    // Decrypt data
    const bytes = CryptoJS.AES.decrypt(encryptedData, SHARED_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const { html } = JSON.parse(decrypted);
    
    if (!html || typeof html !== 'string') {
      res.status(400).json({ error: 'Invalid HTML content' });
      return;
    }
    
    if (html.length > 1000000) {
      res.status(400).json({ error: 'HTML content too large (max 1MB)' });
      return;
    }
    
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    
    const pdf = await page.pdf({
      format: 'a4',
      printBackground: true,
    });
    
    await browser.close();
    
    // Convert to base64 to return to frontend
    const base64Pdf = Buffer.from(pdf).toString('base64');
    res.status(200).json({ pdf: base64Pdf });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// AI Enhancement endpoint
app.post('/enhance-content', [aiEnhancementLimiter, fieldSpecificLimiter], async (req: Request, res: Response): Promise<void> => {
  try {
    const { field, content, rejectedResponses = [] } = req.body;
    
    // Security: Validate request signature (mandatory)
    const SHARED_SECRET = process.env.SHARED_SECRET;
    if (!SHARED_SECRET) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }
    
    const { signature } = req.body;
    if (!signature) {
      res.status(403).json({ error: 'Request signature required' });
      return;
    }
    
    const expectedSignature = CryptoJS.HmacSHA256(JSON.stringify({ field, content }), SHARED_SECRET).toString();
    if (expectedSignature !== signature) {
      res.status(403).json({ error: 'Invalid request signature' });
      return;
    }
    
    // Security: Validate request origin (optional additional protection)
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    const origin = req.headers.origin || req.headers.referer;
    
    if (allowedOrigins.length > 0 && origin) {
      const isAllowedOrigin = allowedOrigins.some(allowedOrigin => 
        origin.includes(allowedOrigin.replace('https://', '').replace('http://', ''))
      );
      
      if (!isAllowedOrigin) {
        res.status(403).json({ error: 'Request origin not allowed' });
        return;
      }
    }
    
    if (!field || !content || typeof content !== 'string') {
      res.status(400).json({ error: 'Field and content are required' });
      return;
    }
    
    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /(?:https?:\/\/[^\s]+)/gi, // URLs
      /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi, // Email addresses
      /(?:script|javascript|eval|alert|prompt|confirm)/gi, // JavaScript injection
      /(?:<[^>]*>)/gi, // HTML tags
      /(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)/gi, // SQL injection
      /(?:admin|root|password|login|auth)/gi, // Sensitive keywords
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        res.status(400).json({ error: 'Content contains invalid characters or patterns' });
        return;
      }
    }
    
    // Security: Check for repeated characters (spam detection)
    const repeatedChars = /(.)\1{10,}/; // Same character repeated 10+ times
    if (repeatedChars.test(content)) {
      res.status(400).json({ error: 'Content contains too many repeated characters' });
      return;
    }
    
    // Security: Check for excessive whitespace
    const excessiveWhitespace = /\s{20,}/; // 20+ consecutive whitespace characters
    if (excessiveWhitespace.test(content)) {
      res.status(400).json({ error: 'Content contains excessive whitespace' });
      return;
    }
    
    if (content.length > 5000) {
      res.status(400).json({ error: 'Content too long (max 5000 characters)' });
      return;
    }
    
    // Validate content based on field type
    const validationRules = {
      summary: {
        minLength: 10,
        maxLength: 2000,
        invalidPhrases: ['generate', 'create', 'write', 'make', 'give me', 'help me', 'can you', 'please', 'good description', 'better', 'improve'],
        message: 'Please enter your actual professional summary instead of asking for generation'
      },
      jobDescription: {
        minLength: 10,
        maxLength: 3000,
        invalidPhrases: ['generate', 'create', 'write', 'make', 'give me', 'help me', 'can you', 'please', 'good description', 'better', 'improve'],
        message: 'Please enter your actual job description instead of asking for generation'
      },
      skills: {
        minLength: 3,
        maxLength: 1000,
        invalidPhrases: ['generate', 'create', 'write', 'make', 'give me', 'help me', 'can you', 'please', 'suggest', 'recommend'],
        message: 'Please enter your actual skills instead of asking for suggestions'
      },
      customSection: {
        minLength: 10,
        maxLength: 2000,
        invalidPhrases: ['generate', 'create', 'write', 'make', 'give me', 'help me', 'can you', 'please', 'good content', 'better'],
        message: 'Please enter your actual content instead of asking for generation'
      }
    };
    
    const validation = validationRules[field as keyof typeof validationRules];
    if (validation) {
      if (content.length < validation.minLength) {
        res.status(400).json({ error: `Content too short. Please enter at least ${validation.minLength} characters.` });
        return;
      }
      
      if (content.length > validation.maxLength) {
        res.status(400).json({ error: `Content too long. Please keep it under ${validation.maxLength} characters.` });
        return;
      }
      
      const lowerContent = content.toLowerCase();
      const hasInvalidPhrase = validation.invalidPhrases.some(phrase => 
        lowerContent.includes(phrase.toLowerCase())
      );
      
      if (hasInvalidPhrase) {
        res.status(400).json({ error: validation.message });
        return;
      }
    }
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;
    if (!GEMINI_API_KEY) {
      res.status(500).json({ error: 'AI service not configured' });
      return;
    }
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || functions.config().gemini?.model || 'gemini-2.0-flash-lite',
      generationConfig: {
        temperature: 0.9,
        topP: 0.9,
        topK: 50,
        maxOutputTokens: 500,
      },
    });
    
    // Create field-specific prompts with randomization
    const getRandomPrompt = (field: string, content: string) => {
      const promptVariations = {
        summary: [
          `First, validate if this content is actually a professional summary. If it's not related to professional background, skills, or career information, respond with "INVALID_CONTENT: This does not appear to be a professional summary. Please enter your actual professional background, skills, or career information."
    
    If it is a valid professional summary, enhance it by improving language, adding action verbs, and making it more impactful.
    Keep the same core information and meaning, but make it more professional and ATS-friendly.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`,
          `First, validate if this content is actually a professional summary. If it's not related to professional background, skills, or career information, respond with "INVALID_CONTENT: This does not appear to be a professional summary. Please enter your actual professional background, skills, or career information."
    
    If it is a valid professional summary, improve it by enhancing the language, structure, and impact.
    Maintain the same key information and message, but make it more compelling and professional.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`,
          `First, validate if this content is actually a professional summary. If it's not related to professional background, skills, or career information, respond with "INVALID_CONTENT: This does not appear to be a professional summary. Please enter your actual professional background, skills, or career information."
    
    If it is a valid professional summary, refine it to be more ATS-friendly and impactful.
    Keep the same core content and meaning, but improve the language and presentation.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`
        ],
        
        jobDescription: [
          `First, validate if this content is actually a job description. If it's not related to work experience, job responsibilities, or professional achievements, respond with "INVALID_CONTENT: This does not appear to be a job description. Please enter your actual work experience, job responsibilities, or professional achievements."
    
    If it is a valid job description, enhance it by improving the language and structure.
    Keep the same core information and responsibilities, but make it more professional and impactful.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`,
          `First, validate if this content is actually a job description. If it's not related to work experience, job responsibilities, or professional achievements, respond with "INVALID_CONTENT: This does not appear to be a job description. Please enter your actual work experience, job responsibilities, or professional achievements."
    
    If it is a valid job description, improve it by enhancing the language and making it more ATS-friendly.
    Maintain the same key information and achievements, but improve the presentation.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`,
          `First, validate if this content is actually a job description. If it's not related to work experience, job responsibilities, or professional achievements, respond with "INVALID_CONTENT: This does not appear to be a job description. Please enter your actual work experience, job responsibilities, or professional achievements."
    
    If it is a valid job description, refine it to be more professional and impactful.
    Keep the same core content and meaning, but enhance the language and structure.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`
        ],
        
        skills: [
          `First, validate if this content is actually a skill list. If it's not related to technical skills, programming languages, tools, or professional competencies, respond with "INVALID_CONTENT: This does not appear to be a skill list. Please enter your actual technical skills, programming languages, tools, or professional competencies."
    
    If it is a valid skill list, enhance it by improving the language and adding related skills.
    Keep the same core skills, but improve the presentation and add relevant related skills.
    Return ONLY the enhanced skill list, nothing else.
    
    Input:
    "${content}"
    
    Output:`,
          `First, validate if this content is actually a skill list. If it's not related to technical skills, programming languages, tools, or professional competencies, respond with "INVALID_CONTENT: This does not appear to be a skill list. Please enter your actual technical skills, programming languages, tools, or professional competencies."
    
    If it is a valid skill list, improve it by enhancing the language and adding complementary skills.
    Maintain the same key skills, but improve the presentation and add relevant additions.
    Return ONLY the enhanced skill list, nothing else.
    
    Input:
    "${content}"
    
    Output:`,
          `First, validate if this content is actually a skill list. If it's not related to technical skills, programming languages, tools, or professional competencies, respond with "INVALID_CONTENT: This does not appear to be a skill list. Please enter your actual technical skills, programming languages, tools, or professional competencies."
    
    If it is a valid skill list, refine it to be more professional and comprehensive.
    Keep the same core skills, but enhance the language and add relevant related skills.
    Return ONLY the enhanced skill list, nothing else.
    
    Input:
    "${content}"
    
    Output:`
        ],
        
        customSection: [
          `First, validate if this content is actually relevant to a resume section. If it's not related to professional experience, projects, achievements, or relevant information, respond with "INVALID_CONTENT: This does not appear to be relevant resume content. Please enter your actual professional experience, projects, achievements, or relevant information."
    
    If it is valid resume content, enhance it by improving the language and structure.
    Keep the same core information and meaning, but make it more professional and ATS-friendly.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`,
          `First, validate if this content is actually relevant to a resume section. If it's not related to professional experience, projects, achievements, or relevant information, respond with "INVALID_CONTENT: This does not appear to be relevant resume content. Please enter your actual professional experience, projects, achievements, or relevant information."
    
    If it is valid resume content, improve it by enhancing the language and presentation.
    Maintain the same key information and message, but make it more compelling and professional.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`,
          `First, validate if this content is actually relevant to a resume section. If it's not related to professional experience, projects, achievements, or relevant information, respond with "INVALID_CONTENT: This does not appear to be relevant resume content. Please enter your actual professional experience, projects, achievements, or relevant information."
    
    If it is valid resume content, refine it to be more professional and impactful.
    Keep the same core content and meaning, but improve the language and structure.
    Output ONLY the enhanced version, nothing else.
    
    Input:
    "${content}"
    
    Output:`
        ]
      };
      
      const variations = promptVariations[field as keyof typeof promptVariations];
      if (variations) {
        const randomIndex = Math.floor(Math.random() * variations.length);
        return variations[randomIndex];
      }
      
      // Fallback to original prompts for other fields
      const fallbackPrompts = {
        jobTitle: `Suggest 3–5 optimized professional job titles similar to the given one. 
    Return ONLY the titles separated by commas, no explanations.
    
    Input:
    "${content}"
    
    Output:`,
        company: `Extract industry-related keywords for this company (e.g., sector, domain, technology focus). 
    Return ONLY the keywords separated by commas, no explanations.
    
    Input:
    "${content}"
    
    Output:`
      };
      
      return fallbackPrompts[field as keyof typeof fallbackPrompts] || fallbackPrompts.jobTitle;
    };
    
    const prompt = getRandomPrompt(field, content);
    
    // Add instructions to avoid rejected responses
    let avoidInstructions = '';
    if (rejectedResponses && rejectedResponses.length > 0) {
      avoidInstructions = `

IMPORTANT: Do NOT generate any of these previously rejected responses:
${rejectedResponses.map((response: string, index: number) => `${index + 1}. "${response}"`).join('\n')}

Generate a completely different and unique enhancement that is not similar to any of the above.`;
    }
    
    // Add additional randomization instructions
    const randomInstructions = [
      'Focus on improving language and clarity.',
      'Emphasize professional tone and structure.',
      'Use better action verbs and phrasing.',
      'Highlight key information more effectively.',
      'Improve readability and flow.',
      'Focus on making content more impactful.'
    ];
    
    const randomInstruction = randomInstructions[Math.floor(Math.random() * randomInstructions.length)];
    const additionalRandomization = `

ADDITIONAL INSTRUCTION: ${randomInstruction}`;
    
    const enhancedPrompt = `You are a resume enhancement assistant. Your job is to IMPROVE and ENHANCE the existing content, not replace it entirely. Keep the same core information and meaning, but make it more professional, clear, and impactful. Always provide direct, concise responses without explanations, options, or markdown formatting. Return only the enhanced content.

${prompt}${avoidInstructions}${additionalRandomization}`;
    
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let enhancedContent = response.text().trim();
    
    if (!enhancedContent) {
      res.status(500).json({ error: 'AI returned empty response' });
      return;
    }
    
    // Check if AI returned an invalid content response
    if (enhancedContent.startsWith('INVALID_CONTENT:')) {
      const errorMessage = enhancedContent.replace('INVALID_CONTENT:', '').trim();
      res.status(400).json({ error: errorMessage });
      return;
    }
    
    // Clean up the response - remove any markdown formatting or extra text
    enhancedContent = enhancedContent
      .replace(/^Enhanced:\s*/i, '')
      .replace(/^Skills:\s*/i, '')
      .replace(/^Titles:\s*/i, '')
      .replace(/^Keywords:\s*/i, '')
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/^[-*]\s*/gm, '') // Remove bullet points at start of lines
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .trim();
    
    res.status(200).json({ 
      enhancedContent,
      originalContent: content,
      field
    });
    
  } catch (error) {
    console.error('AI enhancement error:', error);
    res.status(500).json({ error: 'Failed to enhance content' });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export const api = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '1GB',
    maxInstances: 10
  })
  .https.onRequest(app);