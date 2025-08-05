import { PublishedResumeService } from "@/services/publishedResume";
import { ResumeData } from "@/contexts/ResumeContext";
import { encryptResumeData } from "@/utils/security";

export const sampleResumeData: ResumeData = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  linkedIn: "linkedin.com/in/sarah-johnson",
  website: "www.sarah-johnson.dev",
  summary: "Experienced full-stack developer with 5+ years of experience building scalable web applications. Passionate about creating user-friendly interfaces and robust backend systems. Skilled in React, Node.js, and cloud technologies.",
  experiences: [
    {
      id: "1",
      title: "Senior Full Stack Developer",
      company: "Tech Solutions Inc",
      location: "New York, NY",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description: "Lead development of customer-facing web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions. Mentored junior developers and conducted code reviews."
    },
    {
      id: "2",
      title: "Frontend Developer",
      company: "Digital Agency",
      location: "New York, NY",
      startDate: "2020-06",
      endDate: "2021-12",
      current: false,
      description: "Developed responsive web applications using React and TypeScript. Worked closely with designers to implement pixel-perfect UI components. Optimized application performance and improved user experience."
    }
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      school: "New York University",
      location: "New York, NY",
      startDate: "2016-09",
      endDate: "2020-05",
      current: false,
      gpa: "3.8"
    }
  ],
  skills: [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "MongoDB", "Git"
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-03",
      credentialId: "AWS-DEV-2023"
    }
  ],
  languages: [
    {
      id: "1",
      name: "English",
      proficiency: "Native",
      rating: 5
    },
    {
      id: "2",
      name: "Spanish",
      proficiency: "Conversational",
      rating: 3
    }
  ],
  customSections: [],
  selectedTemplate: "modern"
};

export const createSamplePublishedResume = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const encryptedData = encryptResumeData(sampleResumeData, 'sample-key');
    
    const result = await PublishedResumeService.publishResume(
      encryptedData.encrypted,
      'Sample Resume'
    );
    
    if (result.error) {
      return { success: false, error: result.error };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create sample resume' };
  }
};