import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, User, Briefcase, GraduationCap, Award, Languages, Lightbulb, Edit3 } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import sampleData from "@/data/sample.json";
import { Language } from "@/contexts/ResumeContext";
import AIEnhanceButton from "@/components/AIEnhanceButton";
import { AI_FIELDS } from "@/services/ai";

const fixSampleLanguages = (languages: any[]): Language[] =>
  languages.map((lang) => ({
    ...lang,
    proficiency: ["Native", "Conversational", "Basic", "Fluent"].includes(lang.proficiency)
      ? lang.proficiency
      : "Basic"
  })) as Language[];

const fixedSampleData = {
  ...sampleData,
  languages: fixSampleLanguages(sampleData.languages),
  customSections: []
};

interface ResumeFormProps {
  disabled?: boolean;
}

const ResumeForm = ({ disabled = false }: ResumeFormProps) => {
  const { 
    state, 
    updateField, 
    addExperience, 
    updateExperience, 
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    loadData
  } = useResume();
  
  const isFormDisabled = disabled || state.isPreviewEditing;
  
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      updateField('skills', [...state.data.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = state.data.skills.filter((_, i) => i !== index);
    updateField('skills', updatedSkills);
  };

  const generateId = () => Date.now().toString();

  // Show the button only if the form is empty
  const showLoadSample = !state.data.firstName && !state.data.lastName;

  return (
    <div className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Basic</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Work</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Certs</span>
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center space-x-2">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Lang</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center space-x-2">
            <Edit3 className="h-4 w-4" />
            <span className="hidden sm:inline">Custom</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter your basic contact information and professional summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={state.data.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="John"
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={state.data.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Doe"
                    disabled={isFormDisabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={state.data.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john.doe@example.com"
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={state.data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    disabled={isFormDisabled}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={state.data.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="123 Main St"
                  disabled={isFormDisabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={state.data.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="San Francisco"
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={state.data.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    placeholder="CA"
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={state.data.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    placeholder="94105"
                    disabled={isFormDisabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn (Optional)</Label>
                  <Input
                    id="linkedIn"
                    value={state.data.linkedIn || ''}
                    onChange={(e) => updateField('linkedIn', e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={state.data.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="johndoe.com"
                    disabled={isFormDisabled}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <AIEnhanceButton
                    field={AI_FIELDS.SUMMARY}
                    currentContent={state.data.summary}
                    onEnhanced={(enhancedContent) => updateField('summary', enhancedContent)}
                    disabled={isFormDisabled}
                    className="ml-2"
                  />
                </div>
                <Textarea
                  id="summary"
                  value={state.data.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  placeholder="Write a compelling summary of your professional background and key achievements..."
                  className="min-h-[120px]"
                  disabled={isFormDisabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Experience */}
        <TabsContent value="experience" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>
                    Add your professional work history, starting with your most recent position.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => addExperience({
                    id: generateId(),
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: ''
                  })}
                  size="sm"
                  disabled={isFormDisabled}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {state.data.experiences.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No work experience added yet.</p>
                  <p className="text-sm">Click "Add Experience" to get started.</p>
                </div>
              ) : (
                state.data.experiences.map((experience, index) => (
                  <Card key={experience.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExperience(experience.id)}
                          disabled={isFormDisabled}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={experience.title}
                            onChange={(e) => updateExperience(experience.id, { title: e.target.value })}
                            placeholder="Software Engineer"
                            disabled={isFormDisabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={experience.company}
                            onChange={(e) => updateExperience(experience.id, { company: e.target.value })}
                            placeholder="Tech Corp"
                            disabled={isFormDisabled}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={experience.location}
                          onChange={(e) => updateExperience(experience.id, { location: e.target.value })}
                          placeholder="San Francisco, CA"
                          disabled={isFormDisabled}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={experience.startDate}
                            onChange={(e) => updateExperience(experience.id, { startDate: e.target.value })}
                            disabled={isFormDisabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={experience.endDate}
                            onChange={(e) => updateExperience(experience.id, { endDate: e.target.value })}
                            disabled={experience.current || isFormDisabled}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={experience.current}
                          onCheckedChange={(checked) => updateExperience(experience.id, { current: checked })}
                          disabled={isFormDisabled}
                        />
                        <Label>I currently work here</Label>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Job Description</Label>
                          <AIEnhanceButton
                            field={AI_FIELDS.JOB_DESCRIPTION}
                            currentContent={experience.description}
                            onEnhanced={(enhancedContent) => updateExperience(experience.id, { description: enhancedContent })}
                            disabled={isFormDisabled}
                            className="ml-2"
                          />
                        </div>
                        <Textarea
                          value={experience.description}
                          onChange={(e) => updateExperience(experience.id, { description: e.target.value })}
                          placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Improved application performance by 40% through code optimization"
                          className="min-h-[120px]"
                          disabled={isFormDisabled}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background and qualifications.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => addEducation({
                    id: generateId(),
                    degree: '',
                    school: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    gpa: ''
                  })}
                  size="sm"
                  disabled={isFormDisabled}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {state.data.education.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No education added yet.</p>
                  <p className="text-sm">Click "Add Education" to get started.</p>
                </div>
              ) : (
                state.data.education.map((education, index) => (
                  <Card key={education.id} className="border-l-4 border-l-success">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEducation(education.id)}
                          disabled={isFormDisabled}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={education.degree}
                            onChange={(e) => updateEducation(education.id, { degree: e.target.value })}
                            placeholder="Bachelor of Science in Computer Science"
                            disabled={isFormDisabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>School</Label>
                          <Input
                            value={education.school}
                            onChange={(e) => updateEducation(education.id, { school: e.target.value })}
                            placeholder="University of California"
                            disabled={isFormDisabled}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label>Location</Label>
                           <Input
                             value={education.location}
                             onChange={(e) => updateEducation(education.id, { location: e.target.value })}
                             placeholder="Berkeley, CA"
                             disabled={isFormDisabled}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>GPA (Optional)</Label>
                           <Input
                             value={education.gpa || ''}
                             onChange={(e) => updateEducation(education.id, { gpa: e.target.value })}
                             placeholder="3.8"
                             disabled={isFormDisabled}
                           />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                           <Input
                             type="month"
                             value={education.startDate}
                             onChange={(e) => updateEducation(education.id, { startDate: e.target.value })}
                             disabled={isFormDisabled}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>End Date</Label>
                           <Input
                             type="month"
                             value={education.endDate}
                             onChange={(e) => updateEducation(education.id, { endDate: e.target.value })}
                             disabled={education.current || isFormDisabled}
                           />
                         </div>
                      </div>

                       <div className="flex items-center space-x-2">
                         <Switch
                           checked={education.current}
                           onCheckedChange={(checked) => updateEducation(education.id, { current: checked })}
                           disabled={isFormDisabled}
                         />
                         <Label>I'm currently studying here</Label>
                       </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Technologies</CardTitle>
              <CardDescription>
                Add your technical skills, programming languages, and tools you're proficient with.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., React, Python, Project Management)"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  disabled={isFormDisabled}
                />
                <Button onClick={addSkill} disabled={!newSkill.trim() || isFormDisabled}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {state.data.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => removeSkill(index)}
                  >
                    {skill}
                    <Trash2 className="h-3 w-3 ml-2" />
                  </Badge>
                ))}
              </div>

              {state.data.skills.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No skills added yet.</p>
                  <p className="text-sm">Add skills that are relevant to your target position.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications */}
        <TabsContent value="certifications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>
                    Add professional certifications and licenses.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => addCertification({
                    id: generateId(),
                    name: '',
                    issuer: '',
                    date: '',
                    credentialId: ''
                  })}
                  size="sm"
                  disabled={isFormDisabled}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {state.data.certifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No certifications added yet.</p>
                  <p className="text-sm">Add relevant professional certifications.</p>
                </div>
              ) : (
                state.data.certifications.map((certification, index) => (
                  <Card key={certification.id} className="border-l-4 border-l-warning">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Certification #{index + 1}</CardTitle>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => removeCertification(certification.id)}
                           disabled={isFormDisabled}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Certification Name</Label>
                           <Input
                             value={certification.name}
                             onChange={(e) => updateCertification(certification.id, { name: e.target.value })}
                             placeholder="AWS Certified Solutions Architect"
                             disabled={isFormDisabled}
                           />
                        </div>
                        <div className="space-y-2">
                          <Label>Issuing Organization</Label>
                           <Input
                             value={certification.issuer}
                             onChange={(e) => updateCertification(certification.id, { issuer: e.target.value })}
                             placeholder="Amazon Web Services"
                             disabled={isFormDisabled}
                           />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Issue Date</Label>
                           <Input
                             type="month"
                             value={certification.date}
                             onChange={(e) => updateCertification(certification.id, { date: e.target.value })}
                             disabled={isFormDisabled}
                           />
                        </div>
                        <div className="space-y-2">
                          <Label>Credential ID (Optional)</Label>
                           <Input
                             value={certification.credentialId || ''}
                             onChange={(e) => updateCertification(certification.id, { credentialId: e.target.value })}
                             placeholder="ABC123XYZ"
                             disabled={isFormDisabled}
                           />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages */}
        <TabsContent value="languages" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Languages</CardTitle>
                  <CardDescription>
                    Add languages you speak and your proficiency level.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => addLanguage({
                    id: generateId(),
                    name: '',
                    proficiency: 'Basic',
                    rating: 1
                  })}
                  size="sm"
                  disabled={isFormDisabled}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {state.data.languages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Languages className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No languages added yet.</p>
                  <p className="text-sm">Add languages that might be relevant for your role.</p>
                </div>
              ) : (
                state.data.languages.map((language, index) => (
                  <Card key={language.id} className="border-l-4 border-l-accent">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Language #{index + 1}</CardTitle>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => removeLanguage(language.id)}
                           disabled={isFormDisabled}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Language</Label>
                           <Input
                             value={language.name}
                             onChange={(e) => updateLanguage(language.id, { name: e.target.value })}
                             placeholder="Spanish"
                             disabled={isFormDisabled}
                           />
                        </div>
                        <div className="space-y-2">
                          <Label>Proficiency Level</Label>
                          <select
                            value={language.proficiency}
                            onChange={(e) => updateLanguage(language.id, { proficiency: e.target.value as any })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            disabled={isFormDisabled}
                          >
                            <option value="Basic">Basic</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Native">Native</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Sections */}
        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Sections</CardTitle>
                  <CardDescription>
                    Add custom sections to showcase additional information not covered by standard sections.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => addCustomSection({
                    id: generateId(),
                    heading: '',
                    content: ''
                  })}
                  size="sm"
                  disabled={isFormDisabled}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {state.data.customSections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No custom sections added yet.</p>
                  <p className="text-sm">Add custom sections like "Projects", "Volunteer Work", "Publications", etc.</p>
                </div>
              ) : (
                state.data.customSections.map((section, index) => (
                  <Card key={section.id} className="border-l-4 border-l-muted">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Custom Section #{index + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomSection(section.id)}
                          disabled={isFormDisabled}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Section Heading</Label>
                          <AIEnhanceButton
                            field={AI_FIELDS.JOB_TITLE}
                            currentContent={section.heading}
                            onEnhanced={(enhancedContent) => updateCustomSection(section.id, { heading: enhancedContent })}
                            disabled={isFormDisabled}
                            className="ml-2"
                          />
                        </div>
                        <Input
                          value={section.heading}
                          onChange={(e) => updateCustomSection(section.id, { heading: e.target.value })}
                          placeholder="e.g., Projects, Volunteer Work, Publications"
                          disabled={isFormDisabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Content</Label>
                          <AIEnhanceButton
                            field={AI_FIELDS.CUSTOM_SECTION}
                            currentContent={section.content}
                            onEnhanced={(enhancedContent) => updateCustomSection(section.id, { content: enhancedContent })}
                            disabled={isFormDisabled}
                            className="ml-2"
                          />
                        </div>
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateCustomSection(section.id, { content: e.target.value })}
                          placeholder="Add the content for this section..."
                          className="min-h-[120px]"
                          disabled={isFormDisabled}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeForm;