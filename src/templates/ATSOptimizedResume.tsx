import { forwardRef } from "react";
import { ResumeData } from "@/contexts/ResumeContext";

const ATSOptimizedResume = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
  };

  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    const start = formatDate(startDate);
    const end = current ? 'Current' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const renderProficiencyBar = (proficiency: string) => {
    // Calculate rating based on proficiency level
    let rating: number;
    switch (proficiency) {
      case 'Native': rating = 5; break;
      case 'Fluent': rating = 4; break;
      case 'Conversational': rating = 3; break;
      case 'Basic': rating = 2; break;
      default: rating = 1; break;
    }
    
    const segments = Array.from({ length: 12 }, (_, i) => {
      const isFilled = i < Math.round((rating / 5) * 12);
      return (
        <div
          key={i}
          style={{
            height: '8px',
            width: '8%',
            backgroundColor: isFilled ? '#000' : '#e0e0e0',
            marginRight: '2px'
          }}
          data-preserve="true"
        ></div>
      );
    });
    return segments;
  };

  const getProficiencyLevel = (proficiency: string) => {
    switch (proficiency) {
      case 'Native': return 'Native (C2)';
      case 'Fluent': return 'Fluent (C1)';
      case 'Conversational': return 'Conversational (B2)';
      case 'Basic': return 'Basic (A2)';
      default: return proficiency;
    }
  };

  return (
    <div 
      ref={ref} 
      style={{
        fontFamily: '"Times New Roman", serif',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#000',
        margin: '0',
        padding: '16px',
        background: 'white',
        maxWidth: '8.27in',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
      data-preserve="true"
    >
      <div
        style={{
          maxWidth: '8.27in',
          width: '100%',
          margin: '0 auto',
          background: 'white',
          padding: '16px'
        }}
        data-preserve="true"
      >
        {/* Top Divider */}
        <div
          style={{
            borderTop: '1px solid #000',
            margin: '10px 0 20px 0'
          }}
          data-preserve="true"
        ></div>

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}
          data-preserve="true"
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginBottom: '15px',
              textTransform: 'uppercase'
            }}
            data-preserve="true"
          >
            {data.firstName} {data.lastName}
          </div>
          
          <div
            style={{
              borderTop: '3px solid #000',
              margin: '5px 0 15px 0'
            }}
            data-preserve="true"
          ></div>
          
          <div
            style={{
              fontSize: '11px',
              marginBottom: '10px',
              lineHeight: '1.3'
            }}
            data-preserve="true"
          >
            {[data.city, data.state].filter(Boolean).join(', ')} {data.zipCode && `${data.zipCode}`} • {data.phone} • {data.email} •<br />
            {data.linkedIn && <><strong>LinkedIn:</strong> {data.linkedIn} • </>}{data.website && <><strong>WWW:</strong> {data.website}</>}
          </div>
        </div>

        {/* Professional Summary */}
        {data.summary && (
          <>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0 12px 0',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                position: 'relative'
              }}
              data-preserve="true"
            >
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
              PROFESSIONAL SUMMARY
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
            </div>
            <div
              style={{
                textAlign: 'justify',
                marginBottom: '15px',
                fontSize: '12px',
                lineHeight: '1.5'
              }}
              data-preserve="true"
            >
              {data.summary}
            </div>
          </>
        )}

        {/* Work History */}
        {data.experiences.length > 0 && (
          <>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0 12px 0',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                position: 'relative'
              }}
              data-preserve="true"
            >
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
              WORK HISTORY
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
            </div>
            
            {data.experiences.map((experience, index) => (
              <div
                key={experience.id}
                style={{
                  marginBottom: '15px'
                }}
                data-preserve="true"
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    marginBottom: '2px'
                  }}
                  data-preserve="true"
                >
                  {experience.title}, {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                </div>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    marginBottom: '8px'
                  }}
                  data-preserve="true"
                >
                  {experience.company}{experience.location && ` – ${experience.location}`}
                </div>
                {experience.description && (
                  <ul
                    style={{
                      margin: '0',
                      paddingLeft: '20px'
                    }}
                    data-preserve="true"
                  >
                    {experience.description.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                      <li
                        key={lineIndex}
                        style={{
                          marginBottom: '5px',
                          textAlign: 'justify'
                        }}
                        data-preserve="true"
                      >
                        {line.replace(/^[•-]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0 12px 0',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                position: 'relative'
              }}
              data-preserve="true"
            >
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
              EDUCATION
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
            </div>
            
            {data.education.map((education) => (
              <div
                key={education.id}
                style={{
                  marginBottom: '5px'
                }}
                data-preserve="true"
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    display: 'inline'
                  }}
                  data-preserve="true"
                >
                  {education.degree}:
                </span> "education.fieldOfStudy", {formatDate(education.endDate)}<br />
                <span
                  style={{
                    fontWeight: 'bold',
                    display: 'inline'
                  }}
                  data-preserve="true"
                >
                  {education.school}
                </span>{education.location && ` - ${education.location}`}
                {education.gpa && (
                  <div style={{ fontSize: '11px', color: '#666' }} data-preserve="true">
                    GPA: {education.gpa}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0 12px 0',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                position: 'relative'
              }}
              data-preserve="true"
            >
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
              SKILLS
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
            </div>
            
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '15px'
              }}
              data-preserve="true"
            >
              <div>
                <ul
                  style={{
                    listStyle: 'disc',
                    paddingLeft: '20px',
                    margin: '0'
                  }}
                  data-preserve="true"
                >
                  {data.skills.slice(0, Math.ceil(data.skills.length / 2)).map((skill, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: '3px'
                      }}
                      data-preserve="true"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul
                  style={{
                    listStyle: 'disc',
                    paddingLeft: '20px',
                    margin: '0'
                  }}
                  data-preserve="true"
                >
                  {data.skills.slice(Math.ceil(data.skills.length / 2)).map((skill, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: '3px'
                      }}
                      data-preserve="true"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0 12px 0',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                position: 'relative'
              }}
              data-preserve="true"
            >
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
              CERTIFICATIONS
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
            </div>
            
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: '20px',
                margin: '0'
              }}
              data-preserve="true"
            >
              {data.certifications.map((certification) => (
                <li
                  key={certification.id}
                  style={{
                    marginBottom: '5px'
                  }}
                  data-preserve="true"
                >
                  {certification.name}, {certification.issuer}
                  {certification.credentialId && ` - ${certification.credentialId}`}
                  {certification.date && ` - ${formatDate(certification.date)}`}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0 12px 0',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                position: 'relative'
              }}
              data-preserve="true"
            >
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
              LANGUAGES
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  width: '30%',
                  height: '1px',
                  background: '#000'
                }}
                data-preserve="true"
              ></div>
            </div>
            
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginBottom: '15px'
              }}
              data-preserve="true"
            >
              <div>
                {data.languages.slice(0, Math.ceil(data.languages.length / 2)).map((language) => (
                  <div
                    key={language.id}
                    style={{
                      marginBottom: '15px'
                    }}
                    data-preserve="true"
                  >
                    <div
                      style={{
                        fontWeight: 'bold',
                        marginBottom: '5px'
                      }}
                      data-preserve="true"
                    >
                      {language.name}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        marginBottom: '3px',
                        display: 'flex',
                        gap: '2px'
                      }}
                      data-preserve="true"
                    >
                      {renderProficiencyBar(language.proficiency)}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontStyle: 'italic'
                      }}
                      data-preserve="true"
                    >
                      {getProficiencyLevel(language.proficiency)}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {data.languages.slice(Math.ceil(data.languages.length / 2)).map((language) => (
                  <div
                    key={language.id}
                    style={{
                      marginBottom: '15px'
                    }}
                    data-preserve="true"
                  >
                    <div
                      style={{
                        fontWeight: 'bold',
                        marginBottom: '5px'
                      }}
                      data-preserve="true"
                    >
                      {language.name}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        marginBottom: '3px',
                        display: 'flex',
                        gap: '2px'
                      }}
                      data-preserve="true"
                    >
                      {renderProficiencyBar(language.proficiency)}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontStyle: 'italic'
                      }}
                      data-preserve="true"
                    >
                      {getProficiencyLevel(language.proficiency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <>
            {data.customSections.map((section) => (
              <div key={section.id}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    margin: '20px 0 12px 0',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    position: 'relative'
                  }}
                  data-preserve="true"
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '50%',
                      width: '30%',
                      height: '1px',
                      background: '#000'
                    }}
                    data-preserve="true"
                  ></div>
                  {section.heading}
                  <div
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '50%',
                      width: '30%',
                      height: '1px',
                      background: '#000'
                    }}
                    data-preserve="true"
                  ></div>
                </div>
                <div
                  style={{
                    textAlign: 'justify',
                    marginBottom: '15px',
                    fontSize: '12px',
                    lineHeight: '1.5'
                  }}
                  data-preserve="true"
                >
                  {section.content}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Empty State */}
        {!data.firstName && !data.lastName && !data.summary && data.experiences.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 0'
            }}
            data-preserve="true"
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}
              data-preserve="true"
            >
              Professional Resume Preview
            </div>
            <div
              style={{
                borderTop: '3px solid #000',
                margin: '5px auto 12px auto',
                width: '150px'
              }}
              data-preserve="true"
            ></div>
            <p
              style={{
                fontSize: '12px',
                color: '#666'
              }}
              data-preserve="true"
            >
              Start filling out the form to see your professional resume come to life!
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

ATSOptimizedResume.displayName = "ATSOptimizedResume";

export default ATSOptimizedResume;