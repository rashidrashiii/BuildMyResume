import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Star, Award, Code, Briefcase, GraduationCap } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const EngineeringResume = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
  const resumeData = data ;

  // Helper functions for data processing
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (startDate, endDate, current) => {
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
        <div
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: isFilled ? '#10b981' : '#e5e7eb',
            display: 'inline-block',
            marginRight: '2px'
          }}
          data-preserve="true"
        ></div>
      );
    });
  };

  return (
    <div ref={ref} className="resume-root bg-white text-black font-sans" style={{ fontSize: '11px', lineHeight: '1.4', maxWidth: '8.27in', width: '100%' }}>
      {/* Header Section */}
      <header className="relative overflow-hidden">
        {/* Gradient background with inline styles for preservation */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #059669 100%)',
            padding: '1rem 0.75rem',
            color: 'white',
            position: 'relative'
          }}
          data-preserve="true"
        >
          {/* Geometric decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '0.25rem',
              right: '0.75rem',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              opacity: '0.6'
            }}
            data-preserve="true"
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '0.25rem',
              left: '0.25rem',
              width: '2rem',
              height: '2rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'rotate(45deg)',
              opacity: '0.4'
            }}
            data-preserve="true"
          ></div>
          <div
            style={{
              position: 'absolute',
              top: '60%',
              left: '30%',
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              opacity: '0.5'
            }}
            data-preserve="true"
          ></div>
          
          <div className="relative z-10 mx-auto text-center" style={{ maxWidth: '8.27in', width: '100%' }}>
            <h1 className="text-lg font-black mb-1 tracking-tight">
              {resumeData.firstName} {resumeData.lastName}
            </h1>
            <div
              style={{
                fontSize: '9px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em'
              }}
              data-preserve="true"
            >
              {resumeData.experiences && resumeData.experiences.length > 0 ? resumeData.experiences[0].title.toUpperCase() : 'PROFESSIONAL'}
            </div>
            
            {/* Contact Information */}
            <div className="flex flex-wrap justify-center gap-1 text-xs mb-2">
              {resumeData.email && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '0.2rem 0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  data-preserve="true"
                >
                  <Mail className="h-2 w-2" />
                  <span>{resumeData.email}</span>
                </div>
              )}
              {resumeData.phone && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '0.2rem 0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  data-preserve="true"
                >
                  <Phone className="h-2 w-2" />
                  <span>{resumeData.phone}</span>
                </div>
              )}
              {(resumeData.city || resumeData.state) && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '0.2rem 0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  data-preserve="true"
                >
                  <MapPin className="h-2 w-2" />
                  <span>{[resumeData.city, resumeData.state].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {resumeData.linkedIn && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '0.2rem 0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  data-preserve="true"
                >
                  <Linkedin className="h-2 w-2" />
                  <span>{resumeData.linkedIn}</span>
                </div>
              )}
              {resumeData.website && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '0.2rem 0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  data-preserve="true"
                >
                  <Globe className="h-2 w-2" />
                  <span>{resumeData.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto p-2" style={{ fontSize: '11px', maxWidth: '8.27in', width: '100%' }}>
        {/* Professional Summary */}
        {resumeData.summary && (
          <section className="mb-4">
            <div
              style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                borderRadius: '6px',
                padding: '0.75rem',
                border: '1px solid #a7f3d0'
              }}
              data-preserve="true"
            >
              <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <div
                  style={{
                    width: '3px',
                    height: '16px',
                    background: 'linear-gradient(to bottom, #059669, #047857)',
                    borderRadius: '2px'
                  }}
                  data-preserve="true"
                ></div>
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed text-xs">{resumeData.summary}</p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-3 gap-4 print-three-col">
          {/* Left Column */}
          <div className="col-span-2 space-y-4 avoid-break">
            {/* Work Experience */}
            {resumeData.experiences && resumeData.experiences.length > 0 && (
              <section className="avoid-break">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="h-3 w-3 text-blue-600" />
                  <span>PROFESSIONAL EXPERIENCE</span>
                  <div
                    style={{
                      flex: '1',
                      height: '2px',
                      background: 'linear-gradient(to right, #3b82f6, transparent)',
                      marginLeft: '0.5rem'
                    }}
                    data-preserve="true"
                  ></div>
                </h2>
                <div className="space-y-3">
                  {resumeData.experiences.map((experience) => (
                    <article key={experience.id}>
                      <div
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          padding: '0.75rem',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          border: '1px solid #e5e7eb',
                          borderLeft: '3px solid #3b82f6'
                        }}
                        data-preserve="true"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1">
                            <h3 className="text-xs font-bold text-gray-900">
                              {experience.title}
                            </h3>
                            <p className="text-blue-600 font-semibold text-xs">
                              {experience.company}
                            </p>
                            {experience.location && (
                              <p className="text-gray-500 text-xs flex items-center gap-1">
                                <MapPin className="h-2 w-2" />
                                {experience.location}
                              </p>
                            )}
                          </div>
                          <div
                            style={{
                              backgroundColor: '#f1f5f9',
                              borderRadius: '12px',
                              padding: '0.125rem 0.375rem',
                              fontSize: '9px',
                              fontWeight: '500',
                              color: '#475569'
                            }}
                            data-preserve="true"
                          >
                            {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                          </div>
                        </div>
                        {experience.description && (
                          <div className="text-gray-600 text-xs whitespace-pre-line mt-2">
                            {experience.description}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {resumeData.customSections && resumeData.customSections.length > 0 && (
              <div className="avoid-break">
                {resumeData.customSections.map((section) => (
                  <section key={section.id}>
                    <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="h-3 w-3 text-green-600" />
                      <span>{section.heading.toUpperCase()}</span>
                      <div
                        style={{
                          flex: '1',
                          height: '2px',
                          background: 'linear-gradient(to right, #10b981, transparent)',
                          marginLeft: '0.5rem'
                        }}
                        data-preserve="true"
                      ></div>
                    </h2>
                    <div
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        padding: '0.75rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb',
                        borderLeft: '3px solid #10b981'
                      }}
                      data-preserve="true"
                    >
                      <div className="text-gray-700 text-xs whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4 avoid-break">
            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <section className="avoid-break">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="h-3 w-3 text-purple-600" />
                  <span>EDUCATION</span>
                </h2>
                <div className="space-y-2">
                  {resumeData.education.map((education) => (
                    <div key={education.id}>
                      <div
                        style={{
                          backgroundColor: '#faf5ff',
                          borderRadius: '4px',
                          padding: '0.5rem',
                          border: '1px solid #e9d5ff'
                        }}
                        data-preserve="true"
                      >
                        <h3 className="text-xs font-bold text-gray-900 mb-1">
                          {education.degree}
                        </h3>
                        <p className="text-purple-600 font-semibold text-xs mb-1">
                          {education.school}
                        </p>
                        <div className="text-xs text-gray-500">
                          {education.location && (
                            <p className="flex items-center gap-1 mb-1">
                              <MapPin className="h-2 w-2" />
                              {education.location}
                            </p>
                          )}
                          <p>{formatDateRange(education.startDate, education.endDate, education.current)}</p>
                          {education.gpa && (
                            <p
                              style={{
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                padding: '0.125rem 0.25rem',
                                borderRadius: '8px',
                                fontSize: '9px',
                                fontWeight: '500',
                                marginTop: '0.25rem',
                                display: 'inline-block'
                              }}
                              data-preserve="true"
                            >
                              GPA: {education.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <section className="avoid-break">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Code className="h-3 w-3 text-green-600" />
                  <span>SKILLS</span>
                </h2>
                <div className="flex flex-wrap gap-1">
                  {resumeData.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        color: 'white',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: '500'
                      }}
                      data-preserve="true"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <section className="avoid-break">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="h-3 w-3 text-yellow-600" />
                  <span>CERTIFICATIONS</span>
                </h2>
                <div className="space-y-2">
                  {resumeData.certifications.map((certification) => (
                    <div key={certification.id}>
                      <div
                        style={{
                          backgroundColor: '#fffbeb',
                          borderRadius: '4px',
                          padding: '0.5rem',
                          border: '1px solid #fde68a'
                        }}
                        data-preserve="true"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#f59e0b',
                              borderRadius: '50%',
                              flexShrink: '0',
                              marginTop: '2px'
                            }}
                            data-preserve="true"
                          ></div>
                          <div
                            style={{
                              backgroundColor: '#f7fafc',
                              borderRadius: '8px',
                              padding: '0.125rem 0.25rem',
                              fontSize: '8px',
                              color: '#64748b'
                            }}
                            data-preserve="true"
                          >
                            {formatDate(certification.date)}
                          </div>
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 mb-1">
                          {certification.name}
                        </h3>
                        <p className="text-yellow-700 font-medium text-xs">{certification.issuer}</p>
                        {certification.credentialId && (
                          <p
                            style={{
                              fontSize: '8px',
                              color: '#64748b',
                              backgroundColor: '#f8fafc',
                              borderRadius: '2px',
                              padding: '0.125rem 0.25rem',
                              fontFamily: 'monospace',
                              marginTop: '0.25rem',
                              display: 'inline-block'
                            }}
                            data-preserve="true"
                          >
                            {certification.credentialId}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <section className="avoid-break">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="h-3 w-3 text-indigo-600" />
                  <span>LANGUAGES</span>
                </h2>
                <div className="space-y-2">
                  {resumeData.languages.map((language) => (
                    <div key={language.id}>
                      <div
                        style={{
                          backgroundColor: '#f0f4ff',
                          borderRadius: '4px',
                          padding: '0.5rem',
                          border: '1px solid #c7d2fe'
                        }}
                        data-preserve="true"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-gray-900 text-xs">{language.name}</h3>
                            <p className="text-gray-600 text-xs">{language.proficiency}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {renderStars(language.proficiency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
});

EngineeringResume.displayName = "EngineeringResume";

export default EngineeringResume;