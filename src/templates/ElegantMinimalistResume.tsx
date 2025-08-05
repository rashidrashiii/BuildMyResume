import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Star } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const ElegantMinimalistResume = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
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
            fill: isFilled ? '#059669' : 'none',
            stroke: isFilled ? '#059669' : '#d1d5db',
          }}
        />
      );
    });
  };

  return (
    <div ref={ref} className="bg-white text-gray-900 p-4 mx-auto" style={{ fontFamily: 'Georgia, serif', maxWidth: '8.27in', width: '100%' }}>
      {/* Header */}
      <header className="mb-3 text-center">
        <h1 className="text-lg font-bold mb-1" style={{ color: '#1f2937' }}>
          {data.firstName} {data.lastName}
        </h1>
        
        {/* Contact Information */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600 mb-2">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" style={{ color: '#059669' }} />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" style={{ color: '#059669' }} />
              <span>{data.phone}</span>
            </div>
          )}
          {(data.city || data.state) && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" style={{ color: '#059669' }} />
              <span>{[data.city, data.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Online Presence */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
          {data.linkedIn && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" style={{ color: '#059669' }} />
              <span>{data.linkedIn}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" style={{ color: '#059669' }} />
              <span>{data.website}</span>
            </div>
          )}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: '80px',
            height: '2px',
            background: 'linear-gradient(90deg, #059669, #10b981)',
            margin: '12px auto 0',
          }}
          data-preserve="true"
        ></div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-4">
          <div className="flex items-center mb-2">
            <div
              style={{
                width: '3px',
                height: '16px',
                backgroundColor: '#059669',
                marginRight: '10px',
              }}
              data-preserve="true"
            ></div>
            <h2 className="text-base font-bold uppercase tracking-wide" style={{ color: '#1f2937' }}>
              Professional Summary
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-xs pl-3">{data.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {data.experiences.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center mb-2">
            <div
              style={{
                width: '3px',
                height: '16px',
                backgroundColor: '#059669',
                marginRight: '10px',
              }}
              data-preserve="true"
            ></div>
            <h2 className="text-base font-bold uppercase tracking-wide" style={{ color: '#1f2937' }}>
              Professional Experience
            </h2>
          </div>
          <div className="space-y-4 pl-4">
            {data.experiences.map((experience, index) => (
              <div key={experience.id} className="relative">
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                  }}
                  data-preserve="true"
                ></div>
                
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold" style={{ color: '#1f2937' }}>
                      {experience.title}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: '#059669' }}>
                      {experience.company}
                      {experience.location && ` • ${experience.location}`}
                    </p>
                  </div>
                  <div className="text-xs text-gray-600 ml-4">
                    {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                  </div>
                </div>
                {experience.description && (
                  <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                    {experience.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center mb-3">
            <div
              style={{
                width: '4px',
                height: '20px',
                backgroundColor: '#059669',
                marginRight: '12px',
              }}
              data-preserve="true"
            ></div>
            <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: '#1f2937' }}>
              Education
            </h2>
          </div>
          <div className="space-y-3 pl-4">
            {data.education.map((education) => (
              <div key={education.id} className="relative">
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                  }}
                  data-preserve="true"
                ></div>
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold" style={{ color: '#1f2937' }}>
                      {education.degree}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: '#059669' }}>
                      {education.school}
                      {education.location && ` • ${education.location}`}
                    </p>
                    {education.gpa && (
                      <p className="text-xs text-gray-600">GPA: {education.gpa}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 ml-4">
                    {formatDateRange(education.startDate, education.endDate, education.current)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center mb-3">
            <div
              style={{
                width: '4px',
                height: '20px',
                backgroundColor: '#059669',
                marginRight: '12px',
              }}
              data-preserve="true"
            ></div>
            <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: '#1f2937' }}>
              Skills & Technologies
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 pl-4">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center mb-3">
            <div
              style={{
                width: '4px',
                height: '20px',
                backgroundColor: '#059669',
                marginRight: '12px',
              }}
              data-preserve="true"
            ></div>
            <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: '#1f2937' }}>
              Certifications
            </h2>
          </div>
          <div className="space-y-3 pl-4">
            {data.certifications.map((certification) => (
              <div key={certification.id} className="relative">
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                  }}
                  data-preserve="true"
                ></div>
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold" style={{ color: '#1f2937' }}>
                      {certification.name}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: '#059669' }}>
                      {certification.issuer}
                    </p>
                    {certification.credentialId && (
                      <p className="text-xs text-gray-600">
                        Credential ID: {certification.credentialId}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 ml-4">
                    {formatDate(certification.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center mb-3">
            <div
              style={{
                width: '4px',
                height: '20px',
                backgroundColor: '#059669',
                marginRight: '12px',
              }}
              data-preserve="true"
            ></div>
            <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: '#1f2937' }}>
              Languages
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 pl-4">
            {data.languages.map((language) => (
              <div key={language.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                    {language.name}
                  </h3>
                  <p className="text-xs text-gray-600">{language.proficiency}</p>
                </div>
                <div className="flex gap-1">
                  {renderStars(language.proficiency)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-5">
          {data.customSections.map((section) => (
            <section key={section.id} className="mb-5">
              <div className="flex items-center mb-3">
                <div
                  style={{
                    width: '4px',
                    height: '20px',
                    backgroundColor: '#059669',
                    marginRight: '12px',
                  }}
                  data-preserve="true"
                ></div>
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: '#1f2937' }}>
                  {section.heading}
                </h2>
              </div>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line pl-4">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <h3 className="text-lg font-semibold mb-3">Your Resume Preview</h3>
          <p>Start filling out the form to see your resume come to life!</p>
        </div>
      )}
    </div>
  );
});

ElegantMinimalistResume.displayName = "ElegantMinimalistResume";

export default ElegantMinimalistResume;