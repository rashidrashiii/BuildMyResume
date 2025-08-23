import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Shield, Zap, Github, ArrowRight, CheckCircle, Star, Play, Monitor, Smartphone, Users, GitFork, Heart, Sparkles, Bot, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AppNavigation } from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { faqItems } from "@/constants/faq";
import GitHubStats from "@/components/GitHubStats";
import ResumeCounter from "@/components/ResumeCounter";

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
      icon: <FileText className="h-8 w-8" />,
      title: "Professional Templates",
      description: "ATS-friendly templates designed to make you stand out in any industry."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Enhancement",
      description: "Intelligent content enhancement with advanced AI for professional, ATS-friendly resumes."
    },
    {
      icon: <Wand2 className="h-8 w-8" />,
      title: "AI Resume Generation",
      description: "Create complete resumes from a simple description. AI generates all sections including experience, education, skills, and more."
    },
    {
      icon: <Github className="h-8 w-8" />,
      title: "Open Source",
      description: "MIT licensed. Built for transparency, collaboration, and the community."
    }
  ];
  

  const benefits = [
    "No sign-up required",
    "ATS-friendly templates",
    "AI-powered enhancement",
    "AI resume generation",
    "End-to-end encrypted",
    "Free forever"
  ];

  return (
    <>
      <SEO 
        title="Open Source Resume Builder - Create Professional ATS-Friendly Resumes"
        description="Build professional, ATS-friendly resumes with our privacy-first resume builder. Features AI-powered enhancement, multiple templates, and no sign-up required. 100% free, end-to-end encrypted, and open source."
        keywords="resume builder, open source resume builder, ATS friendly resume, professional resume templates, CV builder, job application, career tools, resume maker, online resume builder, AI resume enhancement, privacy resume builder"
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
              AI-powered, open-source resume builder for professional, ATS-optimized resumes.
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
              
              {/* Resume Counter - Proper spacing */}
              <div className="flex justify-center mt-2 mb-2 sm:mt-4 sm:mb-6">
                <ResumeCounter />
              </div>
          </div>

          {/* Benefits Grid - Proper spacing */}
          <div className="text-center mt-6 sm:mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex justify-center">
                  <div className="flex items-start md:items-center space-x-2 text-sm max-w-[120px] md:max-w-none">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 md:mt-0 flex-shrink-0" />
                    <span className="text-muted-foreground text-center leading-tight md:leading-normal">{benefit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* GitHub Stats */}
            <div className="flex justify-center pt-2 mt-4 sm:mt-8">
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

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
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

          {/* AI Resume Generation Showcase Section */}
          <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
            
            <div className="relative">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary" className="text-sm px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                  ✨ AI-Powered Innovation
                </Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Create Your Resume
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    With AI Magic
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Simply describe your background and watch AI transform it into a complete, professional resume. 
                  No more staring at blank forms - let artificial intelligence do the heavy lifting.
                </p>
              </div>

              <div className="max-w-6xl mx-auto">
                {/* Main Showcase Card */}
                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
                  <CardContent className="p-8 lg:p-12 relative">
                                         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                       
                       {/* Left Side - Input Example */}
                       <div className="space-y-6">
                         <div className="space-y-4">
                           <div className="flex items-center gap-3">
                             <div className="w-3 h-3 bg-red-500 rounded-full" />
                             <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                             <div className="w-3 h-3 bg-green-500 rounded-full" />
                             <span className="text-sm text-muted-foreground ml-2">AI Resume Creator</span>
                           </div>
                           <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                             <p className="text-sm text-muted-foreground mb-2">Tell us about yourself:</p>
                             <div className="space-y-2 text-sm">
                               <div className="bg-white dark:bg-gray-700 rounded px-3 py-2 border border-gray-200 dark:border-gray-600">
                                 <span className="text-blue-600 dark:text-blue-400">Software engineer</span> with 5 years experience in React and Node.js...
                               </div>
                               <div className="bg-white dark:bg-gray-700 rounded px-3 py-2 border border-gray-200 dark:border-gray-600">
                                 Worked at <span className="text-green-600 dark:text-green-400">Google</span> and <span className="text-green-600 dark:text-green-400">Microsoft</span>...
                               </div>
                               <div className="bg-white dark:bg-gray-700 rounded px-3 py-2 border border-gray-200 dark:border-gray-600">
                                 Master's degree in <span className="text-purple-600 dark:text-purple-400">Computer Science</span> from Stanford...
                               </div>
                             </div>
                           </div>
                         </div>
                         
                         <div className="flex items-center justify-center">
                           <div className="relative">
                             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                               <Wand2 className="h-8 w-8 text-white" />
                             </div>
                             <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-lg animate-pulse" />
                           </div>
                         </div>
                       </div>

                       {/* Right Side - Output Preview */}
                       <div className="space-y-6">
                         <div className="space-y-4">
                           <div className="flex items-center gap-3">
                             <div className="w-3 h-3 bg-red-500 rounded-full" />
                             <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                             <div className="w-3 h-3 bg-green-500 rounded-full" />
                             <span className="text-sm text-muted-foreground ml-2">Generated Resume</span>
                           </div>
                           <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
                            <div className="space-y-3">
                              <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
                                <h3 className="font-semibold text-lg">John Doe</h3>
                                <p className="text-sm text-muted-foreground">Software Engineer</p>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <span className="text-sm font-medium">Experience</span>
                                </div>
                                <div className="ml-4 space-y-1">
                                  <p className="text-sm"><strong>Senior Software Engineer</strong> at Google</p>
                                  <p className="text-xs text-muted-foreground">2020 - Present</p>
                                </div>
                                <div className="ml-4 space-y-1">
                                  <p className="text-sm"><strong>Software Engineer</strong> at Microsoft</p>
                                  <p className="text-xs text-muted-foreground">2018 - 2020</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                  <span className="text-sm font-medium">Education</span>
                                </div>
                                <div className="ml-4">
                                  <p className="text-sm"><strong>Master's in Computer Science</strong></p>
                                  <p className="text-xs text-muted-foreground">Stanford University, 2018</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                  <span className="text-sm font-medium">Skills</span>
                                </div>
                                <div className="ml-4 flex flex-wrap gap-1">
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">React</span>
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">Node.js</span>
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">TypeScript</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl flex items-center justify-center mx-auto">
                          <Sparkles className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold">Complete Generation</h4>
                        <p className="text-sm text-muted-foreground">AI creates all sections including experience, education, skills, and custom content</p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl flex items-center justify-center mx-auto">
                          <Shield className="h-6 w-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold">Privacy First</h4>
                        <p className="text-sm text-muted-foreground">Your data is processed securely with end-to-end encryption and never stored</p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl flex items-center justify-center mx-auto">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold">ATS Optimized</h4>
                        <p className="text-sm text-muted-foreground">Generated content is optimized for Applicant Tracking Systems</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8 text-center">
                      <Link to="/editor">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                          <Wand2 className="mr-2 h-5 w-5" />
                          Try AI Resume Generation
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-3">
                        No sign-up required • 100% free • Instant results
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Elements for Visual Appeal */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-lg animate-pulse delay-500" />
              </div>
            </div>
          </section>

          {/* AI Features Section */}
          <section className="py-12 sm:py-16 lg:py-24">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                Powered by Advanced AI
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Enhance your resume creation experience with intelligent AI features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Card className="border-0 shadow-card hover:shadow-float transition-all duration-300 text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                    <Wand2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">AI Resume Generation</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    Simply describe your background and let AI create your entire resume with experience, education, skills, and custom sections.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card hover:shadow-float transition-all duration-300 text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center text-green-600 mb-4">
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
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                    <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    All AI processing is done securely with end-to-end encryption. Your content is validated and never stored. Complete privacy protection.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/editor">
                <Button size="lg" className="text-base sm:text-lg px-8 py-6 min-h-[48px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Try AI Features
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
                          : "Watch the full experience in action"
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
