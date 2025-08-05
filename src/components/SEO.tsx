import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

const SEO = ({
  title = 'BuildMyResume - Free, Privacy-First Resume Builder | ATS-Friendly Templates',
  description = 'Create professional, ATS-friendly resumes in minutes. 100% free, no sign-up required, end-to-end encrypted. Open source resume builder with beautiful templates for job seekers.',
  keywords = 'resume builder, CV builder, ATS friendly resume, professional resume, free resume builder, privacy resume builder, open source resume, job application, career tools',
      image = `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/og-image.png`,
    url = import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Muhammed Rashid V',
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical,
}: SEOProps) => {
  const fullTitle = title.includes('BuildMyResume') ? title : `${title} | BuildMyResume`;
  const fullUrl = canonical || url;
  const robots = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;

  useEffect(() => {
    // Update document title for accessibility
    document.title = fullTitle;
  }, [fullTitle]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      
      {/* Canonical URL */}
      {fullUrl && <link rel="canonical" href={fullUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BuildMyResume" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:creator" content="@buildmyresume" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.length > 0 && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional structured data for articles */}
      {type === 'article' && (
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": fullTitle,
          "description": description,
          "image": image,
          "author": {
            "@type": "Organization",
            "name": author
          },
          "publisher": {
            "@type": "Organization",
            "name": "BuildMyResume",
            "logo": {
              "@type": "ImageObject",
              "url": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/logo.png`
            }
          },
          "datePublished": publishedTime,
          "dateModified": modifiedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          }
        })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 