import React, { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import sampleData from "@/data/sample.json";

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Native" | "Conversational" | "Basic" | "Fluent";
  rating: number;
}

export interface CustomSection {
  id: string;
  heading: string;
  content: string;
}

export interface ResumeData {
  // Basic Info
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
  
  // Professional Summary
  summary: string;
  
  // Experience
  experiences: Experience[];
  
  // Education
  education: Education[];
  
  // Skills
  skills: string[];
  
  // Certifications
  certifications: Certification[];
  
  // Languages
  languages: Language[];
  
  // Custom sections
  customSections: CustomSection[];
  
  // Selected template
  selectedTemplate: string;
}

interface ResumeState {
  data: ResumeData;
  isValid: boolean;
  errors: Record<string, string>;
  editedHtml?: string;
  isPreviewEditing: boolean;
  hasUserStartedEditing: boolean; // New property to track if user has started entering data
  enhancementCounts: Record<string, number>; // Track enhancement counts per field
}

type ResumeAction = 
  | { type: 'UPDATE_FIELD'; field: keyof ResumeData; value: any }
  | { type: 'ADD_EXPERIENCE'; experience: Experience }
  | { type: 'UPDATE_EXPERIENCE'; id: string; experience: Partial<Experience> }
  | { type: 'REMOVE_EXPERIENCE'; id: string }
  | { type: 'ADD_EDUCATION'; education: Education }
  | { type: 'UPDATE_EDUCATION'; id: string; education: Partial<Education> }
  | { type: 'REMOVE_EDUCATION'; id: string }
  | { type: 'ADD_CERTIFICATION'; certification: Certification }
  | { type: 'UPDATE_CERTIFICATION'; id: string; certification: Partial<Certification> }
  | { type: 'REMOVE_CERTIFICATION'; id: string }
  | { type: 'ADD_LANGUAGE'; language: Language }
  | { type: 'UPDATE_LANGUAGE'; id: string; language: Partial<Language> }
  | { type: 'REMOVE_LANGUAGE'; id: string }
  | { type: 'ADD_CUSTOM_SECTION'; customSection: CustomSection }
  | { type: 'UPDATE_CUSTOM_SECTION'; id: string; customSection: Partial<CustomSection> }
  | { type: 'REMOVE_CUSTOM_SECTION'; id: string }
  | { type: 'SET_TEMPLATE'; template: string }
  | { type: 'SET_TEMPLATE_FROM_URL'; template: string } // New action for template selection from URL
  | { type: 'LOAD_DATA'; data: ResumeData }
  | { type: 'RESET' }
  | { type: 'UPDATE_EDITED_CONTENT'; payload: { editedHtml: string } }
  | { type: 'SET_PREVIEW_EDITING'; payload: { isPreviewEditing: boolean } }
  | { type: 'SET_USER_STARTED_EDITING' } // New action to mark user has started editing
  | { type: 'INCREMENT_ENHANCEMENT_COUNT'; field: string }
  | { type: 'RESET_ENHANCEMENT_COUNTS' };

// Create empty initial data
const emptyData: ResumeData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  linkedIn: "",
  website: "",
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  customSections: [],
        selectedTemplate: "modern-clean"
};

const fixSampleLanguages = (languages: any[]): Language[] =>
  languages.map((lang) => ({
    ...lang,
    proficiency: ["Native", "Conversational", "Basic", "Fluent"].includes(lang.proficiency)
      ? lang.proficiency
      : "Basic"
  })) as Language[];

// Create dummy data for preview
const dummyData: ResumeData = {
  ...sampleData,
  languages: fixSampleLanguages(sampleData.languages),
  customSections: []
};

// Function to get data for preview - shows dummy data initially, then user data
const getPreviewData = (userData: ResumeData, hasUserStartedEditing: boolean): ResumeData => {
  if (hasUserStartedEditing) {
    return userData;
  }
  return dummyData;
};

const initialState: ResumeState = {
  data: emptyData, // Start with empty form data
  isValid: false,
  errors: {},
  editedHtml: undefined,
  isPreviewEditing: false,
  hasUserStartedEditing: false, // User hasn't started editing yet
  enhancementCounts: {} // Track enhancement counts per field
};

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  const { data } = state;
  
  switch (action.type) {
    case 'UPDATE_FIELD':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          [action.field]: action.value
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined,
        // Mark that user has started editing if this is their first input
        hasUserStartedEditing: true
      };
      
    case 'ADD_EXPERIENCE':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          experiences: [...data.experiences, action.experience]
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'UPDATE_EXPERIENCE':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          experiences: data.experiences.map(exp => 
            exp.id === action.id ? { ...exp, ...action.experience } : exp
          )
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'REMOVE_EXPERIENCE':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          experiences: data.experiences.filter(exp => exp.id !== action.id)
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'ADD_EDUCATION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          education: [...data.education, action.education]
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'UPDATE_EDUCATION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          education: data.education.map(edu => 
            edu.id === action.id ? { ...edu, ...action.education } : edu
          )
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'REMOVE_EDUCATION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          education: data.education.filter(edu => edu.id !== action.id)
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'ADD_CERTIFICATION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          certifications: [...data.certifications, action.certification]
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'UPDATE_CERTIFICATION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          certifications: data.certifications.map(cert => 
            cert.id === action.id ? { ...cert, ...action.certification } : cert
          )
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'REMOVE_CERTIFICATION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          certifications: data.certifications.filter(cert => cert.id !== action.id)
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'ADD_LANGUAGE':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          languages: [...data.languages, action.language]
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'UPDATE_LANGUAGE':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          languages: data.languages.map(lang => 
            lang.id === action.id ? { ...lang, ...action.language } : lang
          )
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'REMOVE_LANGUAGE':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          languages: data.languages.filter(lang => lang.id !== action.id)
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'ADD_CUSTOM_SECTION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          customSections: [...data.customSections, action.customSection]
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'UPDATE_CUSTOM_SECTION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          customSections: data.customSections.map(section => 
            section.id === action.id ? { ...section, ...action.customSection } : section
          )
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'REMOVE_CUSTOM_SECTION':
      // Prevent form updates when preview editing is active
      if (state.isPreviewEditing) {
        return state;
      }
      return {
        ...state,
        data: {
          ...data,
          customSections: data.customSections.filter(section => section.id !== action.id)
        },
        // Clear edited HTML when form changes to keep them in sync
        editedHtml: undefined
      };
      
    case 'SET_TEMPLATE':
      return {
        ...state,
        data: {
          ...data,
          selectedTemplate: action.template
        },
        // Clear edited HTML when template changes
        editedHtml: undefined
      };
      
    case 'SET_TEMPLATE_FROM_URL':
      return {
        ...state,
        data: {
          ...data,
          selectedTemplate: action.template
        },
        // Clear edited HTML when template changes
        editedHtml: undefined,
        // Mark that user has started editing since they're selecting from URL
        hasUserStartedEditing: true
      };
      
    case 'LOAD_DATA':
      return {
        ...state,
        data: action.data
      };
      
    case 'RESET':
      return initialState;
      
    case 'UPDATE_EDITED_CONTENT':
      return {
        ...state,
        editedHtml: action.payload.editedHtml
      };

    case 'SET_PREVIEW_EDITING':
      return {
        ...state,
        isPreviewEditing: action.payload.isPreviewEditing
      };
      
    case 'SET_USER_STARTED_EDITING':
      return {
        ...state,
        hasUserStartedEditing: true
      };
      
    case 'INCREMENT_ENHANCEMENT_COUNT':
      return {
        ...state,
        enhancementCounts: {
          ...state.enhancementCounts,
          [action.field]: (state.enhancementCounts[action.field] || 0) + 1
        }
      };
      
    case 'RESET_ENHANCEMENT_COUNTS':
      return {
        ...state,
        enhancementCounts: {}
      };
      
    default:
      return state;
  }
}

interface ResumeContextType {
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
  updateField: (field: keyof ResumeData, value: any) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addCertification: (certification: Certification) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addLanguage: (language: Language) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  addCustomSection: (customSection: CustomSection) => void;
  updateCustomSection: (id: string, customSection: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  setTemplate: (template: string) => void;
  setTemplateFromUrl: (template: string) => void; // New function for template selection from URL
  loadData: (data: ResumeData) => void;
  reset: () => void;
  updateEditedContent: (editedHtml: string) => void;
  setPreviewEditing: (isPreviewEditing: boolean) => void;
  setUserStartedEditing: () => void;
  incrementEnhancementCount: (field: string) => void;
  resetEnhancementCounts: () => void;
  getPreviewData: () => ResumeData; // Function to get data for preview
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);
  
  const updateField = useCallback((field: keyof ResumeData, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);
  
  const addExperience = useCallback((experience: Experience) => {
    dispatch({ type: 'ADD_EXPERIENCE', experience });
  }, []);
  
  const updateExperience = useCallback((id: string, experience: Partial<Experience>) => {
    dispatch({ type: 'UPDATE_EXPERIENCE', id, experience });
  }, []);
  
  const removeExperience = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_EXPERIENCE', id });
  }, []);
  
  const addEducation = useCallback((education: Education) => {
    dispatch({ type: 'ADD_EDUCATION', education });
  }, []);
  
  const updateEducation = useCallback((id: string, education: Partial<Education>) => {
    dispatch({ type: 'UPDATE_EDUCATION', id, education });
  }, []);
  
  const removeEducation = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_EDUCATION', id });
  }, []);
  
  const addCertification = useCallback((certification: Certification) => {
    dispatch({ type: 'ADD_CERTIFICATION', certification });
  }, []);
  
  const updateCertification = useCallback((id: string, certification: Partial<Certification>) => {
    dispatch({ type: 'UPDATE_CERTIFICATION', id, certification });
  }, []);
  
  const removeCertification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_CERTIFICATION', id });
  }, []);
  
  const addLanguage = useCallback((language: Language) => {
    dispatch({ type: 'ADD_LANGUAGE', language });
  }, []);
  
  const updateLanguage = useCallback((id: string, language: Partial<Language>) => {
    dispatch({ type: 'UPDATE_LANGUAGE', id, language });
  }, []);
  
  const removeLanguage = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_LANGUAGE', id });
  }, []);
  
  const addCustomSection = useCallback((customSection: CustomSection) => {
    dispatch({ type: 'ADD_CUSTOM_SECTION', customSection });
  }, []);
  
  const updateCustomSection = useCallback((id: string, customSection: Partial<CustomSection>) => {
    dispatch({ type: 'UPDATE_CUSTOM_SECTION', id, customSection });
  }, []);
  
  const removeCustomSection = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_SECTION', id });
  }, []);
  
  const setTemplate = useCallback((template: string) => {
    dispatch({ type: 'SET_TEMPLATE', template });
  }, []);
  
  const setTemplateFromUrl = useCallback((template: string) => {
    dispatch({ type: 'SET_TEMPLATE_FROM_URL', template });
  }, []);

  const loadData = useCallback((data: ResumeData) => {
    dispatch({ type: 'LOAD_DATA', data });
  }, []);
  
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const updateEditedContent = useCallback((editedHtml: string) => {
    dispatch({ type: 'UPDATE_EDITED_CONTENT', payload: { editedHtml } });
  }, []);

  const setPreviewEditing = useCallback((isPreviewEditing: boolean) => {
    dispatch({ type: 'SET_PREVIEW_EDITING', payload: { isPreviewEditing } });
  }, []);
  
  const setUserStartedEditing = useCallback(() => {
    dispatch({ type: 'SET_USER_STARTED_EDITING' });
  }, []);
  
  const incrementEnhancementCount = useCallback((field: string) => {
    dispatch({ type: 'INCREMENT_ENHANCEMENT_COUNT', field });
  }, []);
  
  const resetEnhancementCounts = useCallback(() => {
    dispatch({ type: 'RESET_ENHANCEMENT_COUNTS' });
  }, []);
  
  const value: ResumeContextType = {
    state,
    dispatch,
    updateField,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    setTemplate,
    setTemplateFromUrl,
    loadData,
    reset,
    updateEditedContent,
    setPreviewEditing,
    setUserStartedEditing,
    incrementEnhancementCount,
    resetEnhancementCounts,
    getPreviewData: () => getPreviewData(state.data, state.hasUserStartedEditing)
  };
  
  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}