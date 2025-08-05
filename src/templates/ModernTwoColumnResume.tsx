import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Star } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const ModernTwoColumnResume = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
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
    <div ref={ref} className="bg-white text-black p-4 mx-auto text-sm leading-tight" style={{ maxWidth: '8.27in', width: '100%' }}>
      {/* Header */}
      <header className="mb-4 text-center">
        <h1 className="text-lg font-bold text-gray-900 mb-1 text-center">
          {data.firstName} {data.lastName}
        </h1>
        
        {/* Contact Information */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-700 mb-2">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{data.phone}</span>
            </div>
          )}
          {(data.city || data.state) && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{[data.city, data.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {data.linkedIn && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              <span>{data.linkedIn}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{data.website}</span>
            </div>
          )}
        </div>
        
        {/* Divider line */}
        <div
          style={{ 
            borderTop: '2px solid #374151', 
            margin: '6px auto',
            width: '100%'
          }}
          data-preserve="true"
        ></div>
      </header>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Main Content */}
        <div className="space-y-4">
          {/* Work Experience */}
          {data.experiences.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-2">
                {data.experiences.map((experience) => (
                  <div key={experience.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-xs">
                          {experience.title}
                        </h3>
                        <p className="text-gray-700 font-medium text-xs">
                          {experience.company}
                          {experience.location && ` | ${experience.location}`}
                        </p>
                      </div>
                      <div className="text-xs text-gray-600 text-right ml-2">
                        {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                      </div>
                    </div>
                    {experience.description && (
                      <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line ml-2">
                        {experience.description}
                      </div>
                    )}
                    {/* Subtle separator between experiences */}
                    <div
                      style={{ 
                        borderTop: '1px solid #e5e7eb', 
                        margin: '8px 0',
                        width: '100%'
                      }}
                      data-preserve="true"
                    ></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                EDUCATION
              </h2>
              <div className="space-y-2">
                {data.education.map((education) => (
                  <div key={education.id}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-xs">
                          {education.degree}
                        </h3>
                        <p className="text-gray-700 font-medium text-xs">
                          {education.school}
                          {education.location && ` | ${education.location}`}
                        </p>
                        {education.gpa && (
                          <p className="text-xs text-gray-600">GPA: {education.gpa}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 text-right ml-2">
                        {formatDateRange(education.startDate, education.endDate, education.current)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <div className="space-y-4">
              {data.customSections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    {section.heading.toUpperCase()}
                  </h2>
                  <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Supporting Content */}
        <div className="space-y-4">
          {/* Professional Summary */}
          {data.summary && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                PROFESSIONAL SUMMARY
              </h2>
              <div
                style={{ 
                  borderLeft: '3px solid #6b7280', 
                  paddingLeft: '10px'
                }}
                data-preserve="true"
              >
                <p className="text-gray-700 leading-relaxed text-xs">{data.summary}</p>
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                CORE COMPETENCIES
              </h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-700 py-1 px-2 text-center"
                    style={{ 
                      border: '1px solid #d1d5db',
                      backgroundColor: '#f9fafb'
                    }}
                    data-preserve="true"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                CERTIFICATIONS
              </h2>
              <div className="space-y-2">
                {data.certifications.map((certification) => (
                  <div key={certification.id}>
                    <h3 className="font-semibold text-gray-900 text-xs">
                      {certification.name}
                    </h3>
                    <p className="text-gray-700 font-medium text-xs">{certification.issuer}</p>
                    {certification.credentialId && (
                      <p className="text-xs text-gray-600">
                        ID: {certification.credentialId}
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
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {data.languages.map((language) => (
                  <div key={language.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-xs">{language.name}</h3>
                      <p className="text-xs text-gray-600">{language.proficiency}</p>
                    </div>
                    <div className="flex gap-0.5 ml-2">
                      {renderStars(language.proficiency)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <h3 className="text-lg font-semibold mb-3">Modern Two-Column Resume</h3>
          <p className="text-sm">Start filling out the form to see your professional resume!</p>
        </div>
      )}
    </div>
  );
});

ModernTwoColumnResume.displayName = "ModernTwoColumnResume";

export default ModernTwoColumnResume;