import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Star } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const ElitePremiumResume = forwardRef<HTMLDivElement, { data: ResumeData }>((props, ref) => {
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
            fill: isFilled ? '#1f2937' : 'none',
            stroke: isFilled ? '#1f2937' : '#d1d5db',
          }}
        />
      );
    });
  };

  return (
    <div ref={ref} className="bg-white text-black mx-auto" style={{ fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: '1.4', maxWidth: '8.27in', width: '100%' }}>
      {/* Header Section with Elite Styling */}
      <header className="relative mb-4" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '16px', borderRadius: '0 0 8px 8px' }}>
        {/* Decorative accent line */}
        <div 
          data-preserve="true" 
          style={{ 
            position: 'absolute', 
            top: '0', 
            left: '0', 
            right: '0', 
            height: '3px', 
            background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)' 
          }}
        ></div>
        
        <div className="text-center text-white">
          <h1 className="font-bold mb-1" style={{ fontSize: '24px', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {data.firstName} {data.lastName}
          </h1>
          
          {/* Contact Information in Elegant Layout */}
          <div className="flex flex-wrap justify-center gap-4 text-xs mb-3" style={{ opacity: '0.95' }}>
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{data.phone}</span>
              </div>
            )}
            {(data.city || data.state) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{[data.city, data.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs" style={{ opacity: '0.95' }}>
            {data.linkedIn && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-3 w-3" />
                <span>{data.linkedIn}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3" />
                <span>{data.website}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-4">
        {/* Professional Summary */}
        {data.summary && (
          <section className="mb-4">
            <div className="flex items-center mb-2">
              <h2 className="font-bold text-gray-900 mr-3" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>
                EXECUTIVE SUMMARY
              </h2>
              <div 
                data-preserve="true" 
                style={{ 
                  flex: '1', 
                  height: '2px', 
                  background: 'linear-gradient(90deg, #1e40af, transparent)' 
                }}
              ></div>
            </div>
            <p className="text-gray-700 leading-relaxed" style={{ fontSize: '11px', textAlign: 'justify' }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {data.experiences.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center mb-3">
              <h2 className="font-bold text-gray-900 mr-3" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              <div 
                data-preserve="true" 
                style={{ 
                  flex: '1', 
                  height: '2px', 
                  background: 'linear-gradient(90deg, #1e40af, transparent)' 
                }}
              ></div>
            </div>
            <div className="space-y-4">
              {data.experiences.map((experience, index) => (
                <div key={experience.id} className="relative">
                  {/* Timeline indicator */}
                  <div 
                    data-preserve="true" 
                    style={{ 
                      position: 'absolute', 
                      left: '-12px', 
                      top: '6px', 
                      width: '8px', 
                      height: '8px', 
                      background: '#1e40af', 
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxShadow: '0 0 0 2px #1e40af'
                    }}
                  ></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900" style={{ fontSize: '16px' }}>
                        {experience.title}
                      </h3>
                      <p className="font-medium mb-1" style={{ color: '#1e40af', fontSize: '14px' }}>
                        {experience.company}
                        {experience.location && ` • ${experience.location}`}
                      </p>
                    </div>
                    <div className="text-gray-600 text-right ml-4" style={{ fontSize: '12px', minWidth: '120px' }}>
                      {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                    </div>
                  </div>
                  {experience.description && (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line ml-4" style={{ fontSize: '13px' }}>
                      {experience.description}
                    </div>
                  )}
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
                <div className="flex items-center mb-3">
                  <h2 className="font-bold text-gray-900 mr-3" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>
                    EDUCATION
                  </h2>
                  <div 
                    data-preserve="true" 
                    style={{ 
                      flex: '1', 
                      height: '1.5px', 
                      background: 'linear-gradient(90deg, #1e40af, transparent)' 
                    }}
                  ></div>
                </div>
                <div className="space-y-3">
                  {data.education.map((education) => (
                    <div key={education.id}>
                      <h3 className="font-semibold text-gray-900" style={{ fontSize: '14px' }}>
                        {education.degree}
                      </h3>
                      <p className="font-medium" style={{ color: '#1e40af', fontSize: '13px' }}>
                        {education.school}
                        {education.location && ` • ${education.location}`}
                      </p>
                      {education.gpa && (
                        <p className="text-gray-600" style={{ fontSize: '12px' }}>
                          GPA: {education.gpa}
                        </p>
                      )}
                      <p className="text-gray-600" style={{ fontSize: '12px' }}>
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
                <div className="flex items-center mb-3">
                  <h2 className="font-bold text-gray-900 mr-3" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>
                    CERTIFICATIONS
                  </h2>
                  <div 
                    data-preserve="true" 
                    style={{ 
                      flex: '1', 
                      height: '1.5px', 
                      background: 'linear-gradient(90deg, #1e40af, transparent)' 
                    }}
                  ></div>
                </div>
                <div className="space-y-3">
                  {data.certifications.map((certification) => (
                    <div key={certification.id}>
                      <h3 className="font-semibold text-gray-900" style={{ fontSize: '14px' }}>
                        {certification.name}
                      </h3>
                      <p className="font-medium" style={{ color: '#1e40af', fontSize: '13px' }}>
                        {certification.issuer}
                      </p>
                      {certification.credentialId && (
                        <p className="text-gray-600" style={{ fontSize: '12px' }}>
                          ID: {certification.credentialId}
                        </p>
                      )}
                      <p className="text-gray-600" style={{ fontSize: '12px' }}>
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
            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <div className="flex items-center mb-3">
                  <h2 className="font-bold text-gray-900 mr-3" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>
                    CORE COMPETENCIES
                  </h2>
                  <div 
                    data-preserve="true" 
                    style={{ 
                      flex: '1', 
                      height: '1.5px', 
                      background: 'linear-gradient(90deg, #1e40af, transparent)' 
                    }}
                  ></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-white font-medium rounded-full"
                      style={{ 
                        background: 'linear-gradient(135deg, #1e40af, #3b82f6)', 
                        fontSize: '12px',
                        boxShadow: '0 2px 4px rgba(30, 64, 175, 0.3)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <section>
                <div className="flex items-center mb-3">
                  <h2 className="font-bold text-gray-900 mr-3" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>
                    LANGUAGES
                  </h2>
                  <div 
                    data-preserve="true" 
                    style={{ 
                      flex: '1', 
                      height: '1.5px', 
                      background: 'linear-gradient(90deg, #1e40af, transparent)' 
                    }}
                  ></div>
                </div>
                <div className="space-y-3">
                  {data.languages.map((language) => (
                    <div key={language.id} className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900" style={{ fontSize: '14px' }}>
                          {language.name}
                        </h3>
                        <p className="text-gray-600" style={{ fontSize: '12px' }}>
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
                <div className="flex items-center mb-3">
                  <h2 className="font-bold text-gray-900 mr-3" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>
                    {section.heading.toUpperCase()}
                  </h2>
                  <div 
                    data-preserve="true" 
                    style={{ 
                      flex: '1', 
                      height: '1.5px', 
                      background: 'linear-gradient(90deg, #1e40af, transparent)' 
                    }}
                  ></div>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line" style={{ fontSize: '13px' }}>
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer accent */}
        <div 
          data-preserve="true" 
          className="mt-8"
          style={{ 
            height: '3px', 
            background: 'linear-gradient(90deg, #1e40af, #3b82f6, #fbbf24)', 
            borderRadius: '2px',
            margin: '24px -24px 0 -24px'
          }}
        ></div>

        {/* Empty State */}
        {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <h3 className="text-lg font-semibold mb-3">Elite Resume Preview</h3>
            <p>Start filling out the form to see your professional resume come to life!</p>
          </div>
        )}
      </div>
    </div>
  );
});

ElitePremiumResume.displayName = "ElitePremiumResume";

export default ElitePremiumResume;