import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Check, X } from 'lucide-react';
import AIEnhanceButton from './AIEnhanceButton';
import { AI_FIELDS } from '@/services/ai';

const AIDemo = () => {
  const [summary, setSummary] = useState('Experienced developer with 5 years of experience in web development. I have worked with React and Node.js. I am good at problem solving and team work.');
  const [jobDescription, setJobDescription] = useState('Developed web applications using React. Worked with team members to deliver projects. Fixed bugs and improved performance.');
  const [skills, setSkills] = useState('JavaScript, React, Node.js');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Enhancement Demo
          </CardTitle>
          <CardDescription>
            See how AI can enhance your resume content to be more professional and ATS-friendly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Professional Summary Demo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Professional Summary</h3>
              <AIEnhanceButton
                field={AI_FIELDS.SUMMARY}
                currentContent={summary}
                onEnhanced={setSummary}
                className="ml-2"
              />
            </div>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter your professional summary..."
              className="min-h-[100px]"
            />
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">ATS-Optimized</Badge>
              <Badge variant="outline" className="mr-2">Action Verbs</Badge>
              <Badge variant="outline">Professional Tone</Badge>
            </div>
          </div>

          {/* Job Description Demo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Job Description</h3>
              <AIEnhanceButton
                field={AI_FIELDS.JOB_DESCRIPTION}
                currentContent={jobDescription}
                onEnhanced={setJobDescription}
                className="ml-2"
              />
            </div>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter your job description..."
              className="min-h-[100px]"
            />
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">Bullet Points</Badge>
              <Badge variant="outline" className="mr-2">Quantified Results</Badge>
              <Badge variant="outline">Industry Keywords</Badge>
            </div>
          </div>

          {/* Skills Demo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Skills</h3>
              <AIEnhanceButton
                field={AI_FIELDS.SKILLS}
                currentContent={skills}
                onEnhanced={(enhancedContent) => setSkills(enhancedContent)}
                className="ml-2"
              />
            </div>
            <Textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Enter your skills..."
              className="min-h-[60px]"
            />
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">Technical Skills</Badge>
              <Badge variant="outline" className="mr-2">Soft Skills</Badge>
              <Badge variant="outline">Industry Keywords</Badge>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Enter your content in any field above</li>
              <li>2. Click the "Enhance" button with the sparkles icon</li>
              <li>3. AI will process your content and provide an improved version</li>
              <li>4. Review the enhancement and accept or reject it</li>
              <li>5. Your content will be updated with the enhanced version</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDemo;
