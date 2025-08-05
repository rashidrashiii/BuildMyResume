import { ResumeData } from "@/contexts/ResumeContext";
import { validateResumeData as validateResumeDataSecurity, validateFieldLength, sanitizeInput, SECURITY_CONFIG } from "./security";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateResumeDataEnhanced = (data: ResumeData): ValidationResult => {
  const errors: ValidationError[] = [];

  const securityValidation = validateResumeDataSecurity(data);
  if (!securityValidation.isValid) {
    securityValidation.errors.forEach(error => {
      errors.push({ field: 'general', message: error });
    });
  }

  const basicFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'summary'];
  basicFields.forEach(field => {
    if (data[field]) {
      const sanitized = sanitizeInput(data[field]);
      if (sanitized !== data[field]) {
        errors.push({ field, message: `${field} contains invalid characters` });
      }
    }
  });

  if (data.experiences && Array.isArray(data.experiences)) {
    data.experiences.forEach((exp, index) => {
      const fields = ['company', 'title', 'description'];
      fields.forEach(field => {
        if (exp[field]) {
          const sanitized = sanitizeInput(exp[field]);
          if (sanitized !== exp[field]) {
            errors.push({ field: `${field}_${index}`, message: `${field} contains invalid characters` });
          }
        }
      });
    });
  }

  if (data.education && Array.isArray(data.education)) {
    data.education.forEach((edu, index) => {
      const fields = ['school', 'degree'];
      fields.forEach(field => {
        if (edu[field]) {
          const sanitized = sanitizeInput(edu[field]);
          if (sanitized !== edu[field]) {
            errors.push({ field: `${field}_${index}`, message: `${field} contains invalid characters` });
          }
        }
      });
    });
  }

  if (data.skills && Array.isArray(data.skills)) {
    data.skills.forEach((skill, index) => {
      if (skill) {
        const sanitized = sanitizeInput(skill);
        if (sanitized !== skill) {
          errors.push({ field: `skill_${index}`, message: 'Skill contains invalid characters' });
        }
      }
    });
  }

  if (data.certifications && Array.isArray(data.certifications)) {
    data.certifications.forEach((cert, index) => {
      const fields = ['name', 'issuer'];
      fields.forEach(field => {
        if (cert[field]) {
          const sanitized = sanitizeInput(cert[field]);
          if (sanitized !== cert[field]) {
            errors.push({ field: `${field}_${index}`, message: `${field} contains invalid characters` });
          }
        }
      });
    });
  }

  if (data.languages && Array.isArray(data.languages)) {
    data.languages.forEach((lang, index) => {
      if (lang.name) {
        const sanitized = sanitizeInput(lang.name);
        if (sanitized !== lang.name) {
          errors.push({ field: `language_${index}`, message: 'Language name contains invalid characters' });
        }
      }
    });
  }

  if (data.customSections && Array.isArray(data.customSections)) {
    data.customSections.forEach((section, index) => {
      const fields = ['heading', 'content'];
      fields.forEach(field => {
        if (section[field]) {
          const sanitized = sanitizeInput(section[field]);
          if (sanitized !== section[field]) {
            errors.push({ field: `${field}_${index}`, message: `${field} contains invalid characters` });
          }
        }
      });
    });
  }

  return { isValid: errors.length === 0, errors };
};

export const validateResumeData = (data: ResumeData): ValidationResult => {
  return validateResumeDataEnhanced(data);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

export const validateField = (field: string, value: any): string | null => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!isValidEmail(value)) return 'Please enter a valid email address';
      return null;
    
    case 'phone':
      if (!value) return 'Phone number is required';
      if (!isValidPhone(value)) return 'Please enter a valid phone number';
      return null;
    
    case 'website':
    case 'linkedIn':
      if (value && !isValidURL(value)) return 'Please enter a valid URL';
      return null;
    
    default:
      return null;
  }
};