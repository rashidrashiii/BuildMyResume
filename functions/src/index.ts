import * as functions from 'firebase-functions';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import * as CryptoJS from 'crypto-js';

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