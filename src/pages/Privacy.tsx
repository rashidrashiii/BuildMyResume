import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppNavigation } from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, FileText } from "lucide-react";

const Privacy = () => {
  const lastUpdated = "August 1, 2025";

  return (
    <>
      <SEO 
        title="Privacy Policy - BuildMyResume"
        description="Learn how BuildMyResume protects your privacy. We collect no personal data, use end-to-end encryption, and never track your activity."
        keywords="privacy policy, data protection, no tracking, end-to-end encryption, resume builder privacy"
        url={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/privacy`}
        image={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/privacy-preview.png`}
      />
      
      <div className="min-h-screen bg-gradient-subtle">
        <AppNavigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <h1 className="text-4xl md:text-5xl font-bold">
                    Privacy Policy
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Your privacy is our priority. Learn how we protect your data and respect your rights.
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated}
                </p>
              </div>
            </div>

            {/* Privacy Overview */}
            <Card className="border-0 shadow-elegant mb-12">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-3">
                  <Eye className="h-6 w-6 text-primary" />
                  <span>Privacy Overview</span>
                </CardTitle>
                <CardDescription>
                  How BuildMyResume protects your privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">No Personal Data</h3>
                    <p className="text-sm text-muted-foreground">
                      We don't collect, store, or process any personal information
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                    <p className="text-sm text-muted-foreground">
                      All resume data is encrypted before storage or transmission
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">No Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      We don't track your activity or use cookies for tracking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy Content */}
            <div className="space-y-8">
              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">1. Information We Don't Collect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    BuildMyResume is designed with privacy in mind. We intentionally do not collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Personal identification information (name, email, phone number)</li>
                    <li>Account credentials or login information</li>
                    <li>Resume content or personal data</li>
                    <li>Browsing history or search queries</li>
                    <li>Usage analytics or behavioral data</li>
                  </ul>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Security Data</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      For security purposes only, we may temporarily collect minimal technical data (IP address, user agent) to prevent abuse and protect our service. This data is not used for tracking and is automatically deleted.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">2. How We Handle Your Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Resume Creation</h4>
                      <p className="text-muted-foreground">
                        All resume data is processed locally in your browser. Your information never leaves your device unless you choose to export or publish your resume.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">PDF Export</h4>
                      <p className="text-muted-foreground">
                        When you export to PDF, your resume data is encrypted and sent to our secure serverless function for processing. The data is immediately deleted after PDF generation and is never stored or logged.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Published Resumes</h4>
                      <p className="text-muted-foreground">
                        If you choose to publish your resume, it is encrypted with a unique key before storage. Only someone with the specific link and key can access the resume. We cannot read or access your published resume data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">3. Third-Party Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We use minimal third-party services to provide our functionality:
                  </p>
                  <div className="space-y-3">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-1">Umami Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        We use Umami for privacy-focused analytics that don't track individual users. No personal data is collected, and analytics are anonymized.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-1">Supabase</h4>
                      <p className="text-sm text-muted-foreground">
                        Used for storing encrypted resume data when you choose to publish. All data is encrypted and we cannot access the content.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">4. Your Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Since we don't collect personal data, you have complete control over your information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Your resume data stays on your device</li>
                    <li>You can delete published resumes at any time</li>
                    <li>No accounts mean no data to delete</li>
                    <li>You can export and delete your data locally</li>
                    <li>No tracking means no data to opt out of</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">5. Data Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Encryption</h4>
                      <p className="text-muted-foreground">
                        All data transmission and storage uses industry-standard encryption (AES-256) with secure key management.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Secure Infrastructure</h4>
                      <p className="text-muted-foreground">
                        Our services run on secure cloud infrastructure with regular security updates and monitoring.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">No Data Retention</h4>
                      <p className="text-muted-foreground">
                        We don't retain any personal data beyond what's necessary for immediate processing.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Rate Limiting</h4>
                      <p className="text-muted-foreground">
                        To prevent abuse and ensure fair usage, we implement rate limiting on resume publishing (100 per 15 minutes) and PDF exports (20 per hour). This helps protect our service from potential attacks while ensuring all users have fair access.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Validation</h4>
                      <p className="text-muted-foreground">
                        All resume data is validated for size and content before processing. We limit resume data to 1MB and validate field lengths to prevent potential security issues.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Security Monitoring</h4>
                      <p className="text-muted-foreground">
                        We monitor for unusual activity patterns and implement security measures to protect against potential threats while maintaining user privacy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">6. Children's Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    BuildMyResume is not intended for children under 13. We do not knowingly collect any personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">7. Changes to This Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify users of any material changes by updating the "Last updated" date at the top of this page. Your continued use of BuildMyResume after any changes constitutes acceptance of the updated policy.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">8. Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    If you have any questions about this privacy policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Creator:</strong> Muhammed Rashid V
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> rashidv.dev@gmail.com
                    </p>
                    <p className="text-muted-foreground">
                      <strong>GitHub:</strong> <a href="https://github.com/rashidrashiii" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">rashidrashiii</a>
                    </p>
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

export default Privacy; 