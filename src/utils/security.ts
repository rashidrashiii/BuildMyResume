import CryptoJS from 'crypto-js';

const SECURITY_CONFIG = {
  MAX_RESUME_SIZE: 1024 * 1024,
  MAX_FIELD_LENGTH: 10000,
  MAX_EXPERIENCES: 20,
  MAX_EDUCATION: 10,
  MAX_SKILLS: 50,
  MAX_CERTIFICATIONS: 15,
  MAX_LANGUAGES: 10,
  MAX_CUSTOM_SECTIONS: 5,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000,
  MAX_REQUESTS_PER_WINDOW: 100,
  PDF_EXPORT_LIMIT: 20,
  PDF_EXPORT_WINDOW: 60 * 60 * 1000,
  ENABLE_RATE_LIMITING: true,
} as const;

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.loadFromStorage();
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private getKey(identifier: string, action: string): string {
    return `${identifier}:${action}`;
  }

  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.requests);
      localStorage.setItem('rateLimiter', JSON.stringify(data));
    } catch (error) {
      // Silent fail for production
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('rateLimiter');
      if (data) {
        const parsed = JSON.parse(data);
        this.requests = new Map(Object.entries(parsed));
      }
    } catch (error) {
      // Silent fail for production
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW;
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
    this.saveToStorage();
  }

  isAllowed(identifier: string, action: string, limit: number, window: number): boolean {
    if (!SECURITY_CONFIG.ENABLE_RATE_LIMITING) {
      return true;
    }
    
    const key = this.getKey(identifier, action);
    const now = Date.now();
    const windowStart = now - window;

    const timestamps = this.requests.get(key) || [];
    const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);

    if (validTimestamps.length >= limit) {
      return false;
    }

    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    this.saveToStorage();
    return true;
  }

  getRemainingRequests(identifier: string, action: string, limit: number, window: number): number {
    if (!SECURITY_CONFIG.ENABLE_RATE_LIMITING) {
      return 999;
    }
    
    const key = this.getKey(identifier, action);
    const now = Date.now();
    const windowStart = now - window;

    const timestamps = this.requests.get(key) || [];
    const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);

    return Math.max(0, limit - validTimestamps.length);
  }

  resetLimits(identifier?: string, action?: string): void {
    if (identifier && action) {
      const key = this.getKey(identifier, action);
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
    this.saveToStorage();
  }

  resetAllLimits(): void {
    this.requests.clear();
    this.saveToStorage();
    localStorage.removeItem('rateLimiter');
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

const rateLimiter = new RateLimiter();

const getClientIdentifier = (): string => {
  return navigator.userAgent + (navigator.language || '') + (screen.width || '') + (screen.height || '');
};

export const validateResumeDataSize = (data: any): { isValid: boolean; error?: string } => {
  const dataSize = JSON.stringify(data).length;
  if (dataSize > SECURITY_CONFIG.MAX_RESUME_SIZE) {
    return { isValid: false, error: `Resume data too large (${Math.round(dataSize / 1024)}KB). Maximum allowed: ${Math.round(SECURITY_CONFIG.MAX_RESUME_SIZE / 1024)}KB` };
  }
  return { isValid: true };
};

export const validateFieldLength = (field: string, value: string): { isValid: boolean; error?: string } => {
  if (value.length > SECURITY_CONFIG.MAX_FIELD_LENGTH) {
    return { isValid: false, error: `${field} too long. Maximum allowed: ${SECURITY_CONFIG.MAX_FIELD_LENGTH} characters` };
  }
  return { isValid: true };
};

export const validateArrayLength = (field: string, array: any[], maxLength: number): { isValid: boolean; error?: string } => {
  if (array.length > maxLength) {
    return { isValid: false, error: `Too many ${field}. Maximum allowed: ${maxLength}` };
  }
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const checkRateLimit = (action: string): { allowed: boolean; remaining: number; resetTime?: number } => {
  const identifier = getClientIdentifier();
  
  let limit: number;
  let window: number;
  
  switch (action) {
    case 'pdf_export':
      limit = SECURITY_CONFIG.PDF_EXPORT_LIMIT;
      window = SECURITY_CONFIG.PDF_EXPORT_WINDOW;
      break;
    case 'resume_publish':
      limit = SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW;
      window = SECURITY_CONFIG.RATE_LIMIT_WINDOW;
      break;
    default:
      limit = SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW;
      window = SECURITY_CONFIG.RATE_LIMIT_WINDOW;
  }
  
  const allowed = rateLimiter.isAllowed(identifier, action, limit, window);
  const remaining = rateLimiter.getRemainingRequests(identifier, action, limit, window);
  
  return { 
    allowed, 
    remaining,
    resetTime: allowed ? undefined : Date.now() + window
  };
};

export const validateResumeData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const sizeValidation = validateResumeDataSize(data);
  if (!sizeValidation.isValid) {
    errors.push(sizeValidation.error!);
  }

  if (data.personalInfo) {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'summary'];
    fields.forEach(field => {
      if (data.personalInfo[field]) {
        const validation = validateFieldLength(field, data.personalInfo[field]);
        if (!validation.isValid) {
          errors.push(validation.error!);
        }
      }
    });
  }

  if (data.experience && Array.isArray(data.experience)) {
    const arrayValidation = validateArrayLength('experiences', data.experience, SECURITY_CONFIG.MAX_EXPERIENCES);
    if (!arrayValidation.isValid) {
      errors.push(arrayValidation.error!);
    }

    data.experience.forEach((exp: any, index: number) => {
      const fields = ['company', 'position', 'description'];
      fields.forEach(field => {
        if (exp[field]) {
          const validation = validateFieldLength(`${field} (experience ${index + 1})`, exp[field]);
          if (!validation.isValid) {
            errors.push(validation.error!);
          }
        }
      });
    });
  }

  if (data.education && Array.isArray(data.education)) {
    const arrayValidation = validateArrayLength('education', data.education, SECURITY_CONFIG.MAX_EDUCATION);
    if (!arrayValidation.isValid) {
      errors.push(arrayValidation.error!);
    }
  }

  if (data.skills && Array.isArray(data.skills)) {
    const arrayValidation = validateArrayLength('skills', data.skills, SECURITY_CONFIG.MAX_SKILLS);
    if (!arrayValidation.isValid) {
      errors.push(arrayValidation.error!);
    }
  }

  return { isValid: errors.length === 0, errors };
};

export const encryptResumeData = (data: any, key: string): { encrypted: string; signature: string } => {
  if (SECURITY_CONFIG.ENABLE_RATE_LIMITING) {
    const rateLimit = checkRateLimit('resume_publish');
    if (!rateLimit.allowed) {
      throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil((rateLimit.resetTime! - Date.now()) / 60000)} minutes.`);
    }
  }

  const jsonData = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonData, key).toString();
  const signature = CryptoJS.HmacSHA256(encrypted, key).toString();
  
  return { encrypted, signature };
};

export const securePdfExport = async (html: string, key: string): Promise<string> => {
  if (SECURITY_CONFIG.ENABLE_RATE_LIMITING) {
    const rateLimit = checkRateLimit('pdf_export');
    if (!rateLimit.allowed) {
      throw new Error(`PDF export limit exceeded. Please try again in ${Math.ceil((rateLimit.resetTime! - Date.now()) / 60000)} minutes.`);
    }
  }

  const signature = CryptoJS.HmacSHA256(html, key).toString();
  return signature;
};

export const cleanupSecurity = (): void => {
  rateLimiter.destroy();
};

export const resetRateLimits = (action?: string): void => {
  if (action) {
    rateLimiter.resetLimits(getClientIdentifier(), action);
  } else {
    rateLimiter.resetAllLimits();
  }
};

export const clearAllRateLimits = (): void => {
  rateLimiter.resetAllLimits();
};

export const resetAllRateLimitsGlobal = (): void => {
  rateLimiter.resetAllLimits();
  
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.includes('rate') || key.includes('limit') || key.includes('Rate')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    // Silent fail for production
  }
  
  try {
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('rate') || key.includes('limit') || key.includes('Rate')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    // Silent fail for production
  }
};

export { SECURITY_CONFIG }; 