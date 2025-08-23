import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import * as CryptoJS from "crypto-js";
import puppeteer from "puppeteer";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:8080',
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

// Rate limiting - Increased limits for development
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request) => {
    return req.headers['x-forwarded-for'] as string || req.ip || req.connection.remoteAddress || 'unknown';
  }
});

const aiEnhancementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased from 30 to 100
  message: { error: 'AI enhancement limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request) => {
    return req.headers['x-forwarded-for'] as string || req.ip || req.connection.remoteAddress || 'unknown';
  }
});

const fieldSpecificLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 5 to 20
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
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Increased from 20 to 50
  message: { error: 'PDF export limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request) => {
    return req.headers['x-forwarded-for'] as string || req.ip || req.connection.remoteAddress || 'unknown';
  }
});

app.use(generalLimiter);

const SHARED_SECRET = process.env.SHARED_SECRET;
if (!SHARED_SECRET) {
  throw new Error('SHARED_SECRET environment variable is required');
}

const validateSecurePdfRequest = (req: Request, res: Response, next: NextFunction): void => {
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

app.post("/export-pdf", pdfExportLimiter, validateSecurePdfRequest, async (req: Request, res: Response) => {
  try {
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

    // Launch Puppeteer (full)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
    });

    await browser.close();

    // Convert to base64 to return to frontend
    const base64Pdf = Buffer.from(pdfBuffer).toString("base64");
    res.status(200).json({ pdf: base64Pdf });
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// AI Enhancement endpoint
app.post('/enhance-content', [aiEnhancementLimiter, fieldSpecificLimiter], async (req: Request, res: Response) => {
  try {
    const { field, content, rejectedResponses = [] } = req.body;
    
    // Security: Validate request signature (mandatory)
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
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      res.status(500).json({ error: 'AI service not configured' });
      return;
    }
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
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

// AI Resume Generation endpoint
app.post('/generate-resume', [aiEnhancementLimiter], async (req: Request, res: Response): Promise<void> => {
  try {
    const { brief, context } = req.body;
    
    // Security: Validate request signature (mandatory)
    if (!SHARED_SECRET) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }
    
    const { signature } = req.body;
    if (!signature) {
      res.status(403).json({ error: 'Request signature required' });
      return;
    }
    
    const expectedSignature = CryptoJS.HmacSHA256(JSON.stringify({ brief, type: 'generate-resume' }), SHARED_SECRET).toString();
    if (expectedSignature !== signature) {
      res.status(403).json({ error: 'Invalid request signature' });
      return;
    }
    
    if (!brief || typeof brief !== 'string') {
      res.status(400).json({ error: 'Brief description is required' });
      return;
    }
    
    if (brief.length < 50) {
      res.status(400).json({ error: 'Brief description too short (minimum 50 characters)' });
      return;
    }
    
    if (brief.length > 2000) {
      res.status(400).json({ error: 'Brief description too long (maximum 2000 characters)' });
      return;
    }
    
    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /(?:https?:\/\/[^\s]+)/gi, // URLs
      /(?:script|javascript|eval|alert|prompt|confirm)/gi, // JavaScript injection
      /(?:<[^>]*>)/gi, // HTML tags
      /(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)/gi, // SQL injection
    ];
    

    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(brief)) {
        res.status(400).json({ error: 'Brief contains invalid characters or patterns' });
        return;
      }
    }


    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      res.status(500).json({ error: 'AI service not configured' });
      return;
    }
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 3000,
      },
    });
    
    const prompt = `You are a professional resume generator. 

FIRST: Extract and convert ALL dates from the brief to YYYY-MM format.
SECOND: Generate the resume JSON with the extracted dates.

DATE CONVERSION RULES:
- "(2013-2016)" → startDate: "2013-01", endDate: "2016-01"
- "(2009-2013)" → startDate: "2009-01", endDate: "2013-01"
- "since 2019" → startDate: "2019-01", endDate: "", current: true
- "(2019-2021)" → startDate: "2019-01", endDate: "2021-01"

CRITICAL RULES:
1. NEVER generate fake personal information (names, addresses, emails, phones, LinkedIn, websites)
2. If personal information is not explicitly mentioned in the brief, leave those fields as empty strings ("")
3. Create 1-3 work experiences with realistic companies and roles (only if mentioned in brief)
4. Include 1-2 education entries (only if mentioned in brief)
5. Generate 5-15 relevant skills based on the brief
6. Include 1-3 certifications if relevant and mentioned
7. Add 1-2 languages if mentioned
8. Create a professional summary based on the brief
9. CRITICAL: Extract ALL dates mentioned in the brief and convert them to YYYY-MM format. If no dates are mentioned, leave date fields as empty strings.
10. For languages, include a rating (1-5) where 5 is highest proficiency
11. INTELLIGENTLY CREATE CUSTOM SECTIONS for information that doesn't fit standard fields:
    - Projects (if mentioned)
    - Volunteer Work (if mentioned)
    - Publications (if mentioned)
    - Awards & Honors (if mentioned)
    - Patents (if mentioned)
    - Research Experience (if mentioned)
    - Leadership Experience (if mentioned)
    - Professional Memberships (if mentioned)
    - Speaking Engagements (if mentioned)
    - Media Coverage (if mentioned)
    - Open Source Contributions (if mentioned)
    - Hackathons (if mentioned)
    - Conferences Attended (if mentioned)
    - Workshops Conducted (if mentioned)
    - Mentoring Experience (if mentioned)
    - Industry Recognition (if mentioned)
    - Community Involvement (if mentioned)
    - Freelance Work (if mentioned)
    - Internships (if mentioned)
    - Study Abroad (if mentioned)

CRITICAL ERROR HANDLING:
- If the brief contains inappropriate, offensive, non-professional, irrelevant, nonsensical, or gibberish content, you MUST respond with ONLY this exact text (no JSON, no markdown, nothing else):
  "INVALID_CONTENT: The provided information is not suitable for a professional resume. Please provide only professional work experience, education, skills, and achievements."
- This includes random characters, meaningless text, or content that doesn't represent actual professional information
- NEVER embed error messages inside JSON fields
- NEVER return JSON with error messages in the summary or any other field
- If the content is invalid, return ONLY the INVALID_CONTENT message

CONTENT VALIDATION:
- The user MUST provide their OWN actual professional information, not ask for generated content
- If the user asks you to "generate", "create", "make", "write", "give me", "help me create", "can you create", "please create", "sample", "example", "template", "fake", "dummy", or "test" content, respond with:
  "INVALID_CONTENT: Please provide your actual professional information instead of asking for generated content. This tool is designed to help organize your real experience, not create fictional resumes."
- If the user asks for a "software engineer resume", "developer profile", or similar role-specific content without providing their actual information, respond with the same error
- Only process requests that contain the user's real professional background, experience, skills, and achievements

Brief: "${brief}"

Context: ${context ? JSON.stringify(context) : 'None provided'}

⚠️ DATE EXTRACTION REQUIRED ⚠️:
Extract these dates from the brief and convert to YYYY-MM format:
- Look for patterns like (2013-2016), since 2019, 2018-2020, from 2015 to 2018, 2019-present
- Convert them to startDate/endDate pairs in YYYY-MM format
- For "since", "present", "current" → set endDate to "", current to true

IMPORTANT: Only include dates if they are explicitly mentioned in the brief. Do not generate fake or estimated dates. Leave date fields as empty strings if dates are not provided. When dates are mentioned, they must be in YYYY-MM format (e.g., "2023-01", "2019-06") to work with the form inputs.

DATE EXTRACTION EXAMPLES:
- "(2013-2016)" → startDate: "2013-01", endDate: "2016-01"
- "(2009-2013)" → startDate: "2009-01", endDate: "2013-01"  
- "since 2019" → startDate: "2019-01", endDate: "", current: true
- "2018-2020" → startDate: "2018-01", endDate: "2020-01"
- "from 2015 to 2018" → startDate: "2015-01", endDate: "2018-01"
- "2019-present" → startDate: "2019-01", endDate: "", current: true

If the brief is valid and contains professional information, return ONLY a valid JSON object with this exact structure (no explanations, no markdown):

⚠️ FINAL REMINDER: Extract ALL dates mentioned in the brief and convert them to YYYY-MM format! ⚠️

{
  "firstName": "empty string (leave empty if not mentioned)",
  "lastName": "empty string (leave empty if not mentioned)", 
  "email": "empty string (leave empty if not mentioned)",
  "phone": "empty string (leave empty if not mentioned)",
  "address": "empty string (leave empty if not mentioned)",
  "city": "empty string (leave empty if not mentioned)",
  "state": "empty string (leave empty if not mentioned)",
  "zipCode": "empty string (leave empty if not mentioned)",
  "linkedIn": "empty string (leave empty if not mentioned)",
  "website": "empty string (leave empty if not mentioned)",
  "summary": "string (based on brief content)",
  "experiences": [
    {
      "id": "string",
      "company": "string (only if mentioned in brief)",
      "title": "string (only if mentioned in brief)", 
      "location": "string (only if mentioned in brief)",
      "startDate": "empty string or YYYY-MM format (e.g., '2023-01')",
      "endDate": "empty string or YYYY-MM format (e.g., '2023-01')",
      "current": boolean,
      "description": "string (based on brief content)"
    }
  ],
  "education": [
    {
      "id": "string",
      "school": "string (only if mentioned in brief)",
      "degree": "string (only if mentioned in brief)",
      "field": "string (only if mentioned in brief)",
      "location": "string (only if mentioned in brief)", 
      "startDate": "empty string or YYYY-MM format (e.g., '2023-01')",
      "endDate": "empty string or YYYY-MM format (e.g., '2023-01')",
      "current": boolean,
      "gpa": "string (optional, only if mentioned)"
    }
  ],
  "skills": ["string"],
  "certifications": [
    {
      "id": "string",
      "name": "string (only if mentioned in brief)",
      "issuer": "string (only if mentioned in brief)",
      "date": "empty string or YYYY-MM format (e.g., '2023-01')",
      "url": "string (optional, only if mentioned)"
    }
  ],
  "languages": [
    {
      "id": "string",
      "name": "string (only if mentioned in brief)",
      "proficiency": "Native|Fluent|Conversational|Basic",
      "rating": number
    }
  ],
  "customSections": [
    {
      "id": "string",
      "heading": "string (e.g., Projects, Volunteer Work, Publications, etc.)",
      "content": "string (detailed content for the custom section)"
    }
  ],
  "selectedTemplate": "modern-clean"
}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedContent = response.text().trim();
    
    if (!generatedContent) {
      res.status(500).json({ error: 'AI returned empty response' });
      return;
    }
    
    // Check if AI returned an INVALID_CONTENT response
    if (generatedContent.includes('INVALID_CONTENT:')) {
      const errorMessage = generatedContent.replace('INVALID_CONTENT:', '').trim();
      res.status(400).json({ error: errorMessage });
      return;
    }
    
    // Check if the entire response is just a JSON object with error message in summary
    if (generatedContent.includes('"summary":') && generatedContent.includes('not suitable for a professional resume')) {
      res.status(400).json({ 
        error: 'The provided information is not suitable for a professional resume. Please provide only professional work experience, education, skills, and achievements.' 
      });
      return;
    }
    
    // Check if the response contains markdown-wrapped JSON with error message
    if (generatedContent.includes('```json') && generatedContent.includes('not suitable for a professional resume')) {
      res.status(400).json({ 
        error: 'The provided information is not suitable for a professional resume. Please provide only professional work experience, education, skills, and achievements.' 
      });
      return;
    }
    
    // Check if the response contains any JSON structure with error message in summary (before parsing)
    if (generatedContent.includes('"summary"') && generatedContent.includes('not suitable for a professional resume')) {
      res.status(400).json({ 
        error: 'The provided information is not suitable for a professional resume. Please provide only professional work experience, education, skills, and achievements.' 
      });
      return;
    }
    
    // Clean up the response - remove any markdown formatting
    generatedContent = generatedContent
      .replace(/```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .trim();
    
    try {
      const resumeData = JSON.parse(generatedContent);
      
      // Check if the summary contains an error message
      if (resumeData.summary && resumeData.summary.includes('not suitable for a professional resume')) {
        res.status(400).json({ 
          error: 'The provided information is not suitable for a professional resume. Please provide only professional work experience, education, skills, and achievements.' 
        });
        return;
      }
      
      // Check if the entire response is just an error message (all fields empty except summary with error)
      const hasOnlyErrorSummary = resumeData.summary && 
        resumeData.summary.includes('not suitable for a professional resume') &&
        !resumeData.firstName && !resumeData.lastName && !resumeData.email && !resumeData.phone &&
        (!resumeData.experiences || resumeData.experiences.length === 0) &&
        (!resumeData.education || resumeData.education.length === 0) &&
        (!resumeData.skills || resumeData.skills.length === 0);
      
      if (hasOnlyErrorSummary) {
        res.status(400).json({ 
          error: 'The provided information is not suitable for a professional resume. Please provide only professional work experience, education, skills, and achievements.' 
        });
        return;
      }
      
      // Validate the structure
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'summary', 'experiences', 'education', 'skills', 'certifications', 'languages', 'customSections', 'selectedTemplate'];
      for (const field of requiredFields) {
        if (!(field in resumeData)) {
          res.status(500).json({ error: `Generated data missing required field: ${field}` });
          return;
        }
      }
      
      // CRITICAL: Ensure no fake dates are generated - clean up any suspicious dates
      const cleanDateFields = (obj: any) => {
        if (obj && typeof obj === 'object') {
          // Check for date-like fields and clean them if they look fake
          const dateFields = ['startDate', 'endDate', 'date'];
          dateFields.forEach(field => {
            if (obj[field] && typeof obj[field] === 'string') {
              // If it's not explicitly mentioned in the brief, it's likely fake
              // Only keep dates that are clearly valid and mentioned
              const dateValue = obj[field];
              if (dateValue && dateValue.trim() !== '' && !brief.toLowerCase().includes(dateValue.toLowerCase())) {
                // This date wasn't mentioned in the brief, so it's fake - remove it
                obj[field] = '';
              }
            }
          });
        }
      };
      
      // Clean up experiences
      if (resumeData.experiences && Array.isArray(resumeData.experiences)) {
        resumeData.experiences.forEach(cleanDateFields);
      }
      
      // Clean up education
      if (resumeData.education && Array.isArray(resumeData.education)) {
        resumeData.education.forEach(cleanDateFields);
      }
      
      // Clean up certifications
      if (resumeData.certifications && Array.isArray(resumeData.certifications)) {
        resumeData.certifications.forEach(cleanDateFields);
      }
      
      // CRITICAL: Ensure no fake personal information is generated
      const cleanPersonalInfo = () => {
        const personalFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'linkedIn', 'website'];
        personalFields.forEach(field => {
          if (resumeData[field] && typeof resumeData[field] === 'string') {
            const value = resumeData[field];
            // If the personal info wasn't explicitly mentioned in the brief, it's fake - remove it
            if (value && value.trim() !== '' && !brief.toLowerCase().includes(value.toLowerCase())) {
              resumeData[field] = '';
            }
          }
        });
      };
      
      // Clean up personal information
      cleanPersonalInfo();
      
      // Validate that the generated content is meaningful and not gibberish
      const isMeaningfulContent = (text: string): boolean => {
        if (!text || typeof text !== 'string') return false;
        
        // Check if the text contains mostly random characters or numbers
        const randomCharPattern = /[0-9]{3,}|[a-z]{1,2}[0-9]{2,}|[0-9]{2,}[a-z]{1,2}/gi;
        const hasRandomChars = randomCharPattern.test(text);
        
        // Check if the text has meaningful words (at least 3 characters)
        const words = text.split(/\s+/).filter(word => word.length >= 3);
        const meaningfulWords = words.length;
        
        // Check if the text is too short to be meaningful
        const isTooShort = text.length < 10;
        
        // If it has random character patterns, very few meaningful words, or is too short, it's likely gibberish
        return !hasRandomChars && meaningfulWords >= 2 && !isTooShort;
      };
      
      // Check if the summary and experience descriptions are meaningful
      if (resumeData.summary && !isMeaningfulContent(resumeData.summary)) {
        res.status(400).json({ 
          error: 'The provided information appears to be nonsensical or not suitable for a resume. Please provide meaningful professional information.' 
        });
        return;
      }
      
      if (resumeData.experiences && Array.isArray(resumeData.experiences)) {
        for (const exp of resumeData.experiences) {
          if (exp.description && !isMeaningfulContent(exp.description)) {
            res.status(400).json({ 
              error: 'The provided information appears to be nonsensical or not suitable for a resume. Please provide meaningful professional information.' 
            });
            return;
          }
        }
      }
      
      res.status(200).json(resumeData);
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      res.status(500).json({ error: 'Failed to parse generated data' });
    }
    
  } catch (error) {
    console.error('AI resume generation error:', error);
    res.status(500).json({ error: 'Failed to generate resume data' });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Local PDF export server running on port ${PORT}`);
}); 