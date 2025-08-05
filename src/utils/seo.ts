// SEO utility functions for BuildMyResume

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  image: string;
  url: string;
  type: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// Generate WebApplication structured data
export const generateWebAppStructuredData = (): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BuildMyResume',
  description: 'Free, privacy-first resume builder with ATS-friendly templates',
  url: import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  author: {
    '@type': 'Person',
    name: 'Muhammed Rashid V',
    url: 'https://linkedin.com/in/muhammed-rashid-v',
    sameAs: [
      'https://linkedin.com/in/muhammed-rashid-v',
      'https://github.com/rashidrashiii/BuildMyResume'
    ]
  },
  creator: {
    '@type': 'Person',
    name: 'Muhammed Rashid V',
    url: 'https://linkedin.com/in/muhammed-rashid-v'
  },
  featureList: [
    'ATS-friendly resume templates',
    'End-to-end encryption',
    'No sign-up required',
    'PDF export',
    'Real-time preview',
    'Mobile responsive'
  ],
  screenshot: `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/screenshot.png`,
  softwareVersion: '1.0.0',
  license: 'https://github.com/rashidrashiii/BuildMyResume/blob/main/LICENSE'
});

// Generate Organization structured data
export const generateOrganizationStructuredData = (): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BuildMyResume',
  url: import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live',
  logo: `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/logo.png`,
  founder: {
    '@type': 'Person',
    name: 'Muhammed Rashid V',
    url: 'https://linkedin.com/in/muhammed-rashid-v'
  },
  sameAs: [
    'https://github.com/rashidrashiii/BuildMyResume',
    'https://linkedin.com/in/muhammed-rashid-v'
  ],
  description: 'Open source, privacy-first resume builder created by Muhammed Rashid V'
});

// Generate BreadcrumbList structured data
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url
  }))
});

// Generate FAQ structured data
export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

// Generate Article structured data
export const generateArticleStructuredData = (data: {
  headline: string;
  description: string;
  image: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  url: string;
}): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: data.headline,
  description: data.description,
  image: data.image,
  author: {
    '@type': 'Person',
    name: data.author,
    url: 'https://linkedin.com/in/muhammed-rashid-v'
  },
  publisher: {
    '@type': 'Organization',
    name: 'BuildMyResume',
    logo: {
      '@type': 'ImageObject',
      url: `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/logo.png`
    }
  },
  datePublished: data.publishedTime,
  dateModified: data.modifiedTime || data.publishedTime,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': data.url
  }
});

// Generate Product structured data for templates
export const generateTemplateStructuredData = (template: {
  name: string;
  description: string;
  category: string;
  image: string;
  url: string;
}): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: template.name,
  description: template.description,
  image: template.image,
  url: template.url,
  category: template.category,
  brand: {
    '@type': 'Brand',
    name: 'BuildMyResume'
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  }
});

// Generate LocalBusiness structured data
export const generateLocalBusinessStructuredData = (): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'BuildMyResume',
  description: 'Free online resume builder created by Muhammed Rashid V',
  url: import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live',
  founder: {
    '@type': 'Person',
    name: 'Muhammed Rashid V',
    url: 'https://linkedin.com/in/muhammed-rashid-v'
  },
  sameAs: [
    'https://github.com/rashidrashiii/BuildMyResume',
    'https://linkedin.com/in/muhammed-rashid-v'
  ],
  areaServed: 'Worldwide',
  serviceType: 'Resume Builder',
  priceRange: 'Free'
});

// SEO helper functions
export const generateMetaTags = (data: SEOData) => {
  const tags = {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    'og:title': data.title,
    'og:description': data.description,
    'og:image': data.image,
    'og:url': data.url,
    'og:type': data.type,
    'twitter:card': 'summary_large_image',
    'twitter:title': data.title,
    'twitter:description': data.description,
    'twitter:image': data.image,
    'twitter:url': data.url,
  };

  if (data.publishedTime) {
    tags['article:published_time'] = data.publishedTime;
  }
  if (data.modifiedTime) {
    tags['article:modified_time'] = data.modifiedTime;
  }
  if (data.author) {
    tags['article:author'] = data.author;
  }
  if (data.section) {
    tags['article:section'] = data.section;
  }
  if (data.tags) {
    data.tags.forEach((tag, index) => {
      tags[`article:tag:${index}`] = tag;
    });
  }

  return tags;
};

// Generate canonical URL
export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live';
  return `${baseUrl}${path}`;
};

// Generate sitemap entry
export const generateSitemapEntry = (path: string, priority: number = 0.5, changefreq: string = 'monthly') => ({
      loc: `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}${path}`,
  lastmod: new Date().toISOString().split('T')[0],
  changefreq,
  priority
});

// SEO constants
export const SEO_CONSTANTS = {
  SITE_NAME: 'BuildMyResume',
  SITE_URL: import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live',
  DEFAULT_IMAGE: `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/og-image.png`,
  DEFAULT_AUTHOR: 'Muhammed Rashid V',
  DEFAULT_KEYWORDS: 'resume builder, CV builder, ATS friendly resume, professional resume, free resume builder, privacy resume builder, open source resume, job application, career tools',
} as const; 