import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Building, GraduationCap, Lightbulb, Star, Award } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const TwoColumnLayoutResume = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
  const resumeData = data;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
  };

  const formatDateRange = (startDate, endDate, current) => {
    const start = formatDate(startDate);
    const end = current ? '01/1970' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  return (
    <div ref={ref} className="bg-white text-black font-sans mx-auto p-6" style={{ fontSize: '11px', lineHeight: '1.3', maxWidth: '8.27in', width: '100%' }}>
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-lg font-black text-gray-900 mb-2 tracking-tight">
          {data.firstName} {data.lastName}
        </h1>
        {data.experiences && data.experiences.length > 0 && (
          <p className="text-sm font-medium mb-3" style={{ color: '#4ecdc4' }}>
            {data.experiences[0].title}
          </p>
        )}
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 justify-center">
          {resumeData.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>{resumeData.phone}</span>
            </div>
          )}
          {resumeData.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>{resumeData.email}</span>
            </div>
          )}
          {resumeData.linkedIn && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-3 w-3" />
              <span>{resumeData.linkedIn}</span>
            </div>
          )}
          {(resumeData.city || resumeData.state) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{[resumeData.city, resumeData.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Main Content */}
        <div className="space-y-6">
          {/* Experience Section */}
          <section>
            <h2 className="text-base font-black text-gray-900 mb-4 pb-2" style={{ borderBottom: '3px solid black' }}>
              EXPERIENCE
            </h2>
            
            <div className="space-y-4">
              {resumeData.experiences?.map((experience) => (
                <div key={experience.id} className="pb-3">
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      {experience.title}
                    </h3>
                    <p className="font-semibold mb-2" style={{ color: '#4ecdc4' }}>
                      {experience.company}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDateRange(experience.startDate, experience.endDate, experience.current)}</span>
                      </div>
                      {experience.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {experience.description && (
                    <div className="text-xs text-gray-700 leading-relaxed pl-2">
                      {experience.description.split('\n').map((line, index) => (
                        <div key={index} className="mb-1">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <h2 className="text-base font-black text-gray-900 mb-4 pb-2" style={{ borderBottom: '3px solid black' }}>
              EDUCATION
            </h2>
            
            <div className="space-y-3">
              {resumeData.education?.map((education) => (
                <div key={education.id} className="pb-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {education.degree}
                  </h3>
                  <p className="font-semibold mb-2" style={{ color: '#4ecdc4' }}>
                    {education.school}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDateRange(education.startDate, education.endDate, education.current)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          {resumeData.summary && (
            <section>
              <h2 className="text-base font-black text-gray-900 mb-3 pb-2" style={{ borderBottom: '3px solid black' }}>
                SUMMARY
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed">
                {resumeData.summary}
              </p>
            </section>
          )}

          {/* Strengths */}
          {resumeData.customSections?.filter(section => section.heading.includes('Superpowers')).map((section) => (
            <section key={section.id}>
              <h2 className="text-base font-black text-gray-900 mb-3 pb-2" style={{ borderBottom: '3px solid black' }}>
                STRENGTHS
              </h2>
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-3 w-3" style={{ color: '#4ecdc4' }} />
                  <h3 className="text-xs font-bold text-gray-900">Technical Superpowers</h3>
                </div>
                <p className="text-xs text-gray-600 pl-5">
                  {section.content}
                </p>
              </div>
            </section>
          ))}

          {/* Key Achievements */}
          {resumeData.customSections?.filter(section => section.heading.includes('Performance')).map((section) => (
            <section key={section.id}>
              <h2 className="text-base font-black text-gray-900 mb-3 pb-2" style={{ borderBottom: '3px solid black' }}>
                KEY ACHIEVEMENTS
              </h2>
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-3 w-3" style={{ color: '#4ecdc4' }} />
                  <h3 className="text-xs font-bold text-gray-900">Performance Improvements and Efficiency Gains</h3>
                </div>
                <p className="text-xs text-gray-600 pl-5">
                  {section.content}
                </p>
              </div>
            </section>
          ))}

          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <section>
              <h2 className="text-base font-black text-gray-900 mb-3 pb-2" style={{ borderBottom: '3px solid black' }}>
                SKILLS
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section>
              <h2 className="text-base font-black text-gray-900 mb-3 pb-2" style={{ borderBottom: '3px solid black' }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {resumeData.certifications.map((certification) => (
                  <div key={certification.id} className="pb-2">
                    <h3 className="text-xs font-bold text-gray-900 mb-1">{certification.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{certification.issuer}</p>
                    {certification.credentialId && (
                      <p className="text-xs text-gray-500 mb-1">ID: {certification.credentialId}</p>
                    )}
                    <p className="text-xs text-gray-500">{formatDate(certification.date)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <section>
              <h2 className="text-base font-black text-gray-900 mb-3 pb-2" style={{ borderBottom: '3px solid black' }}>
                LANGUAGES
              </h2>
              <div className="space-y-3">
                {resumeData.languages.map((language) => {
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
                    <div key={language.id} className="flex justify-between items-center pb-2">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 mb-1">{language.name}</h3>
                        <p className="text-xs text-gray-600">{language.proficiency}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: i < rating ? '#1f2937' : '#d1d5db'
                            }}
                            data-preserve="true"
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

TwoColumnLayoutResume.displayName = "TwoColumnLayoutResume";

export default TwoColumnLayoutResume;