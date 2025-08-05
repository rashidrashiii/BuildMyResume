import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Code, Star, Terminal } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const SoftwareEngineerResume = forwardRef<HTMLDivElement, { data: ResumeData }>((props, ref) => {
  const { data } = props;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    const start = formatDate(startDate);
    const end = current ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const renderStars = (proficiency: string) => {
    // Calculate rating based on proficiency level
    let rating: number;
    switch (proficiency) {
      case 'Native': rating = 5; break;
      case 'Fluent': rating = 4; break;
      case 'Conversational': rating = 3; break;
      case 'Basic': rating = 2; break;
      default: rating = 1; break;
    }
    
    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < rating;
      return (
        <Star
          key={i}
          className="h-3 w-3"
          style={{
            fill: isFilled ? '#10b981' : 'none',
            stroke: isFilled ? '#10b981' : '#6b7280',
          }}
        />
      );
    });
  };

  // Categorize skills for better organization
  const categorizeSkills = (skills: string[]) => {
    const categories = {
      languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'],
      frameworks: ['React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails'],
      databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB', 'Firebase', 'SQLite'],
      tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'Webpack', 'Babel']
    };

    const categorized = {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      other: []
    };

    skills.forEach(skill => {
      let found = false;
      for (const [category, categorySkills] of Object.entries(categories)) {
        if (categorySkills.some(categorySkill => 
          skill.toLowerCase().includes(categorySkill.toLowerCase()) || 
          categorySkill.toLowerCase().includes(skill.toLowerCase())
        )) {
          categorized[category].push(skill);
          found = true;
          break;
        }
      }
      if (!found) {
        categorized.other.push(skill);
      }
    });

    return categorized;
  };

  const skillCategories = categorizeSkills(data.skills);

  return (
    <div ref={ref} className="bg-white text-black mx-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", fontSize: '11px', lineHeight: '1.5', maxWidth: '8.27in', width: '100%' }}>
      {/* Header with Terminal-Inspired Design */}
      <header className="relative mb-4" style={{ background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)', padding: '16px', borderRadius: '0' }}>
        {/* Terminal-like top bar */}
        <div 
          data-preserve="true" 
          className="flex items-center mb-3"
          style={{ 
            background: '#111827', 
            padding: '6px 10px', 
            borderRadius: '4px', 
            marginBottom: '12px' 
          }}
        >
          <div className="flex gap-1">
            <div data-preserve="true" style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
            <div data-preserve="true" style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></div>
            <div data-preserve="true" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
          </div>
          <div className="flex-1 text-center text-gray-400" style={{ fontSize: '9px' }}>
            ~/portfolio/resume.tsx
          </div>
        </div>

        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Terminal className="h-4 w-4 text-green-400" />
            <h1 className="font-bold" style={{ fontSize: '20px', color: '#10b981' }}>
              {data.firstName} {data.lastName}
            </h1>
          </div>
          
          <div className="text-gray-300 mb-3" style={{ fontSize: '12px', fontWeight: '500' }}>
            {data.experiences && data.experiences.length > 0 ? data.experiences[0].title : 'Professional'}
          </div>
          
          {/* Contact Information in Code-like Format */}
          <div className="grid grid-cols-2 gap-1 text-xs mb-3" style={{ background: '#111827', padding: '8px', borderRadius: '4px', fontFamily: 'monospace' }} data-preserve="true">
            {data.email && (
              <div className="flex items-center gap-1" style={{ color: '#60a5fa' }} data-preserve="true">
                <Mail className="h-3 w-3" />
                <span>email: "{data.email}"</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-1" style={{ color: '#34d399' }} data-preserve="true">
                <Phone className="h-3 w-3" />
                <span>phone: "{data.phone}"</span>
              </div>
            )}
            {(data.city || data.state) && (
              <div className="flex items-center gap-1" style={{ color: '#fbbf24' }} data-preserve="true">
                <MapPin className="h-3 w-3" />
                <span>location: "{[data.city, data.state].filter(Boolean).join(', ')}"</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center gap-1" style={{ color: '#a78bfa' }} data-preserve="true">
                <Globe className="h-3 w-3" />
                <span>website: "{data.website}"</span>
              </div>
            )}
            {data.linkedIn && (
              <div className="flex items-center gap-1" style={{ color: '#22d3ee' }} data-preserve="true">
                <Linkedin className="h-3 w-3" />
                <span>linkedin: "{data.linkedIn}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Code comment style decoration */}
        <div 
          data-preserve="true" 
          className="absolute bottom-0 left-0 right-0"
          style={{ 
            height: '2px', 
            background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)', 
            borderRadius: '0 0 8px 8px' 
          }}
        ></div>
      </header>

      <div className="px-4">
        {/* Professional Summary with Code Block Style */}
        {data.summary && (
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-4 w-4 text-green-500" />
              <h2 className="font-bold text-gray-900" style={{ fontSize: '12px' }}>
                const summary = () = {"{"}
              </h2>
            </div>
            <div 
              className="p-4 rounded-lg ml-6"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981' }}
              data-preserve="true"
            >
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: '13px' }}>
                return "{data.summary}";
              </p>
            </div>
            <div className="ml-6 text-gray-900 font-bold" style={{ fontSize: '16px' }}>
              {"}"};
            </div>
          </section>
        )}

        {/* Technical Skills Section */}
        {data.skills.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-blue-500" />
              <h2 className="font-bold text-gray-900" style={{ fontSize: '16px' }}>
                Technical Stack
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(skillCategories).map(([category, skills]) => {
                if (skills.length === 0) return null;
                
                const categoryColors = {
                  languages: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
                  frameworks: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
                  databases: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
                  tools: { bg: '#e0e7ff', border: '#8b5cf6', text: '#5b21b6' },
                  other: { bg: '#f3f4f6', border: '#6b7280', text: '#374151' }
                };
                
                const colors = categoryColors[category];
                
                return (
                  <div key={category} className="mb-4">
                    <h3 className="font-semibold mb-2 capitalize" style={{ fontSize: '14px', color: colors.text }}>
                      {category === 'other' ? 'Additional Skills' : category}:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            background: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`
                          }}
                          data-preserve="true"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {data.experiences.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-purple-500" />
              <h2 className="font-bold text-gray-900" style={{ fontSize: '16px' }}>
                Work Experience
              </h2>
            </div>
            
            <div className="space-y-6">
              {data.experiences.map((experience, index) => (
                <div key={experience.id} className="relative">
                  <div className="ml-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900" style={{ fontSize: '15px' }}>
                          {experience.title}
                        </h3>
                        <p className="font-semibold text-blue-600" style={{ fontSize: '14px' }}>
                          {experience.company}
                          {experience.location && ` • ${experience.location}`}
                        </p>
                      </div>
                      <div 
                        className="text-white px-3 py-1 rounded-full text-xs font-medium mt-1 md:mt-0"
                        style={{ 
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          minWidth: 'fit-content'
                        }}
                        data-preserve="true"
                      >
                        {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                      </div>
                    </div>
                    
                    {experience.description && (
                      <div 
                        className="p-3 rounded-lg"
                        style={{ 
                          background: '#f8fafc', 
                          border: '1px solid #e2e8f0',
                          borderLeft: '3px solid #3b82f6'
                        }}
                        data-preserve="true"
                      >
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line" style={{ fontSize: '12px' }}>
                          {experience.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-column layout for remaining sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    data-preserve="true"
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      background: '#f59e0b', 
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>ED</span>
                  </div>
                  <h2 className="font-bold text-gray-900" style={{ fontSize: '15px' }}>
                    Education
                  </h2>
                </div>
                <div className="space-y-3">
                  {data.education.map((education) => (
                    <div 
                      key={education.id}
                      className="p-3 rounded-lg"
                      style={{ background: '#fef9e7', border: '1px solid #fde68a' }}
                      data-preserve="true"
                    >
                      <h3 className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                        {education.degree}
                      </h3>
                      <p className="font-medium text-amber-700" style={{ fontSize: '12px' }}>
                        {education.school}
                        {education.location && ` • ${education.location}`}
                      </p>
                      {education.gpa && (
                        <p className="text-gray-600" style={{ fontSize: '11px' }}>
                          GPA: {education.gpa}
                        </p>
                      )}
                      <p className="text-gray-600" style={{ fontSize: '11px' }}>
                        {formatDateRange(education.startDate, education.endDate, education.current)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    data-preserve="true"
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      background: '#10b981', 
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>✓</span>
                  </div>
                  <h2 className="font-bold text-gray-900" style={{ fontSize: '15px' }}>
                    Certifications
                  </h2>
                </div>
                <div className="space-y-3">
                  {data.certifications.map((certification) => (
                    <div 
                      key={certification.id}
                      className="p-3 rounded-lg"
                      style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}
                      data-preserve="true"
                    >
                      <h3 className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                        {certification.name}
                      </h3>
                      <p className="font-medium text-green-700" style={{ fontSize: '12px' }}>
                        {certification.issuer}
                      </p>
                      {certification.credentialId && (
                        <p className="text-gray-600" style={{ fontSize: '11px' }}>
                          ID: {certification.credentialId}
                        </p>
                      )}
                      <p className="text-gray-600" style={{ fontSize: '11px' }}>
                        {formatDate(certification.date)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Languages */}
            {data.languages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    data-preserve="true"
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      background: '#8b5cf6', 
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>🗣</span>
                  </div>
                  <h2 className="font-bold text-gray-900" style={{ fontSize: '15px' }}>
                    Languages
                  </h2>
                </div>
                <div className="space-y-3">
                  {data.languages.map((language) => (
                    <div 
                      key={language.id} 
                      className="flex justify-between items-center p-3 rounded-lg"
                      style={{ background: '#f3f0ff', border: '1px solid #c4b5fd' }}
                      data-preserve="true"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                          {language.name}
                        </h3>
                        <p className="text-purple-700" style={{ fontSize: '11px' }}>
                          {language.proficiency}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(language.proficiency)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <div className="mt-6 space-y-6">
            {data.customSections.map((section) => (
              <section key={section.id}>
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    data-preserve="true"
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      background: '#6b7280', 
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>+</span>
                  </div>
                  <h2 className="font-bold text-gray-900" style={{ fontSize: '15px' }}>
                    {section.heading}
                  </h2>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
                  data-preserve="true"
                >
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line" style={{ fontSize: '12px' }}>
                    {section.content}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer with code signature */}
        <div 
          data-preserve="true" 
          className="mt-8 text-center"
          style={{ 
            padding: '12px',
            background: '#1f2937',
            color: '#9ca3af',
            fontSize: '11px',
            borderRadius: '6px',
            fontFamily: 'monospace'
          }}
        >
          // End of resume.tsx - Built with <span style={{ color: '#ef4444' }}>❤️</span> and <span style={{ color: '#f59e0b' }}>☕</span>
        </div>

        {/* Empty State */}
        {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Terminal className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-3">Resume Preview</h3>
            <p>Start coding your career story!</p>
          </div>
        )}
      </div>
    </div>
  );
});

SoftwareEngineerResume.displayName = "SoftwareEngineerResume";

export default SoftwareEngineerResume;