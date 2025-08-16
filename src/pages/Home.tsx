import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Shield, Zap, Github, ArrowRight, CheckCircle, Star, Play, Monitor, Smartphone, Users, GitFork, Heart, Sparkles, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { AppNavigation } from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { faqItems } from "@/constants/faq";
import GitHubStats from "@/components/GitHubStats";

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy First",
      description: "End-to-end encrypted. No accounts. Your data stays yours — always."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Enhancement",
      description: "Intelligent content enhancement with Google Gemini AI for professional, ATS-friendly resumes."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Professional Templates",
      description: "ATS-friendly templates designed to make you stand out."
    },
    {
      icon: <Github className="h-8 w-8" />,
      title: "Open Source",
      description: "MIT licensed. Built for transparency, collaboration, and the community."
    }
  ];
  

  const benefits = [
    "No sign-up required",
    "AI-powered enhancement",
    "ATS-friendly templates",
    "End-to-end encrypted",
    "Export to PDF & JSON",
    "Free forever"
  ];

  return (
    <>
      <SEO 
        title="Free AI-Powered Resume Builder - Create Professional ATS-Friendly Resumes"
        description="Build professional, ATS-friendly resumes with AI-powered content enhancement. Free resume builder with Google Gemini AI integration. No sign-up required, end-to-end encrypted, and 100% free forever."
        keywords="AI resume builder, free resume builder, ATS friendly resume, professional resume templates, CV builder, job application, career tools, resume maker, online resume builder, AI content enhancement, Google Gemini resume"
        url={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}`}
        image={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/og-image.png`}
      />
      
      <div className="min-h-screen bg-gradient-subtle">
              {/* Navigation */}
      <AppNavigation showGitHubStar={true} />

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🚀 Open Source Resume Builder
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Build Your Perfect Resume
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  In Minutes, Not Hours
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Create professional, ATS-friendly resumes with our privacy-first, 
                AI-powered resume builder. Enhanced with Google Gemini AI for better content. 
                No sign-up required, completely free.
              </p>
            </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link to="/editor" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px] shadow-elegant">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link to="/templates" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px]">
                    View Templates
                  </Button>
                </Link>
              </div>

              {/* Product Hunt Badge in Hero */}
            <div className="flex justify-center">
                <a
                  href="https://www.producthunt.com/products/buildmyresume?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-buildmyresume"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BuildMyResume on Product Hunt"
                >
                  <img
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1003446&theme=light&t=1754748059292"
                    alt="BuildMyResume - Featured on Product Hunt"
                    className="h-8 sm:h-9 md:h-10 w-auto"
                  />
                </a>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-center space-x-2 text-sm text-center">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* GitHub Stats */}
            <div className="flex justify-center pt-2">
              <GitHubStats className="text-center" />
            </div>
          </div>

          {/* Features Section */}
          <section className="py-24">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose BuildMyResume?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built with modern web technologies and best practices for an exceptional user experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-0 shadow-card hover:shadow-float transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Enhancement Section */}
          <section className="py-12 sm:py-16 lg:py-24">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                AI-Powered Content Enhancement
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your resume content with intelligent AI suggestions powered by Google Gemini.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Card className="border-0 shadow-card hover:shadow-float transition-all duration-300 text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Smart Enhancement</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    Enhance your professional summary, job descriptions, and custom content with AI-powered suggestions that make your resume more compelling and ATS-friendly.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card hover:shadow-float transition-all duration-300 text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                    <Bot className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Intelligent Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    Get multiple enhancement options with each click. Accept what you like, reject what you don't. The AI learns from your preferences to provide better suggestions.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card hover:shadow-float transition-all duration-300 text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                    <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    All AI enhancements are processed securely with end-to-end encryption. Your content is validated and never stored. Complete privacy protection.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/editor">
                <Button size="lg" className="text-base sm:text-lg px-8 py-6 min-h-[48px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Try AI Enhancement
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </section>

          {/* How It Works Video Section */}
          <section className="py-12 sm:py-16 lg:py-24">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                How Does It Work?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Watch how simple it is to create a professional resume in just a few minutes.
              </p>
            </div>

            <Card className="max-w-4xl mx-auto border-0 shadow-elegant overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-hero rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/Q_FjVnEu6Es?rel=0&modestbranding=1&showinfo=0"
                    title="BuildMyResume Demo - How to Create a Professional Resume"
                    className="absolute inset-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  {/* Fallback overlay for loading state */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-hero rounded-lg" style={{ zIndex: -1 }}>
                    <div className="text-center text-white">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 hover:bg-white/30 transition-colors">
                        <Play className="h-8 w-8 ml-1" />
                      </div>
                      <p className="text-lg text-white/90 mb-4">
                        {isMobile 
                          ? "See how easy it is to build a resume on your phone" 
                          : "Watch the full desktop experience in action"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Publish Resume Section */}
          <section className="py-12 sm:py-16 lg:py-24">
            <Card className="max-w-4xl mx-auto border-0 shadow-elegant">
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 px-4">
                  Publish Once. Edit Anytime. No Account Needed.
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                  Want to edit your resume later or share it with someone? Just click "Publish" — 
                  we'll generate a secure, encrypted link you can use anytime, from any device. 
                  No sign-up. No tracking. Full privacy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                  <Link to="/editor" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px]">
                      Create & Publish Resume
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ Section */}
          <section className="py-12 sm:py-16 lg:py-24">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to know about BuildMyResume.
                </p>
              </div>

              <Card className="border-0 shadow-elegant">
                <CardContent className="p-6 sm:p-8">
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-muted/30">
                        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* GitHub Contributions Section */}
          <section className="py-16 sm:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Join Our Open Source Community
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  BuildMyResume is built by developers, for developers. We welcome contributions from everyone!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="border-0 shadow-elegant">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <GitFork className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Fork & Contribute</CardTitle>
                        <CardDescription>Start contributing to BuildMyResume</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Whether you're fixing bugs, adding features, or improving documentation, your contributions are welcome.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href="https://github.com/rashidrashiii/BuildMyResume/fork" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          <GitFork className="h-4 w-4 mr-2" />
                          Fork Repository
                        </Button>
                      </a>
                      <a 
                        href="https://github.com/rashidrashiii/BuildMyResume/blob/main/docs/CONTRIBUTING.md" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="ghost" className="w-full">
                          Read Guidelines
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-elegant">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Join the Community</CardTitle>
                        <CardDescription>Connect with other contributors</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Join our community of developers who are passionate about making resume building accessible to everyone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href="https://github.com/rashidrashiii/BuildMyResume/issues" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          <Github className="h-4 w-4 mr-2" />
                        Report Issues
                        </Button>
                      </a>
                      <a 
                      href="https://github.com/rashidrashiii/BuildMyResume/discussions" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="ghost" className="w-full">
                        Discussions
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </section>
        </main>

              <Footer />
      </div>
    </>
  );
};

export default Home;
