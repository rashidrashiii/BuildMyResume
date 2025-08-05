import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Star } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const TraditionalBusinessResume = forwardRef<HTMLDivElement, { data: ResumeData }>((props, ref) => {
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
    <div ref={ref} className="bg-white text-black mx-auto" style={{ fontFamily: 'Times, "Times New Roman", serif', fontSize: '12px', lineHeight: '1.4', padding: '16px', maxWidth: '8.27in', width: '100%' }}>
      {/* Main container with border */}
      <div 
        data-preserve="true"
        style={{ 
          border: '2px solid #000000', 
          padding: '0',
          minHeight: '100%'
        }}
      >
        {/* Header Section */}
        <header 
          data-preserve="true"
          style={{ 
            border: '0 0 2px 0',
            borderStyle: 'solid',
            borderColor: '#000000',
            padding: '16px',
            textAlign: 'center',
            background: '#f8f9fa'
          }}
        >
          <h1 className="font-bold mb-2" style={{ fontSize: '20px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px 0' }}>
            {data.firstName} {data.lastName}
          </h1>
          
          {/* Contact Information Box */}
          <div 
            data-preserve="true"
            className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs"
            style={{ 
              border: '1px solid #000000', 
              padding: '10px',
              background: '#ffffff',
              margin: '0 auto',
              maxWidth: '600px'
            }}
          >
            {data.email && (
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-3 w-3" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{data.phone}</span>
              </div>
            )}
            {(data.city || data.state) && (
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{[data.city, data.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {data.linkedIn && (
              <div className="flex items-center justify-center gap-2">
                <Linkedin className="h-3 w-3" />
                <span>{data.linkedIn}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center justify-center gap-2">
                <Globe className="h-3 w-3" />
                <span>{data.website}</span>
              </div>
            )}
          </div>
        </header>

        <div className="p-4">
          {/* Professional Summary */}
          {data.summary && (
            <section className="mb-4">
              <div 
                data-preserve="true"
                style={{ 
                  border: '1px solid #000000',
                  background: '#f8f9fa'
                }}
              >
                <h2 
                  data-preserve="true"
                  className="font-bold text-center py-2"
                  style={{ 
                    fontSize: '14px', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: '1px solid #000000',
                    background: '#e9ecef',
                    margin: '0'
                  }}
                >
                  Professional Summary
                </h2>
                <div className="p-3">
                  <p className="text-gray-900 leading-relaxed" style={{ fontSize: '11px', textAlign: 'justify', margin: '0' }}>
                    {data.summary}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Professional Experience */}
          {data.experiences.length > 0 && (
            <section className="mb-6">
              <div 
                data-preserve="true"
                style={{ 
                  border: '1px solid #000000',
                  background: '#ffffff'
                }}
              >
                <h2 
                  data-preserve="true"
                  className="font-bold text-center py-2"
                  style={{ 
                    fontSize: '16px', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: '1px solid #000000',
                    background: '#e9ecef',
                    margin: '0'
                  }}
                >
                  Professional Experience
                </h2>
                <div className="p-4">
                  <div className="space-y-4">
                    {data.experiences.map((experience, index) => (
                      <div key={experience.id}>
                        {index > 0 && (
                          <div 
                            data-preserve="true"
                            style={{ 
                              height: '1px', 
                              background: '#dee2e6', 
                              margin: '16px 0' 
                            }}
                          ></div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                          <div className="md:col-span-2">
                            <h3 className="font-bold text-gray-900" style={{ fontSize: '14px', margin: '0 0 4px 0' }}>
                              {experience.title}
                            </h3>
                            <p className="font-semibold" style={{ fontSize: '13px', margin: '0 0 4px 0' }}>
                              {experience.company}
                            </p>
                            {experience.location && (
                              <p className="text-gray-600" style={{ fontSize: '12px', margin: '0' }}>
                                {experience.location}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div 
                              data-preserve="true"
                              className="inline-block px-2 py-1 text-center"
                              style={{ 
                                border: '1px solid #000000',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                background: '#f8f9fa'
                              }}
                            >
                              {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                            </div>
                          </div>
                        </div>
                        {experience.description && (
                          <div className="text-gray-900 leading-relaxed whitespace-pre-line mt-2" style={{ fontSize: '12px' }}>
                            {experience.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Two-column layout for remaining sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-two-col">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Education */}
              {data.education.length > 0 && (
                <section>
                  <div 
                    data-preserve="true"
                    style={{ 
                      border: '1px solid #000000',
                      background: '#ffffff'
                    }}
                  >
                    <h2 
                      data-preserve="true"
                      className="font-bold text-center py-2"
                      style={{ 
                        fontSize: '14px', 
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        borderBottom: '1px solid #000000',
                        background: '#e9ecef',
                        margin: '0'
                      }}
                    >
                      Education
                    </h2>
                    <div className="p-3">
                      <div className="space-y-3">
                        {data.education.map((education, index) => (
                          <div key={education.id}>
                            {index > 0 && (
                              <div 
                                data-preserve="true"
                                style={{ 
                                  height: '1px', 
                                  background: '#dee2e6', 
                                  margin: '12px 0' 
                                }}
                              ></div>
                            )}
                            <div>
                              <h3 className="font-bold text-gray-900" style={{ fontSize: '13px', margin: '0 0 2px 0' }}>
                                {education.degree}
                              </h3>
                              <p className="font-semibold" style={{ fontSize: '12px', margin: '0 0 2px 0' }}>
                                {education.school}
                              </p>
                              {education.location && (
                                <p className="text-gray-600" style={{ fontSize: '11px', margin: '0 0 2px 0' }}>
                                  {education.location}
                                </p>
                              )}
                              {education.gpa && (
                                <p className="text-gray-600" style={{ fontSize: '11px', margin: '0 0 2px 0' }}>
                                  GPA: {education.gpa}
                                </p>
                              )}
                              <p className="text-gray-600" style={{ fontSize: '11px', margin: '0' }}>
                                {formatDateRange(education.startDate, education.endDate, education.current)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Certifications */}
              {data.certifications.length > 0 && (
                <section>
                  <div 
                    data-preserve="true"
                    style={{ 
                      border: '1px solid #000000',
                      background: '#ffffff'
                    }}
                  >
                    <h2 
                      data-preserve="true"
                      className="font-bold text-center py-2"
                      style={{ 
                        fontSize: '14px', 
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        borderBottom: '1px solid #000000',
                        background: '#e9ecef',
                        margin: '0'
                      }}
                    >
                      Certifications
                    </h2>
                    <div className="p-3">
                      <div className="space-y-3">
                        {data.certifications.map((certification, index) => (
                          <div key={certification.id}>
                            {index > 0 && (
                              <div 
                                data-preserve="true"
                                style={{ 
                                  height: '1px', 
                                  background: '#dee2e6', 
                                  margin: '12px 0' 
                                }}
                              ></div>
                            )}
                            <div>
                              <h3 className="font-bold text-gray-900" style={{ fontSize: '13px', margin: '0 0 2px 0' }}>
                                {certification.name}
                              </h3>
                              <p className="font-semibold" style={{ fontSize: '12px', margin: '0 0 2px 0' }}>
                                {certification.issuer}
                              </p>
                              {certification.credentialId && (
                                <p className="text-gray-600" style={{ fontSize: '11px', margin: '0 0 2px 0' }}>
                                  Credential ID: {certification.credentialId}
                                </p>
                              )}
                              <p className="text-gray-600" style={{ fontSize: '11px', margin: '0' }}>
                                {formatDate(certification.date)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Skills */}
              {data.skills.length > 0 && (
                <section>
                  <div 
                    data-preserve="true"
                    style={{ 
                      border: '1px solid #000000',
                      background: '#ffffff'
                    }}
                  >
                    <h2 
                      data-preserve="true"
                      className="font-bold text-center py-2"
                      style={{ 
                        fontSize: '14px', 
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        borderBottom: '1px solid #000000',
                        background: '#e9ecef',
                        margin: '0'
                      }}
                    >
                      Core Skills
                    </h2>
                    <div className="p-3">
                      <div className="grid grid-cols-1 gap-1">
                        {data.skills.map((skill, index) => (
                          <div 
                            key={index}
                            data-preserve="true"
                            className="text-center py-1"
                            style={{ 
                              border: '1px solid #dee2e6',
                              fontSize: '11px',
                              background: index % 2 === 0 ? '#f8f9fa' : '#ffffff'
                            }}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Languages */}
              {data.languages.length > 0 && (
                <section>
                  <div 
                    data-preserve="true"
                    style={{ 
                      border: '1px solid #000000',
                      background: '#ffffff'
                    }}
                  >
                    <h2 
                      data-preserve="true"
                      className="font-bold text-center py-2"
                      style={{ 
                        fontSize: '14px', 
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        borderBottom: '1px solid #000000',
                        background: '#e9ecef',
                        margin: '0'
                      }}
                    >
                      Languages
                    </h2>
                    <div className="p-3">
                      <div className="space-y-3">
                        {data.languages.map((language, index) => (
                          <div key={language.id}>
                            {index > 0 && (
                              <div 
                                data-preserve="true"
                                style={{ 
                                  height: '1px', 
                                  background: '#dee2e6', 
                                  margin: '12px 0' 
                                }}
                              ></div>
                            )}
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-bold text-gray-900" style={{ fontSize: '12px', margin: '0 0 2px 0' }}>
                                  {language.name}
                                </h3>
                                <p className="text-gray-600" style={{ fontSize: '11px', margin: '0' }}>
                                  {language.proficiency}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {renderStars(language.proficiency)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
                  <div 
                    data-preserve="true"
                    style={{ 
                      border: '1px solid #000000',
                      background: '#ffffff'
                    }}
                  >
                    <h2 
                      data-preserve="true"
                      className="font-bold text-center py-2"
                      style={{ 
                        fontSize: '14px', 
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        borderBottom: '1px solid #000000',
                        background: '#e9ecef',
                        margin: '0'
                      }}
                    >
                      {section.heading}
                    </h2>
                    <div className="p-4">
                      <div className="text-gray-900 leading-relaxed whitespace-pre-line" style={{ fontSize: '12px' }}>
                        {section.content}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div 
                data-preserve="true"
                style={{ 
                  border: '2px dashed #dee2e6',
                  padding: '24px',
                  background: '#f8f9fa'
                }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Traditional Resume Template
                </h3>
                <p style={{ fontSize: '12px' }}>
                  Start filling out the form to create your professional resume
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TraditionalBusinessResume.displayName = "TraditionalBusinessResume";

export default TraditionalBusinessResume;