interface AIEnhancementRequest {
  field: string;
  content: string;
  context?: {
    jobTitle?: string;
    industry?: string;
    targetRole?: string;
  };
}

interface AIEnhancementResponse {
  enhancedContent: string;
  originalContent: string;
  field: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const enhanceContentWithAI = async (
  field: string,
  content: string,
  context?: any,
  rejectedResponses?: string[]
): Promise<AIEnhancementResponse> => {
  try {
    // Create request payload
    const payload: any = {
      field,
      content,
      context,
      rejectedResponses
    };
    
    // Add signature if SHARED_SECRET is available
    const SHARED_SECRET = import.meta.env.VITE_SHARED_SECRET;
    if (SHARED_SECRET) {
      const CryptoJS = await import('crypto-js');
      const signature = CryptoJS.HmacSHA256(JSON.stringify({ field, content }), SHARED_SECRET).toString();
      payload.signature = signature;
    }
    
    const response = await fetch(`${API_BASE_URL}/enhance-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to enhance content');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw error;
  }
};

export const generateResumeFromBrief = async (
  brief: string,
  context?: {
    targetRole?: string;
    industry?: string;
    experienceLevel?: string;
  }
): Promise<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  linkedIn?: string;
  website?: string;
  summary: string;
  experiences: Array<{
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: "Native" | "Conversational" | "Basic" | "Fluent";
    rating: number;
  }>;
  customSections: Array<{
    id: string;
    heading: string;
    content: string;
  }>;
  selectedTemplate: string;
}> => {
  try {
    // Create request payload
    const payload: any = {
      brief,
      context,
      type: 'generate-resume'
    };
    
    // Add signature if SHARED_SECRET is available
    const SHARED_SECRET = import.meta.env.VITE_SHARED_SECRET;
    if (SHARED_SECRET) {
      const CryptoJS = await import('crypto-js');
      const signature = CryptoJS.HmacSHA256(JSON.stringify({ brief, type: 'generate-resume' }), SHARED_SECRET).toString();
      payload.signature = signature;
    }
    
    const response = await fetch(`${API_BASE_URL}/generate-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate resume data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI resume generation error:', error);
    throw error;
  }
};

export const AI_FIELDS = {
  SUMMARY: 'summary',
  JOB_DESCRIPTION: 'jobDescription',
  SKILLS: 'skills',
  CUSTOM_SECTION: 'customSection',
  JOB_TITLE: 'jobTitle',
  COMPANY: 'company'
} as const;

export type AIField = typeof AI_FIELDS[keyof typeof AI_FIELDS];
