import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const DesignSystemDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Modern Design System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enhanced UI components with modern styling, smooth animations, and improved accessibility
          </p>
        </div>

        {/* Buttons Section */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Button Components
            </CardTitle>
            <CardDescription>
              Modern buttons with gradients, shadows, and smooth hover animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">Sizes</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">With Icons</h4>
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Components Section */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Form Components
            </CardTitle>
            <CardDescription>
              Enhanced input fields with better focus states and smooth transitions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Text Input</label>
                  <Input className="input-modern" placeholder="Enter your name" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Textarea</label>
                  <Textarea className="input-modern" placeholder="Enter your description" rows={3} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Select Option</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Badges</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Feature Card</CardTitle>
              <CardDescription>Modern card with enhanced styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card demonstrates the new modern styling with rounded corners, enhanced shadows, and smooth hover effects.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Hover to see the enhanced effects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notice the subtle shadow changes and border color transitions when you hover over this card.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription>Beautiful gradient backgrounds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-lg">
                <p className="text-sm">
                  Cards can also contain gradient elements for visual appeal.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog Section */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              Dialog Component
            </CardTitle>
            <CardDescription>
              Modern modal dialogs with backdrop blur and enhanced styling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Modern Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modern Dialog Design</DialogTitle>
                  <DialogDescription>
                    This dialog showcases the enhanced styling with rounded corners, better shadows, and improved close button.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The dialog now features:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Rounded corners (2xl)</li>
                    <li>• Enhanced shadows</li>
                    <li>• Backdrop blur effect</li>
                    <li>• Smooth animations</li>
                    <li>• Better focus states</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Color Palette Section */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Enhanced Color Palette
            </CardTitle>
            <CardDescription>
              Comprehensive blue color variants for flexible design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="text-center">
                  <div 
                    className={`w-full h-16 rounded-lg mb-2 bg-primary-${shade} border border-border`}
                  />
                  <span className="text-xs font-mono text-muted-foreground">
                    {shade}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              The enhanced color palette provides 10 shades (50-900) for comprehensive design flexibility.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            All components maintain full responsiveness and accessibility while providing a modern, professional appearance.
          </p>
        </div>
      </div>
    </div>
  );
};
