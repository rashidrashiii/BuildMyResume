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

export const AI_FIELDS = {
  SUMMARY: 'summary',
  JOB_DESCRIPTION: 'jobDescription',
  SKILLS: 'skills',
  CUSTOM_SECTION: 'customSection',
  JOB_TITLE: 'jobTitle',
  COMPANY: 'company'
} as const;

export type AIField = typeof AI_FIELDS[keyof typeof AI_FIELDS];
