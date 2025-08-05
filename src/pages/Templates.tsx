import { useState } from "react";
import { templateConfigs } from "@/templates";
import { Button } from "@/components/ui/button";

import { ResumeData, Language } from "@/contexts/ResumeContext";
import { useNavigate, Link } from "react-router-dom";
import { FileText, ArrowLeft, Github, Star, Download } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import sampleData from "@/data/sample.json";


const fixSampleLanguages = (languages: any[]): Language[] =>
  languages.map((lang) => ({
    ...lang,
    proficiency: ["Native", "Conversational", "Basic", "Fluent"].includes(lang.proficiency)
      ? lang.proficiency
      : "Basic"
  })) as Language[];

const fixedSampleData: ResumeData = {
  ...sampleData,
  languages: fixSampleLanguages(sampleData.languages),
  customSections: []
};

const Templates = () => {
  const navigate = useNavigate();
  const categories = [
    "All",
    ...Array.from(new Set(templateConfigs.map((t) => t.category)))
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredTemplates = selectedCategory === "All"
    ? templateConfigs
    : templateConfigs.filter((t) => t.category === selectedCategory);

  // Generate structured data for templates
  const templateStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Professional Resume Templates",
    "description": "Collection of professional, ATS-friendly resume templates for job seekers",
            "url": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/templates`,
    "numberOfItems": templateConfigs.length,
    "itemListElement": templateConfigs.map((template, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": template.name,
        "description": template.description,
        "category": template.category,
        "image": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}${template.previewImage}`,
        "url": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/editor?template=${template.id}`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "description": `Free ${template.category.toLowerCase()} resume template`
        }
      }
    }))
  };



  return (
    <>
      <SEO 
        title="Free Resume Templates - Professional ATS-Friendly Designs | BuildMyResume"
        description="Download free professional resume templates that are ATS-friendly and perfect for job applications. Choose from 15+ modern, creative, and traditional designs. No sign-up required."
        keywords="free resume templates, ATS friendly resume templates, professional resume designs, modern resume templates, creative resume templates, job application templates, CV templates, downloadable resume templates"
        url={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/templates`}
        image={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/templates-preview.png`}
      />
      
      {/* Enhanced Structured Data for Templates Page */}
      <Helmet>
        {/* Templates Collection Schema */}
        <script type="application/ld+json">
        {JSON.stringify(templateStructuredData)}
        </script>

        {/* WebPage Schema for Templates Page */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Free Resume Templates - Professional ATS-Friendly Designs",
          "description": "Browse and download free professional resume templates that are ATS-friendly and perfect for job applications. Choose from modern, creative, and traditional designs.",
          "url": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/templates`,
          "mainEntity": {
            "@type": "ItemList",
            "name": "Resume Templates Collection",
            "numberOfItems": templateConfigs.length
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Templates",
                "item": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/templates`
              }
            ]
          }
        })}
        </script>

        {/* FAQ Schema for Templates */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Are these resume templates free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all resume templates are completely free to use. There are no hidden costs, subscriptions, or premium features."
              }
            },
            {
              "@type": "Question",
              "name": "Are the templates ATS-friendly?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all templates are designed to be ATS-friendly with clean layouts, proper headings, and readable structure to maximize your chances of passing through applicant tracking systems."
              }
            },
            {
              "@type": "Question",
              "name": "How many resume templates are available?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer 15+ professional resume templates across different categories including Professional & Traditional, Modern & Contemporary, ATS & Applicant Tracking, Technical & Engineering, Creative & Design, Elegant & Premium, and Minimalist & Clean."
              }
            },
            {
              "@type": "Question",
              "name": "Can I customize the templates?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all templates are fully customizable. You can edit text, change colors, adjust layouts, and modify any content to match your personal style and requirements."
              }
            },
            {
              "@type": "Question",
              "name": "What file formats can I export to?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can export your resume as PDF (ATS-friendly) or JSON (for backups or reuse). The PDF format is optimized for job applications and printing."
              }
            }
          ]
        })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-subtle">
        {/* Navigation/Header */}
        <AppNavigation showGitHubButton={true} />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Professional Resume
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Templates
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Choose from our collection of <strong>15+ professional, ATS-friendly resume templates</strong>. 
                All templates are completely free, customizable, and optimized for job applications.
              </p>
            </div>


          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              return (
                <div
                  key={template.id}
                  className="border rounded-lg shadow-card p-4 flex flex-col items-center cursor-pointer transition-transform hover:scale-105 hover:shadow-lg bg-background"
                  onClick={() => navigate(`/editor?template=${template.id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/editor?template=${template.id}`); }}
                  aria-label={`Select ${template.name} template`}
                >
                  <div className="relative w-full">
                    <img 
                      src={template.previewImage} 
                      alt={`${template.name} resume template preview`} 
                      className="w-full h-64 object-cover mb-4 rounded" 
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-center">{template.name}</h2>
                  <p className="text-muted-foreground mb-3 text-center text-sm leading-relaxed">{template.description}</p>
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 mb-3 font-medium">{template.category}</span>
                  
                  <div className="flex items-center justify-center mt-auto">
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editor?template=${template.id}`);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold">Ready to Create Your Professional Resume?</h2>
              <p className="text-muted-foreground">
                Choose a template and start building your ATS-friendly resume in minutes. 
                No sign-up required, completely free.
              </p>
              <Button size="lg" onClick={() => navigate('/editor')}>
                Start Building Now
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Templates;