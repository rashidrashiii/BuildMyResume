import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Sparkles, Check, X, Wand2, ChevronRight, HelpCircle } from 'lucide-react';
import { generateResumeFromBrief } from '@/services/ai';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';
import { ResumeData } from '@/contexts/ResumeContext';

interface AIAssistedFormProps {
  disabled?: boolean;
}

const AIAssistedForm = ({ disabled = false }: AIAssistedFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [brief, setBrief] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<ResumeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  const { state, loadData } = useResume();

  const handleGenerate = async () => {
    if (!brief.trim()) {
      toast.error('Please enter a brief description about yourself');
      return;
    }

    if (brief.length < 50) {
      toast.error('Please provide more details (at least 50 characters)');
      return;
    }

    setIsGenerating(true);
    
    try {
      const data = await generateResumeFromBrief(brief);
      // Ensure required fields are present with default values and proper type casting
      const processedData: ResumeData = {
        ...data,
        linkedIn: data.linkedIn || '',
        website: data.website || '',
        education: (data.education || []).map(edu => ({
          ...edu,
          gpa: edu.gpa || ''
        })),
        experiences: (data.experiences || []).map(exp => ({
          ...exp,
          id: exp.id || Date.now().toString()
        })),
        languages: (data.languages || []).map(lang => ({
          ...lang,
          id: lang.id || Date.now().toString(),
          proficiency: (lang.proficiency as "Native" | "Conversational" | "Basic" | "Fluent") || "Basic",
          rating: lang.rating || 5
        })),
        certifications: (data.certifications || []).map(cert => ({
          ...cert,
          id: cert.id || Date.now().toString()
        })),
        customSections: (data.customSections || []).map(section => ({
          ...section,
          id: section.id || Date.now().toString()
        }))
      };
      setGeneratedData(processedData);
      setShowPreview(true);
      toast.success('Resume data generated successfully! Review the preview below.');
    } catch (error: any) {
      console.error('AI generation failed:', error);
      toast.error(error.message || 'Failed to generate resume data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedData) {
      // Data is already properly transformed in handleGenerate
      loadData(generatedData);
      setIsOpen(false);
      setBrief('');
      setGeneratedData(null);
      setShowPreview(false);
      setShowTips(false);
      toast.success('Resume data applied to form! You can now edit and customize it.');
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setBrief('');
    setGeneratedData(null);
    setShowPreview(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="md:hidden w-full -mt-2 mb-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200"
          disabled={disabled}
          data-ai-button
        >
          <Wand2 className="h-4 w-4 mr-2" />
          AI Resume Creator
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
            <Wand2 className="h-5 w-5" />
            AI Resume Creator
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Tell us about your background and we'll create your resume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Input Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Your Background
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTips(!showTips)}
                  className={`rounded-md transition-colors duration-200 border border-transparent cursor-pointer ${
                    showTips 
                      ? 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/30 dark:border-blue-700' 
                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30 hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Tips
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="brief">
                  Tell us about yourself
                </Label>
                <Textarea
                  id="brief"
                  placeholder="Example: Software engineer with 5 years experience in React and Node.js. Worked at Google and Microsoft leading development teams. Master's degree in Computer Science from Stanford. Volunteer coding instructor and published research papers on machine learning."
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Minimum 50 characters. Include experience, skills, education, and achievements.
                </p>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={!brief.trim() || brief.length < 50 || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Resume...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Collapsible Tips Section */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-700">
            <Collapsible open={showTips} onOpenChange={setShowTips}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-3 h-auto rounded-none border-0 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 transition-colors duration-200 group cursor-pointer"
                >
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200">
                    Tips for better results
                  </span>
                  <ChevronRight className={`h-4 w-4 transition-all duration-300 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 ${showTips ? 'rotate-90' : 'rotate-0'}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 duration-300">
                <div className="border-t border-blue-200 dark:border-blue-700">
                  <div className="px-3 py-2">
                    <div className="space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
                      <p>• <strong>Be specific:</strong> Company names, technologies, achievements</p>
                      <p>• <strong>Include everything:</strong> Experience, skills, education, projects</p>
                      <p>• <strong>Personal info:</strong> Add your name, email, phone if needed</p>
                      <p>• <strong>Dates optional:</strong> Only mention if you want them included</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Enhanced Preview Section */}
          {showPreview && generatedData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  Resume Created!
                </CardTitle>
                <CardDescription>
                  {generatedData.experiences.length} experiences • {generatedData.education.length} education • {generatedData.skills.length} skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Detailed Preview */}
                <div className="max-h-96 overflow-y-auto space-y-4 text-sm">
                  {/* Personal Info */}
                  {(generatedData.firstName || generatedData.lastName) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Personal Information</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p><strong>Name:</strong> {generatedData.firstName} {generatedData.lastName}</p>
                        {generatedData.email && <p><strong>Email:</strong> {generatedData.email}</p>}
                        {generatedData.phone && <p><strong>Phone:</strong> {generatedData.phone}</p>}
                        {generatedData.address && <p><strong>Address:</strong> {generatedData.address}</p>}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {generatedData.summary && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Summary</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p>{generatedData.summary}</p>
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {generatedData.experiences && generatedData.experiences.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Experience ({generatedData.experiences.length})</h4>
                      <div className="space-y-2">
                        {generatedData.experiences.map((exp, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p><strong>{exp.title}</strong> at {exp.company}</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : 
                               exp.startDate ? `${exp.startDate} - Present` : 'No dates specified'}
                            </p>
                            {exp.description && <p className="mt-1">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {generatedData.education && generatedData.education.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Education ({generatedData.education.length})</h4>
                      <div className="space-y-2">
                        {generatedData.education.map((edu, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p><strong>{edu.degree}</strong> in {edu.field}</p>
                            <p>{edu.school}</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : 
                               edu.startDate ? `${edu.startDate} - Present` : 'No dates specified'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {generatedData.skills && generatedData.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Skills ({generatedData.skills.length})</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {generatedData.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {generatedData.languages && generatedData.languages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Languages ({generatedData.languages.length})</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="space-y-1">
                          {generatedData.languages.map((lang, index) => (
                            <p key={index}>{lang.name} - {lang.proficiency}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {generatedData.certifications && generatedData.certifications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Certifications ({generatedData.certifications.length})</h4>
                      <div className="space-y-2">
                        {generatedData.certifications.map((cert, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p><strong>{cert.name}</strong></p>
                            {cert.issuer && <p>Issuer: {cert.issuer}</p>}
                            {cert.date && <p>Date: {cert.date}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Sections */}
                  {generatedData.customSections && generatedData.customSections.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Additional Sections ({generatedData.customSections.length})</h4>
                      <div className="space-y-2">
                        {generatedData.customSections.map((section, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p><strong>{section.heading}</strong></p>
                            <p>{section.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    onClick={handleApply}
                    className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Use This Resume
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistedForm;
