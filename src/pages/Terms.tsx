import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppNavigation } from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { FileText, Shield, AlertTriangle, CheckCircle } from "lucide-react";

const Terms = () => {
  const lastUpdated = "January 15, 2024";

  return (
    <>
      <SEO 
        title="Terms of Service - BuildMyResume"
        description="Read the terms of service for BuildMyResume. Learn about usage rights, limitations, and your responsibilities when using our free resume builder."
        keywords="terms of service, usage terms, legal, resume builder terms, free service terms"
        url={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/terms`}
        image={`${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/terms-preview.png`}
      />
      
      <div className="min-h-screen bg-gradient-subtle">
        <AppNavigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <h1 className="text-4xl md:text-5xl font-bold">
                    Terms of Service
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Please read these terms carefully before using BuildMyResume.
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated}
                </p>
              </div>
            </div>

            {/* Terms Overview */}
            <Card className="border-0 shadow-elegant mb-12">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <span>Service Overview</span>
                </CardTitle>
                <CardDescription>
                  What you need to know about using BuildMyResume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Free Service</h3>
                    <p className="text-sm text-muted-foreground">
                      BuildMyResume is completely free to use with no hidden costs
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Privacy Focused</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data stays yours with end-to-end encryption
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Open Source</h3>
                    <p className="text-sm text-muted-foreground">
                      MIT licensed and transparent for community review
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">No Warranty</h3>
                    <p className="text-sm text-muted-foreground">
                      Service provided "as is" without guarantees
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms Content */}
            <div className="space-y-8">
              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">1. Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By accessing and using BuildMyResume, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">2. Description of Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    BuildMyResume is a free, web-based resume builder that allows users to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Create and edit professional resumes</li>
                    <li>Choose from various ATS-friendly templates</li>
                    <li>Export resumes as PDF or JSON files</li>
                    <li>Publish resumes with secure, encrypted links</li>
                    <li>Access the service without creating an account</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">3. User Responsibilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    When using BuildMyResume, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Provide accurate and truthful information in your resumes</li>
                    <li>Not use the service for any illegal or unauthorized purpose</li>
                    <li>Not attempt to gain unauthorized access to our systems</li>
                    <li>Not interfere with or disrupt the service</li>
                    <li>Not use the service to create content that is harmful, offensive, or violates others' rights</li>
                    <li>Take responsibility for the content you create and publish</li>
                    <li>Respect rate limits and fair usage policies</li>
                    <li>Not attempt to circumvent security measures or abuse the service</li>
                    <li>Not submit excessive requests that could impact service performance</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">4. Service Limitations and Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Rate Limiting</h4>
                      <p className="text-muted-foreground">
                        To ensure fair usage and prevent abuse, we implement rate limits: 100 resume publications per 15 minutes and 20 PDF exports per hour per user. These limits are designed to prevent service disruption while allowing normal usage.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Size Limits</h4>
                      <p className="text-muted-foreground">
                        Resume data is limited to 1MB per resume to ensure optimal performance and prevent potential security issues. Field lengths are also validated to maintain service stability.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Security Measures</h4>
                      <p className="text-muted-foreground">
                        We implement various security measures including data validation, encryption, and monitoring to protect our service and users. These measures may include temporary collection of minimal technical data for security purposes only.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Service Availability</h4>
                      <p className="text-muted-foreground">
                        We reserve the right to temporarily suspend or limit access to the service if we detect unusual activity or potential security threats, while maintaining service for legitimate users.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">5. Privacy and Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Data Ownership</h4>
                      <p className="text-muted-foreground">
                        You retain full ownership of all content you create using BuildMyResume. We do not claim any rights to your resume content.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Processing</h4>
                      <p className="text-muted-foreground">
                        All resume data is processed locally in your browser. Data is only transmitted when you choose to export or publish your resume, and is encrypted during transmission.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Retention</h4>
                      <p className="text-muted-foreground">
                        We do not store your resume content unless you choose to publish it. Published resumes are encrypted and can only be accessed with the specific link and key.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">6. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Your Content</h4>
                      <p className="text-muted-foreground">
                        You retain all rights to the content you create using BuildMyResume. You are responsible for ensuring you have the right to use any information included in your resumes.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Our Service</h4>
                      <p className="text-muted-foreground">
                        BuildMyResume, including its templates, design, and functionality, is protected by intellectual property laws. The service is provided under the MIT license, which allows for free use, modification, and distribution.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Third-Party Content</h4>
                      <p className="text-muted-foreground">
                        Some templates may include design elements or fonts that are subject to their own licensing terms. You are responsible for complying with any applicable third-party licenses.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">7. Service Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We strive to provide reliable service, but BuildMyResume is provided "as is" without warranties of any kind. We do not guarantee:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Uninterrupted or error-free service</li>
                    <li>Compatibility with all devices or browsers</li>
                    <li>Specific results from using the service</li>
                    <li>Availability of all features at all times</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We may temporarily suspend or discontinue the service for maintenance, updates, or other reasons without prior notice.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">8. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To the maximum extent permitted by law, BuildMyResume and its creator shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the service.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">9. Indemnification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You agree to indemnify and hold harmless BuildMyResume and its creator from any claims, damages, or expenses arising from your use of the service or violation of these terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">10. Termination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    You may stop using BuildMyResume at any time. We may terminate or suspend access to the service immediately, without prior notice, for any reason, including breach of these terms.
                  </p>
                  <p className="text-muted-foreground">
                    Upon termination, your right to use the service will cease immediately. If you have published resumes, you may lose access to them unless you have saved the links and keys.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">11. Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date at the top of this page. Your continued use of BuildMyResume after any changes constitutes acceptance of the updated terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">12. Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    These terms shall be governed by and construed in accordance with the laws of the jurisdiction where the service is operated, without regard to its conflict of law provisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl">13. Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    If you have any questions about these terms of service, please contact us:
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

export default Terms; 