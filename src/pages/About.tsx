import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppNavigation } from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { 
  Linkedin, 
  Github, 
  Instagram, 
  Globe, 
  Heart,
  Shield,
  Zap,
  FileText,
  Code,
  Users,
  Star,
  ArrowRight
} from "lucide-react";
import { useGitHubData } from "@/hooks/useGitHubData";
import { Helmet } from "react-helmet-async";

const About = () => {
  const { formattedStarCount, loading } = useGitHubData();
  const values = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description: "Your data belongs to you. No tracking, no accounts, no compromises."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Simple & Fast",
      description: "No unnecessary complexity. Just tools that work when you need them."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Open Source",
      description: "Transparent, community-driven, and free for everyone to use and improve."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User-Focused",
      description: "Built for real people with real needs, not corporate interests."
    }
  ];

  const stats = [
    { label: "Free Forever", value: "100%" },
    { label: "Privacy Focused", value: "End-to-End Encrypted" },
    { label: "Open Source", value: "MIT License" },
    { label: "No Sign-up", value: "Required" }
  ];

  return (
    <>
      <SEO 
        title="About BuildMyResume - Created by Muhammed Rashid V"
        description="Learn about BuildMyResume, a privacy-first resume builder created by Muhammed Rashid V. Discover our mission to provide free, user-friendly tools that respect your privacy."
        keywords="about BuildMyResume, Muhammed Rashid V, privacy-first resume builder, open source resume tool, free resume builder"
        url={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/about`}
        image={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/about-preview.png`}
      />
      
      {/* Enhanced Structured Data for About Page */}
      <Helmet>
        {/* Person Schema for Creator */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Muhammed Rashid V",
          "jobTitle": "Software Engineer",
          "description": "Developer passionate about building privacy-first, user-friendly tools. Creator of BuildMyResume, a free and open-source resume builder.",
                  "url": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/about`,
        "image": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/creator-profile.jpg`,
          "sameAs": [
            "https://linkedin.com/in/muhammed-rashid-v",
            "https://github.com/rashidrashiii",
            "https://rashidv.dev"
          ],
          "worksFor": {
            "@type": "Organization",
            "name": "BuildMyResume"
          },
          "knowsAbout": [
            "Web Development",
            "React",
            "TypeScript",
            "Privacy-first Development",
            "Open Source Software",
            "Resume Building Tools"
          ],
          "alumniOf": {
            "@type": "Organization",
            "name": "BuildMyResume"
          }
        })}
        </script>

        {/* About Page Schema */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "About BuildMyResume - Created by Muhammed Rashid V",
          "description": "Learn about BuildMyResume, a privacy-first resume builder created by Muhammed Rashid V. Discover our mission to provide free, user-friendly tools that respect your privacy.",
          "url": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/about`,
          "mainEntity": {
            "@type": "Person",
            "name": "Muhammed Rashid V",
            "jobTitle": "Software Engineer",
            "description": "Developer passionate about building privacy-first, user-friendly tools. Creator of BuildMyResume.",
            "url": "https://linkedin.com/in/muhammed-rashid-v"
          },
          "author": {
            "@type": "Person",
            "name": "Muhammed Rashid V"
          },
          "publisher": {
            "@type": "Organization",
            "name": "BuildMyResume",
            "url": "https://buildmyresume.live"
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
                "name": "About",
                "item": `${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/about`
              }
            ]
          }
        })}
        </script>

        {/* FAQ Schema for About Page */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Who created BuildMyResume?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "BuildMyResume was created by Muhammed Rashid V, a software engineer passionate about building privacy-first, user-friendly tools. He believes technology should serve people, not corporations."
              }
            },
            {
              "@type": "Question",
              "name": "What is Muhammed Rashid V's background?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Muhammed Rashid V is a developer with expertise in React, TypeScript, and web development. He focuses on creating tools that prioritize user privacy and simplicity."
              }
            },
            {
              "@type": "Question",
              "name": "Why was BuildMyResume created?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "BuildMyResume was created from frustration with existing resume builders that had paywalls, hidden pricing, or required sign-ups. Muhammed wanted to build something better - free, private, and user-friendly."
              }
            },
            {
              "@type": "Question",
              "name": "How can I contact Muhammed Rashid V?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can connect with Muhammed Rashid V on LinkedIn at https://linkedin.com/in/muhammed-rashid-v, visit his website at https://rashidv.dev, or use the contact form on this website."
              }
            }
          ]
        })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-subtle">
        <AppNavigation showGitHubButton={true} />
        
        <main className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🚀 Our Story
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                About
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  BuildMyResume
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A privacy-first, open-source resume builder created by Muhammed Rashid V. 
                Built for people who value simplicity, privacy, and freedom.
              </p>
            </div>
          </div>

          {/* Creator Story */}
          <section className="mb-20">
            <Card className="max-w-4xl mx-auto border-0 shadow-elegant">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-4">Meet the Creator</h2>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        Hi! I'm <strong>Muhammed Rashid V</strong>, a developer passionate about 
                        building tools that put users first. I believe technology should serve 
                        people, not corporations.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        BuildMyResume was born from my own frustration. I was trying to create 
                        an ATS-friendly resume and kept hitting paywalls, hidden pricing, or 
                        tools that required sign-up just to download. I wanted something better.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        So I built it. And since others might want the same, I made it open 
                        source and free for everyone.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href="https://linkedin.com/in/muhammed-rashid-v" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button size="lg" className="w-full sm:w-auto">
                          <Linkedin className="h-4 w-4 mr-2" />
                          Connect on LinkedIn
                        </Button>
                      </a>
                      <Link to="/contact">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Get In Touch
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, index) => (
                        <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Our Values */}
          <section className="mb-20">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we build
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-card hover:shadow-float transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mission Statement */}
          <section className="mb-20">
            <Card className="max-w-4xl mx-auto border-0 shadow-elegant bg-muted/30">
              <CardContent className="p-8 lg:p-12 text-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    To provide free, privacy-first tools that empower people to create 
                    professional documents without compromising their data or freedom. 
                    We believe everyone deserves access to quality tools without hidden costs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Open Source */}
          <section className="mb-20">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Open Source & Community</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built with transparency and community in mind
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Open Source</CardTitle>
                      <CardDescription>MIT Licensed</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    BuildMyResume is completely open source under the MIT license. 
                    You can view, modify, and distribute the code freely.
                  </p>
                  <a 
                    href="https://github.com/rashidrashiii/BuildMyResume" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full">
                      <Github className="h-4 w-4 mr-2" />
                      View on GitHub
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Community Driven</CardTitle>
                      <CardDescription>Contributions Welcome</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    We welcome contributions from the community. Whether it's bug fixes, 
                    new features, or documentation improvements.
                  </p>
                  <a 
                    href="https://github.com/rashidrashiii/BuildMyResume" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      {loading ? 'Loading...' : `${formattedStarCount}`}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <Card className="max-w-2xl mx-auto border-0 shadow-elegant">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-muted-foreground mb-6">
                  Create your professional resume in minutes, completely free and private.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/editor">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Building
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/templates">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      View Templates
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About; 