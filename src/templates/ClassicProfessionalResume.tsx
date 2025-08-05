import { forwardRef } from 'react';
import type { ResumeData } from '@/contexts/ResumeContext';

const ClassicProfessionalResume = forwardRef<HTMLDivElement, { data: ResumeData }>(
  ({ data }, ref) => {
    /* ---------- helpers ---------- */
    const fmt = (d: string) => {
      if (!d) return '';
      return new Date(d + '-01').toLocaleDateString('en-US', {
        year: 'numeric',
      });
    };

    const range = (s: string, e: string, cur?: boolean) =>
      `${fmt(s)}-${cur ? 'Present' : fmt(e)}`;

    const formatDate = (date: string) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
      });
    };

    /* ---------- section header with horizontal rules ---------- */
    const SectionHeader = ({ children }: { children: string }) => (
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: 'uppercase',
          textAlign: 'center',
          position: 'relative',
          margin: '25px 0 15px',
        }}
      >
        <span style={{ background: '#fff', padding: '0 16px', position: 'relative', zIndex: 1 }}>
          {children}
        </span>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '35%',
            height: 1,
            background: '#000',
            transform: 'translateY(-50%)',
          }}
          data-preserve="true"
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            width: '35%',
            height: 1,
            background: '#000',
            transform: 'translateY(-50%)',
          }}
          data-preserve="true"
        />
      </h2>
    );

    return (
      <div
        ref={ref}
        style={{
          fontFamily: "'Times New Roman', serif",
          fontSize: 12,
          lineHeight: 1.4,
          color: '#000',
          background: '#fff',
          maxWidth: '8.27in',
          width: '100%',
          margin: '0 auto',
          padding: '16px 24px',
        }}
      >
        {/* thin top rule */}
        <div
          style={{ borderTop: '1px solid #000', marginBottom: 10 }}
          data-preserve="true"
        />

        {/* ---------- HEADER ---------- */}
        <header style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 2,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            {data.firstName} {data.lastName}
          </h1>
          <p style={{ fontSize: 12, marginTop: 2 }}>
            {data.phone && `${data.phone} • `}{data.email && `${data.email} • `}{data.website && `${data.website} • `}{data.linkedIn && `${data.linkedIn}`}
            <br />
            {[data.city, data.state].filter(Boolean).join(', ')}
          </p>
          <div
            style={{ borderTop: '3px solid #000', margin: '6px 0 15px' }}
            data-preserve="true"
          />
        </header>

        {/* ---------- SUMMARY ---------- */}
        {data.summary && (
          <>
            <SectionHeader>SUMMARY</SectionHeader>
            <p style={{ textAlign: 'justify', marginBottom: 15 }}>
              {data.summary}
            </p>
          </>
        )}

        {/* ---------- KEY ACHIEVEMENTS ---------- */}
        {data.customSections && data.customSections.length > 0 && (
          <>
            <SectionHeader>KEY ACHIEVEMENTS</SectionHeader>
            <ul style={{ margin: 0, paddingLeft: 20, marginBottom: 15 }}>
              {data.customSections.map((section) => (
                <li key={section.id}>{section.content}</li>
              ))}
            </ul>
          </>
        )}

        {/* ---------- PROFESSIONAL EXPERIENCE ---------- */}
        {data.experiences && data.experiences.length > 0 && (
          <>
            <SectionHeader>PROFESSIONAL EXPERIENCE</SectionHeader>
            {data.experiences.map((experience) => (
              <div key={experience.id} style={{ marginBottom: 15 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                  }}
                >
                  <span>{experience.title}</span>
                  <span>{range(experience.startDate, experience.endDate, experience.current)}</span>
                </div>
                <div style={{ fontWeight: 700 }}>{experience.company}{experience.location && `, ${experience.location}`}</div>
                {experience.description && (
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {experience.description.split('\n').map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}

        {/* ---------- SKILLS ---------- */}
        {data.skills && data.skills.length > 0 && (
          <>
            <SectionHeader>SKILLS</SectionHeader>
            <div style={{ display: 'flex', gap: 40 }}>
              <div>
                <b>Technical Skills</b>
                <br />
                {data.skills.join(' • ')}
              </div>
            </div>
          </>
        )}

        {/* ---------- CERTIFICATIONS ---------- */}
        {data.certifications && data.certifications.length > 0 && (
          <>
            <SectionHeader>CERTIFICATIONS</SectionHeader>
            {data.certifications.map((certification) => (
              <div key={certification.id} style={{ marginBottom: 5 }}>
                <b>{certification.name}</b> – {certification.issuer}
                {certification.credentialId && (
                  <span style={{ fontSize: '11px', color: '#666' }}> (ID: {certification.credentialId})</span>
                )}
                <span style={{ float: 'right' }}>{formatDate(certification.date)}</span>
              </div>
            ))}
          </>
        )}

        {/* ---------- LANGUAGES ---------- */}
        {data.languages && data.languages.length > 0 && (
          <>
            <SectionHeader>LANGUAGES</SectionHeader>
            <div style={{ display: 'flex', gap: 40 }}>
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
                  <div key={language.id}>
                    <b>{language.name}</b> – {language.proficiency}
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ---------- EDUCATION ---------- */}
        {data.education && data.education.length > 0 && (
          <>
            <SectionHeader>EDUCATION</SectionHeader>
            {data.education.map((education) => (
              <div key={education.id} style={{ marginBottom: 5 }}>
                <b>{education.degree}</b> – {education.school}
                <span style={{ float: 'right' }}>{range(education.startDate, education.endDate, education.current)}</span>
              </div>
            ))}
          </>
        )}
      </div>
    );
  },
);

ClassicProfessionalResume.displayName = 'ClassicProfessionalResume';
export default ClassicProfessionalResume;