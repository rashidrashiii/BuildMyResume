import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Star } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const CreativeDesignResume = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
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
            fill: isFilled ? '#4a5568' : 'none',
            stroke: isFilled ? '#4a5568' : '#cbd5e0',
          }}
        />
      );
    });
  };

  return (
    <div ref={ref} className="bg-white text-gray-900 p-4 mx-auto text-sm leading-tight font-sans" style={{ maxWidth: '8.27in', width: '100%' }}>
      {/* Header */}
      <header className="mb-3">
        <div
          style={{
            backgroundColor: '#4a5568',
            color: 'white',
            padding: '12px',
            marginBottom: '0'
          }}
          data-preserve="true"
        >
          <h1 className="text-lg font-bold mb-1 uppercase tracking-wide">
            {data.firstName} {data.lastName}
          </h1>
          {data.experiences && data.experiences.length > 0 && (
            <p className="text-sm mb-2">
              {data.experiences[0].title}
            </p>
          )}
          
          {/* Contact Information */}
          <div className="flex flex-wrap gap-3 text-xs">
            {data.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{data.email}</span>
              </div>
            )}
            {data.linkedIn && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                <span>{data.linkedIn}</span>
              </div>
            )}
            {(data.city || data.state) && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{[data.city, data.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Professional Summary */}
          {data.summary && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                SUMMARY
              </h2>
              <div
                style={{
                  borderBottom: '2px solid #4a5568',
                  marginBottom: '8px'
                }}
                data-preserve="true"
              ></div>
              <p className="text-gray-700 leading-relaxed text-xs">{data.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {data.experiences.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                EXPERIENCE
              </h2>
              <div
                style={{
                  borderBottom: '2px solid #4a5568',
                  marginBottom: '8px'
                }}
                data-preserve="true"
              ></div>
              <div className="space-y-3">
                {data.experiences.map((experience) => (
                  <div key={experience.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs">
                          {experience.title}
                        </h3>
                        <p className="font-semibold text-xs text-gray-700">
                          {experience.company}
                        </p>
                        {experience.location && (
                          <p className="text-xs text-gray-600">{experience.location}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          data-preserve="true"
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#4a5568',
                              marginRight: '4px'
                            }}
                            data-preserve="true"
                          ></span>
                          {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                        </div>
                        {experience.location && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '2px'
                            }}
                            data-preserve="true"
                          >
                            <MapPin className="h-3 w-3" />
                            <span>{experience.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {experience.description && (
                      <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line ml-4">
                        {experience.description.split('\n').map((line, index) => (
                          <div key={index} className="mb-1">
                            {line.trim().startsWith('•') || line.trim().startsWith('-') ? (
                              <div className="flex items-start gap-2">
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: '4px',
                                    height: '4px',
                                    backgroundColor: '#4a5568',
                                    borderRadius: '50%',
                                    marginTop: '6px',
                                    flexShrink: 0
                                  }}
                                  data-preserve="true"
                                ></span>
                                <span>{line.replace(/^[•-]\s*/, '')}</span>
                              </div>
                            ) : (
                              <span>{line}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                EDUCATION
              </h2>
              <div
                style={{
                  borderBottom: '2px solid #4a5568',
                  marginBottom: '12px'
                }}
                data-preserve="true"
              ></div>
              <div className="space-y-3">
                {data.education.map((education) => (
                  <div key={education.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs">
                          {education.degree}
                        </h3>
                        <p className="font-semibold text-xs text-gray-700">
                          {education.school}
                        </p>
                        {education.location && (
                          <p className="text-xs text-gray-600">{education.location}</p>
                        )}
                        {education.gpa && (
                          <p className="text-xs text-gray-600">GPA: {education.gpa}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          data-preserve="true"
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#4a5568',
                              marginRight: '4px'
                            }}
                            data-preserve="true"
                          ></span>
                          {formatDateRange(education.startDate, education.endDate, education.current)}
                        </div>
                        {education.location && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '2px'
                            }}
                            data-preserve="true"
                          >
                            <MapPin className="h-3 w-3" />
                            <span>{education.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                SKILLS
              </h2>
              <div
                style={{
                  borderBottom: '2px solid #4a5568',
                  marginBottom: '12px'
                }}
                data-preserve="true"
              ></div>
              <div className="text-xs text-gray-700 leading-relaxed">
                {data.skills.join(', ')}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                CERTIFICATION
              </h2>
              <div
                style={{
                  borderBottom: '2px solid #4a5568',
                  marginBottom: '12px'
                }}
                data-preserve="true"
              ></div>
              <div className="space-y-3">
                {data.certifications.map((certification) => (
                  <div key={certification.id}>
                    <h3 className="font-bold text-gray-900 text-xs">
                      {certification.name}
                    </h3>
                    <p className="text-xs text-gray-700">
                      {certification.issuer}
                    </p>
                    {certification.credentialId && (
                      <p className="text-xs text-gray-600">
                        Credential ID: {certification.credentialId}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      {formatDate(certification.date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                LANGUAGES
              </h2>
              <div
                style={{
                  borderBottom: '2px solid #4a5568',
                  marginBottom: '12px'
                }}
                data-preserve="true"
              ></div>
              <div className="space-y-2">
                {data.languages.map((language) => (
                  <div key={language.id}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs">{language.name}</h3>
                        <p className="text-xs text-gray-600">{language.proficiency}</p>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(language.proficiency)}
                      </div>
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
        <div className="mt-6 space-y-5">
          {data.customSections.map((section) => (
            <section key={section.id}>
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                {section.heading}
              </h2>
              <div
                style={{
                  borderBottom: '2px solid #4a5568',
                  marginBottom: '12px'
                }}
                data-preserve="true"
              ></div>
              <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
        <div className="text-center py-8">
          <div
            style={{
              backgroundColor: '#4a5568',
              color: 'white',
              padding: '20px',
              textAlign: 'center'
            }}
            data-preserve="true"
          >
            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">ATS Resume Preview</h3>
            <p className="text-sm">Start filling out the form to see your professional resume!</p>
          </div>
        </div>
      )}
    </div>
  );
});

CreativeDesignResume.displayName = "CreativeDesignResume";

export default CreativeDesignResume;