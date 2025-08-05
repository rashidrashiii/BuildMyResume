import { saveAs } from 'file-saver';
import { ResumeData } from '@/contexts/ResumeContext';
import CryptoJS from 'crypto-js';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'json';
  template?: string;
  fileName?: string;
}

export const exportResume = async (data: ResumeData, options: ExportOptions) => {
  const fileName = options.fileName || generateFileName(data, options.format);

  switch (options.format) {
    case 'pdf':
      return exportToPDF(data, fileName);
    case 'docx':
      return exportToDOCX(data, fileName, options.template);
    case 'json':
      return exportToJSON(data, fileName);
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
};

export const exportToPDF = async (data: ResumeData, fileName: string) => {
  // This will be handled by react-to-print in the component
  // This function exists for consistency and future PDF generation enhancements
  throw new Error('PDF export should be handled by the ExportButtons component');
};

export const exportToDOCX = async (data: ResumeData, fileName: string, template?: string) => {
  try {
    // This is a placeholder for DOCX export functionality
    // In a real implementation, you would:
    // 1. Load the template file from public/templates/
    // 2. Use docxtemplater to replace placeholders
    // 3. Generate and download the file
    
    const templateId = template || data.selectedTemplate || 'modern';
    
    // For now, we'll create a simple text file as a placeholder
    const content = generateTextResume(data);
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, fileName.replace('.docx', '.txt'));
    
    throw new Error('DOCX export is not yet implemented. Please use PDF export for now.');
  } catch (error) {
    throw new Error(`Failed to export DOCX: ${error}`);
  }
};

export const exportToJSON = (data: ResumeData, fileName: string) => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, fileName);
  } catch (error) {
    throw new Error(`Failed to export JSON: ${error}`);
  }
};

export const generateFileName = (data: ResumeData, format: string): string => {
  const firstName = data.firstName || 'Resume';
  const lastName = data.lastName || '';
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const name = [firstName, lastName].filter(Boolean).join('_');
  return `${name}_Resume_${timestamp}.${format}`;
};

export const generateTextResume = (data: ResumeData): string => {
  let content = '';

  // Header
  content += `${data.firstName} ${data.lastName}\n`;
  content += '='.repeat(30) + '\n\n';
  
  // Contact Information
  if (data.email) content += `Email: ${data.email}\n`;
  if (data.phone) content += `Phone: ${data.phone}\n`;
  if (data.address) content += `Address: ${data.address}`;
  if (data.city || data.state) content += `, ${[data.city, data.state].filter(Boolean).join(', ')}`;
  if (data.zipCode) content += ` ${data.zipCode}`;
  content += '\n';
  if (data.linkedIn) content += `LinkedIn: ${data.linkedIn}\n`;
  if (data.website) content += `Website: ${data.website}\n`;
  content += '\n';

  // Professional Summary
  if (data.summary) {
    content += 'PROFESSIONAL SUMMARY\n';
    content += '-'.repeat(20) + '\n';
    content += `${data.summary}\n\n`;
  }

  // Work Experience
  if (data.experiences.length > 0) {
    content += 'WORK EXPERIENCE\n';
    content += '-'.repeat(15) + '\n';
    data.experiences.forEach(exp => {
      content += `${exp.title} at ${exp.company}\n`;
      if (exp.location) content += `${exp.location}\n`;
      const startDate = formatDate(exp.startDate);
      const endDate = exp.current ? 'Present' : formatDate(exp.endDate);
      content += `${startDate} - ${endDate}\n`;
      if (exp.description) content += `${exp.description}\n`;
      content += '\n';
    });
  }

  // Education
  if (data.education.length > 0) {
    content += 'EDUCATION\n';
    content += '-'.repeat(9) + '\n';
    data.education.forEach(edu => {
      content += `${edu.degree}\n`;
      content += `${edu.school}`;
      if (edu.location) content += `, ${edu.location}`;
      content += '\n';
      const startDate = formatDate(edu.startDate);
      const endDate = edu.current ? 'Present' : formatDate(edu.endDate);
      content += `${startDate} - ${endDate}`;
      if (edu.gpa) content += ` | GPA: ${edu.gpa}`;
      content += '\n\n';
    });
  }

  // Skills
  if (data.skills.length > 0) {
    content += 'SKILLS\n';
    content += '-'.repeat(6) + '\n';
    content += data.skills.join(', ') + '\n\n';
  }

  // Certifications
  if (data.certifications.length > 0) {
    content += 'CERTIFICATIONS\n';
    content += '-'.repeat(13) + '\n';
    data.certifications.forEach(cert => {
      content += `${cert.name} - ${cert.issuer}`;
      if (cert.date) content += ` (${formatDate(cert.date)})`;
      if (cert.credentialId) content += ` | ID: ${cert.credentialId}`;
      content += '\n';
    });
    content += '\n';
  }

  // Languages
  if (data.languages.length > 0) {
    content += 'LANGUAGES\n';
    content += '-'.repeat(9) + '\n';
    data.languages.forEach(lang => {
      content += `${lang.name}: ${lang.proficiency}\n`;
    });
  }

  return content;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + '-01');
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const importFromJSON = (jsonString: string): ResumeData => {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate the imported data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON format');
    }

    // Return the data with fallbacks for missing fields
    return {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zipCode: data.zipCode || '',
      linkedIn: data.linkedIn || '',
      website: data.website || '',
      summary: data.summary || '',
      experiences: Array.isArray(data.experiences) ? data.experiences : [],
      education: Array.isArray(data.education) ? data.education : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      languages: Array.isArray(data.languages) ? data.languages : [],
      customSections: Array.isArray(data.customSections) ? data.customSections : [],
      selectedTemplate: data.selectedTemplate || 'modern'
    };
  } catch (error) {
    throw new Error(`Failed to import JSON: ${error}`);
  }
};

/**
 * Generates a random 256-bit (32-byte) key, base64 encoded.
 */
export function generateEncryptionKey(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(array));
}

/**
 * Encrypts a string using AES with the provided base64 key.
 */
export function encryptAES(plainText: string, base64Key: string): string {
  const key = CryptoJS.enc.Base64.parse(base64Key);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv });
  // Store IV with ciphertext (IV:ciphertext)
  return `${CryptoJS.enc.Base64.stringify(iv)}:${encrypted.toString()}`;
}

/**
 * Decrypts a string using AES with the provided base64 key.
 */
export function decryptAES(cipherText: string, base64Key: string): string {
  const [ivB64, encrypted] = cipherText.split(':');
  if (!ivB64 || !encrypted) throw new Error('Invalid encrypted data format');
  const key = CryptoJS.enc.Base64.parse(base64Key);
  const iv = CryptoJS.enc.Base64.parse(ivB64);
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}