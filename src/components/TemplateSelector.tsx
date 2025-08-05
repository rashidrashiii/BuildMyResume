import { useResume } from "@/contexts/ResumeContext";
import { templateConfigs } from "@/templates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TemplateSelector = () => {
  const { state, setTemplate } = useResume();
  const selectedTemplate = state.data.selectedTemplate;
  const navigate = useNavigate();

  const handleTemplateSelect = (templateId: string) => {
    setTemplate(templateId);
  };

  // Show all templates in a scrollable container
  const templatesToShow = templateConfigs;

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader>
        <CardTitle>Choose Template</CardTitle>
        <CardDescription>
          Select a professional template for your resume. You can change this anytime.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <RadioGroup value={selectedTemplate} onValueChange={handleTemplateSelect} className="flex-1 flex flex-col">
          <div className="flex-1 min-h-[60vh] sm:min-h-0 max-h-[calc(100vh-12rem)] sm:max-h-96 overflow-y-auto pr-2">
            <div className="m-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {templatesToShow.map((template) => (
              <div key={template.id} className="relative">
                <Label
                  htmlFor={template.id}
                  className="cursor-pointer block"
                >
                  <Card className={`overflow-hidden transition-all duration-200 hover:shadow-float ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-primary shadow-elegant' 
                      : 'hover:shadow-card'
                  }`}>
                    <div className="relative">
                      <img
                        src={template.previewImage}
                        alt={`${template.name} preview`}
                        className="w-full h-32 object-cover"
                      />
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        {template.description}
                      </p>
                    </CardContent>
                  </Card>
                </Label>
                <RadioGroupItem
                  value={template.id}
                  id={template.id}
                  className="sr-only"
                />
              </div>
              ))}
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;