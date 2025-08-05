import { forwardRef } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Star, Award, Calendar, MapPin as Location } from "lucide-react";
import { ResumeData } from "@/contexts/ResumeContext";

const BoldCreativeResume = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
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
            fill: isFilled ? '#f59e0b' : 'none',
            stroke: isFilled ? '#f59e0b' : '#d1d5db',
          }}
        />
      );
    });
  };

  const renderSkillBar = (skill: string, level: number = 4) => {
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium" style={{ color: '#1f2937' }}>{skill}</span>
          <span className="text-xs text-gray-600">{Math.min(level * 20, 100)}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#f3f4f6',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
          data-preserve="true"
        >
          <div
            style={{
              width: `${Math.min(level * 20, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }}
            data-preserve="true"
          ></div>
        </div>
      </div>
    );
  };

  const renderCreativeSkill = (skill: string) => {
    return (
      <div
        key={skill}
        className="inline-block px-2 py-1 m-1 rounded-full font-semibold text-xs transition-all duration-300 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          color: 'white',
          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
          border: '2px solid #f59e0b',
        }}
        data-preserve="true"
      >
        {skill}
      </div>
    );
  };

  return (
    <div ref={ref} className="bg-white text-gray-900 mx-auto overflow-hidden" style={{ fontFamily: 'Inter, sans-serif', maxWidth: '8.27in', width: '100%' }}>
      {/* Hero Header with Geometric Background */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
          position: 'relative',
          padding: '24px 20px 20px',
          color: 'white',
        }}
        data-preserve="true"
      >
        {/* Geometric Shapes */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '20px',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'rotate(45deg)',
          }}
          data-preserve="true"
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '12px',
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.08)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
          data-preserve="true"
        ></div>
        
        <div className="relative z-10">
          <h1 className="text-lg font-bold mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {data.firstName} {data.lastName}
          </h1>
          
          {/* Contact Grid */}
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
            {data.email && (
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    padding: '3px',
                  }}
                  data-preserve="true"
                >
                  <Mail className="h-3 w-3" />
                </div>
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    padding: '3px',
                  }}
                  data-preserve="true"
                >
                  <Phone className="h-3 w-3" />
                </div>
                <span>{data.phone}</span>
              </div>
            )}
            {(data.city || data.state) && (
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    padding: '3px',
                  }}
                  data-preserve="true"
                >
                  <MapPin className="h-3 w-3" />
                </div>
                <span>{[data.city, data.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {data.linkedIn && (
              <div className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    padding: '3px',
                  }}
                  data-preserve="true"
                >
                  <Linkedin className="h-3 w-3" />
                </div>
                <span>{data.linkedIn}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Professional Summary with Card Design */}
        {data.summary && (
          <section className="mb-4">
            <div
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                position: 'relative',
              }}
              data-preserve="true"
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '16px',
                  width: '30px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  borderRadius: '0 0 2px 2px',
                }}
                data-preserve="true"
              ></div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: '#1e40af' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#f59e0b',
                    borderRadius: '50%',
                  }}
                  data-preserve="true"
                ></div>
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
            </div>
          </section>
        )}

        {/* Experience with Timeline */}
        {data.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1e40af' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '50%',
                }}
                data-preserve="true"
              ></div>
              PROFESSIONAL EXPERIENCE
            </h2>
            
            <div className="space-y-6">
              {data.experiences.map((experience, index) => (
                <div key={experience.id} className="relative">
                  <div
                    style={{
                      backgroundColor: '#fefefe',
                      borderRadius: '8px',
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    data-preserve="true"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold" style={{ color: '#1f2937' }}>
                          {experience.title}
                        </h3>
                        <p className="text-sm font-semibold" style={{ color: '#3b82f6' }}>
                          {experience.company}
                        </p>
                        {experience.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <Location className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-600">{experience.location}</span>
                          </div>
                        )}
                      </div>
                      <div
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          border: '1px solid #bfdbfe',
                        }}
                      >
                        {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                      </div>
                    </div>
                    {experience.description && (
                      <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                        {experience.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1e40af' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '50%',
                }}
                data-preserve="true"
              ></div>
              EDUCATION
            </h2>
            <div className="space-y-4">
              {data.education.map((education) => (
                <div
                  key={education.id}
                  style={{
                    backgroundColor: '#fefefe',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderLeft: '4px solid #10b981',
                  }}
                  data-preserve="true"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold" style={{ color: '#1f2937' }}>
                        {education.degree}
                      </h3>
                      <p className="text-sm font-semibold" style={{ color: '#10b981' }}>
                        {education.school}
                      </p>
                      {education.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <Location className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">{education.location}</span>
                        </div>
                      )}
                      {education.gpa && (
                        <p className="text-xs text-gray-600 mt-1">GPA: {education.gpa}</p>
                      )}
                    </div>
                    <div
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: '#ecfdf5',
                        color: '#065f46',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      {formatDateRange(education.startDate, education.endDate, education.current)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills with Creative Bold Design */}
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1e40af' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '50%',
                }}
                data-preserve="true"
              ></div>
              SKILLS & TECHNOLOGIES
            </h2>
            <div
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                padding: '20px',
                border: '2px solid #e2e8f0',
              }}
              data-preserve="true"
            >
              <div className="flex flex-wrap justify-center">
                {data.skills.map((skill, index) => renderCreativeSkill(skill))}
              </div>
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1e40af' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '50%',
                }}
                data-preserve="true"
              ></div>
              CERTIFICATIONS
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {data.certifications.map((certification) => (
                <div
                  key={certification.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fed7aa',
                  }}
                  data-preserve="true"
                >
                  <Award className="h-5 w-5" style={{ color: '#f59e0b' }} />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold" style={{ color: '#1f2937' }}>
                      {certification.name}
                    </h3>
                    <p className="text-xs" style={{ color: '#f59e0b' }}>
                      {certification.issuer}
                    </p>
                    {certification.credentialId && (
                      <p className="text-xs text-gray-600">
                        ID: {certification.credentialId}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(certification.date)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages with Star Ratings */}
        {data.languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1e40af' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '50%',
                }}
                data-preserve="true"
              ></div>
              LANGUAGES
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.languages.map((language) => (
                <div
                  key={language.id}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                  data-preserve="true"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: '#1f2937' }}>
                        {language.name}
                      </h3>
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

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <div className="space-y-6">
            {data.customSections.map((section) => (
              <section key={section.id} className="mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1e40af' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#f59e0b',
                      borderRadius: '50%',
                    }}
                    data-preserve="true"
                  ></div>
                  {section.heading.toUpperCase()}
                </h2>
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                  data-preserve="true"
                >
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <h3 className="text-lg font-semibold mb-3">Your Powerful Resume Preview</h3>
            <p>Start filling out the form to see your stunning resume come to life!</p>
          </div>
        )}
      </div>
    </div>
  );
});

BoldCreativeResume.displayName = "BoldCreativeResume";

export default BoldCreativeResume;