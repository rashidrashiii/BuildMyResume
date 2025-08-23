import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

// Define types first
export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Conversational" | "Basic";
  rating: number;
}

export interface CustomSection {
  id: string;
  heading: string;
  content: string;
}

export interface ResumeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  linkedIn: string;
  website: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
  selectedTemplate: string;
}

interface ResumeState {
  data: ResumeData;
  isValid: boolean;
  errors: Record<string, string>;
  editedHtml: string | undefined;
  isPreviewEditing: boolean;
  hasUserStartedEditing: boolean;
  enhancementCounts: Record<string, number>;
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
  | { type: 'SET_TEMPLATE_FROM_URL'; template: string }
  | { type: 'LOAD_DATA'; data: ResumeData }
  | { type: 'RESET' }
  | { type: 'UPDATE_EDITED_CONTENT'; payload: { editedHtml: string } }
  | { type: 'SET_PREVIEW_EDITING'; payload: { isPreviewEditing: boolean } }
  | { type: 'SET_USER_STARTED_EDITING' }
  | { type: 'INCREMENT_ENHANCEMENT_COUNT'; field: string }
  | { type: 'RESET_ENHANCEMENT_COUNTS' };

// Create empty data for initialization
const emptyData: ResumeData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  linkedIn: '',
  website: '',
  summary: '',
  experiences: [
    {
      id: '1',
      company: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  education: [
    {
      id: '1',
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
    },
  ],
  skills: [],
  certifications: [],
  languages: [],
  customSections: [],
  selectedTemplate: 'modern-clean',
};

// Create dummy data for the preview (this is used when user hasn't started editing)
const dummyData: ResumeData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@email.com',
  phone: '(555) 123-4567',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  linkedIn: 'linkedin.com/in/johndoe',
  website: 'johndoe.com',
  summary: 'Experienced software developer with 5+ years of expertise in full-stack development. Passionate about creating scalable web applications and leading development teams.',
  experiences: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      title: 'Senior Software Developer',
      location: 'New York, NY',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Lead development of modern web applications using React, Node.js, and cloud technologies. Manage a team of 3 junior developers and collaborate with product managers to deliver high-quality solutions.',
    },
    {
      id: '2',
      company: 'StartupXYZ',
      title: 'Full Stack Developer',
      location: 'San Francisco, CA',
      startDate: '2019-06',
      endDate: '2020-12',
      current: false,
      description: 'Developed and maintained multiple client projects using modern JavaScript frameworks. Implemented responsive designs and optimized application performance.',
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Boston, MA',
      startDate: '2015-09',
      endDate: '2019-05',
      current: false,
      gpa: '3.8',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-03',
      credentialId: 'AWS-123456',
    },
  ],
  languages: [
    {
      id: '1',
      name: 'English',
      proficiency: 'Native',
      rating: 5,
    },
    {
      id: '2',
      name: 'Spanish',
      proficiency: 'Conversational',
      rating: 3,
    },
  ],
  customSections: [],
  selectedTemplate: 'modern-clean',
};

const getPreviewData = (data: ResumeData, hasUserStartedEditing: boolean): ResumeData => {
  // If user hasn't started editing, show dummy data in preview
  if (!hasUserStartedEditing) {
    return dummyData;
  }

  return data;
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
        data: action.data,
        // Clear preview editing to allow form updates
        isPreviewEditing: false,
        // Clear edited HTML to sync with new data
        editedHtml: undefined,
        // Mark that user has started editing
        hasUserStartedEditing: true
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