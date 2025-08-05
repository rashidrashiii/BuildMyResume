import { ResumeData } from '@/contexts/ResumeContext';

const STORAGE_KEY = 'BuildMyResume_data';
const AUTO_SAVE_KEY = 'BuildMyResume_autosave';

export const saveToStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    // Silent fail for production
  }
};

export const loadFromStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    return null;
  }
};

export const autoSave = (data: any): void => {
  try {
    const timestamp = new Date().toISOString();
    const autoSaveData = { data, timestamp };
    localStorage.setItem('resume_autosave', JSON.stringify(autoSaveData));
  } catch (error) {
    // Silent fail for production
  }
};

export const loadAutoSave = (): any => {
  try {
    const autoSaveData = localStorage.getItem('resume_autosave');
    if (autoSaveData) {
      const parsed = JSON.parse(autoSaveData);
      const isRecent = new Date(parsed.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000;
      return isRecent ? parsed.data : null;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem('resume_data');
    localStorage.removeItem('resume_autosave');
  } catch (error) {
    // Silent fail for production
  }
};

export const hasStoredData = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

export const getStorageSize = (): number => {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    return 0;
  }
};

export const exportAllData = (): string => {
  try {
    const data = {
      resume_data: loadFromStorage('resume_data'),
      auto_save: loadFromStorage('resume_autosave'),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return JSON.stringify({ error: 'Failed to export data' });
  }
};

export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (data.resume_data) {
      saveToStorage('resume_data', data.resume_data);
    }
    if (data.auto_save) {
      saveToStorage('resume_autosave', data.auto_save);
    }
    return true;
  } catch (error) {
    return false;
  }
};