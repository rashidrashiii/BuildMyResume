import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppNavigation } from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { 
  Linkedin, 
  Github, 
  Instagram, 
  Globe, 
  Mail, 
  MapPin, 
  User, 
  Code, 
  Heart,
  ArrowRight,
  FileText,
  Shield,
  Zap
} from "lucide-react";

const Contact = () => {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/muhammed-rashid-v",
      icon: <Linkedin className="h-5 w-5" />,
      description: "Professional networking and collaboration",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "GitHub",
      url: "https://github.com/rashidrashiii",
      icon: <Github className="h-5 w-5" />,
      description: "Open source projects and contributions",
      color: "bg-gray-800 hover:bg-gray-900"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/rashidrashiii",
      icon: <Instagram className="h-5 w-5" />,
      description: "Personal updates and behind-the-scenes",
      color: "bg-pink-600 hover:bg-pink-700"
    },
    {
      name: "Website",
      url: "https://rashidv.dev",
      icon: <Globe className="h-5 w-5" />,
      description: "Portfolio and professional work",
      color: "bg-green-600 hover:bg-green-700"
    }
  ];

  const skills = [
    // Frontend Technologies
    "React & TypeScript", "Next.js", "Angular", "JavaScript/ES6+", "HTML5/CSS3", "Tailwind CSS", "Sass/SCSS", "Flutter",
    
    // Backend & APIs
    "Node.js", "Express.js", "Python", "Django", "FastAPI", "REST APIs", "GraphQL", "Microservices",
    
    // Databases & Data
    "PostgreSQL", "MongoDB", "Redis", "MySQL", "ORM/ODM",
    
    // Cloud & DevOps
    "AWS", "Docker", "CI/CD", "Git", "GitHub Actions",
    
    // Architecture & Design
    "System Design", "Software Architecture", "Clean Code",
  ];

  return (
    <>
      <SEO 
        title="Contact Muhammed Rashid V - BuildMyResume Creator"
        description="Get in touch with Muhammed Rashid V, the creator of BuildMyResume. Connect for collaboration opportunities, professional networking, or to discuss potential projects."
        keywords="contact Muhammed Rashid V, BuildMyResume creator, developer contact, collaboration opportunities, professional networking"
        url={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/contact`}
        image={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/contact-preview.png`}
      />
      
      <div className="min-h-screen bg-gradient-subtle">
        <AppNavigation showGitHubButton={true} />
        
        <main className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                👋 Let's Connect
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Get In Touch
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  With Muhammed Rashid V
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                I'm passionate about building privacy-first, user-friendly tools that make a difference. 
                Whether you want to collaborate, discuss a project, or just connect professionally, 
                I'd love to hear from you.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* About Me Section */}
            <div className="space-y-8">
              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">About Me</CardTitle>
                      <CardDescription>Developer & Creator</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Hi! I'm <strong>Muhammed Rashid V</strong>, a developer passionate about creating 
                    tools that put users first. I believe in building solutions that are simple, 
                    effective, and respect user privacy.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    BuildMyResume was born from my own frustration with existing resume builders 
                    that had hidden fees, required sign-ups, or compromised privacy. I wanted 
                    something better — so I built it.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Available for remote collaboration worldwide</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Skills & Expertise</CardTitle>
                      <CardDescription>Technologies I work with</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">What I'm Looking For</CardTitle>
                      <CardDescription>Collaboration opportunities</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Senior software engineering roles</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Technical leadership and architecture positions</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Full-stack development projects</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Open source project collaborations</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Technical consulting and mentorship</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Product development partnerships</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Social Section */}
            <div className="space-y-8">
              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-2xl">Connect With Me</CardTitle>
                  <CardDescription>
                    Choose your preferred way to get in touch
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${link.color}`}>
                          {link.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {link.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">Why BuildMyResume?</CardTitle>
                  <CardDescription>My approach to building tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Privacy First</h4>
                      <p className="text-sm text-muted-foreground">
                        Your data stays yours. No tracking, no accounts, no compromises.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Simple & Fast</h4>
                      <p className="text-sm text-muted-foreground">
                        No unnecessary complexity. Just tools that work when you need them.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Open Source</h4>
                      <p className="text-sm text-muted-foreground">
                        Transparent, community-driven, and free for everyone to use and improve.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant bg-muted/30">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Ready to Collaborate?</h3>
                  <p className="text-muted-foreground mb-4">
                    Let's build something amazing together. I'm always open to discussing 
                    new opportunities and partnerships.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
                    <a 
                      href="mailto:rashidv.dev@gmail.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact; 