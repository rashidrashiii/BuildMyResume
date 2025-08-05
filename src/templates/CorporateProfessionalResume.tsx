import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Star } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const CorporateProfessionalResume = forwardRef<HTMLDivElement, { data: ResumeData }>((props, ref) => {
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

  return (
    <div ref={ref} className="bg-white text-black mx-auto p-6" style={{ fontFamily: "'Inter', 'Arial', sans-serif", fontSize: '12px', lineHeight: '1.5', maxWidth: '8.27in', width: '100%' }}>
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2" style={{ fontSize: '20px' }}>
          {data.firstName} {data.lastName}
        </h1>
          
          {/* Contact Information */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{data.phone}</span>
              </div>
            )}
            {(data.city || data.state) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{[data.city, data.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{data.website}</span>
              </div>
            )}
            {data.linkedIn && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <span>{data.linkedIn}</span>
              </div>
            )}
          </div>
        </header>

      <div className="space-y-6">
        {/* Professional Summary */}
        {data.summary && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Professional Summary
            </h2>
            <div
              style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '12px' }}
              data-preserve="true"
            >
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: '11px' }}>
                {data.summary}
              </p>
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Technical Skills
            </h2>
            <div
              style={{ borderLeft: '3px solid #10b981', paddingLeft: '12px' }}
              data-preserve="true"
            >
              <p className="text-gray-700" style={{ fontSize: '11px' }}>
                {data.skills.join(' • ')}
              </p>
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Professional Experience
            </h2>
            
            <div className="space-y-4">
              {data.experiences.map((experience) => (
                <div key={experience.id} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900" style={{ fontSize: '12px' }}>
                        {experience.title}
                      </h3>
                      <p className="font-medium text-gray-800" style={{ fontSize: '11px' }}>
                        {experience.company}
                        {experience.location && ` • ${experience.location}`}
                      </p>
                    </div>
                    <div className="text-gray-600 font-medium ml-4" style={{ fontSize: '10px', minWidth: 'fit-content' }}>
                      {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                    </div>
                  </div>
                  
                  {experience.description && (
                    <div className="mt-3 ml-0">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line" style={{ fontSize: '11px' }}>
                        {experience.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-column layout for remaining sections */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Education
                </h2>
                <div
                  style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '12px' }}
                  data-preserve="true"
                >
                  <div className="space-y-4">
                    {data.education.map((education) => (
                      <div key={education.id}>
                        <h3 className="font-bold text-gray-900" style={{ fontSize: '12px' }}>
                          {education.degree}
                        </h3>
                        <p className="font-medium text-gray-800" style={{ fontSize: '11px' }}>
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
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Certifications
                </h2>
                <div
                  style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}
                  data-preserve="true"
                >
                  <div className="space-y-3">
                    {data.certifications.map((certification) => (
                      <div key={certification.id}>
                        <h3 className="font-bold text-gray-900" style={{ fontSize: '12px' }}>
                          {certification.name}
                        </h3>
                        <p className="font-medium text-gray-800" style={{ fontSize: '11px' }}>
                          {certification.issuer}
                        </p>
                        {certification.credentialId && (
                          <p className="text-gray-600" style={{ fontSize: '10px' }}>
                            Credential ID: {certification.credentialId}
                          </p>
                        )}
                        <p className="text-gray-600" style={{ fontSize: '11px' }}>
                          {formatDate(certification.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Languages */}
            {data.languages.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Languages
                </h2>
                <div
                  style={{ borderLeft: '3px solid #ef4444', paddingLeft: '12px' }}
                  data-preserve="true"
                >
                  <div className="space-y-3">
                    {data.languages.map((language) => {
                      // Calculate rating based on proficiency level
                      let rating: number;
                      switch (language.proficiency) {
                        case 'Native': rating = 5; break;
                        case 'Fluent': rating = 4; break;
                        case 'Conversational': rating = 3; break;
                        case 'Basic': rating = 2; break;
                        default: rating = 1; break;
                      }
                      
                      return (
                        <div key={language.id} className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-gray-900" style={{ fontSize: '12px' }}>
                              {language.name}
                            </h3>
                            <p className="text-gray-600" style={{ fontSize: '11px' }}>
                              {language.proficiency}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => {
                              const isFilled = i < rating;
                              return (
                                <div
                                  key={i}
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: isFilled ? '#10b981' : '#e5e7eb',
                                  }}
                                  data-preserve="true"
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {data.customSections && data.customSections.length > 0 && (
              <div className="space-y-6">
                {data.customSections.map((section) => (
                  <section key={section.id}>
                    <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                      {section.heading}
                    </h2>
                    <div
                      style={{ borderLeft: '3px solid #6b7280', paddingLeft: '12px' }}
                      data-preserve="true"
                    >
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line" style={{ fontSize: '11px' }}>
                        {section.content}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <h3 className="text-lg font-semibold mb-3">Professional Resume Template</h3>
            <p>Start building your professional resume!</p>
          </div>
        )}
      </div>
    </div>
  );
});

CorporateProfessionalResume.displayName = "CorporateProfessionalResume";

export default CorporateProfessionalResume;