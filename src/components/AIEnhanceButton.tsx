import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Check, X, Undo2, AlertCircle } from 'lucide-react';
import { enhanceContentWithAI, AIField } from '@/services/ai';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface AIEnhanceButtonProps {
  field: AIField;
  currentContent: string;
  onEnhanced: (enhancedContent: string) => void;
  context?: any;
  disabled?: boolean;
  className?: string;
}

const AIEnhanceButton = ({
  field,
  currentContent,
  onEnhanced,
  context,
  disabled = false,
  className = ''
}: AIEnhanceButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [rejectedResponses, setRejectedResponses] = useState<string[]>([]);
  const [currentEnhancedContent, setCurrentEnhancedContent] = useState('');
  
  const { state, incrementEnhancementCount } = useResume();
  const enhancementCount = state.enhancementCounts[field] || 0;
  const MAX_ENHANCEMENTS = 5;
  const isMobile = useIsMobile();

      const handleEnhance = async () => {
      if (!currentContent.trim()) {
        toast.error('Please enter some content first');
        return;
      }

      if (enhancementCount >= MAX_ENHANCEMENTS) {
        toast.error(`You've reached the maximum limit of ${MAX_ENHANCEMENTS} enhancements for this field. Create a new resume to enhance again.`);
        return;
      }

      setIsLoading(true);
      setOriginalContent(currentContent); // Store original content
      
      // Increment enhancement count BEFORE making the API call
      incrementEnhancementCount(field);
      
      try {
        const result = await enhanceContentWithAI(field, currentContent, context, rejectedResponses);
        
        // Store the enhanced content for potential rejection
        setCurrentEnhancedContent(result.enhancedContent);
        
        // Immediately replace the content with enhanced version
        onEnhanced(result.enhancedContent);
        
        // Show accept/reject buttons
        setShowConfirm(true);
        
        const remainingEnhancements = MAX_ENHANCEMENTS - enhancementCount - 1;
        if (remainingEnhancements > 0) {
          toast.success(`Content enhanced! Review and accept or reject. (${remainingEnhancements} enhancements remaining)`);
        } else {
          toast.success('Content enhanced! Review and accept or reject. (Last enhancement)');
        }
      } catch (error: any) {
        console.error('AI enhancement failed:', error);
        
        // Calculate remaining enhancements
        const remainingEnhancements = MAX_ENHANCEMENTS - enhancementCount - 1;
        
        // Handle validation errors specifically and include remaining count in the same message
        if (error.message && error.message.includes('Content too short')) {
          if (remainingEnhancements > 0) {
            toast.error(`${error.message} (${remainingEnhancements} enhancements remaining)`);
          } else {
            toast.error(`${error.message} (No more enhancements available)`);
          }
        } else if (error.message && error.message.includes('Content too long')) {
          if (remainingEnhancements > 0) {
            toast.error(`${error.message} (${remainingEnhancements} enhancements remaining)`);
          } else {
            toast.error(`${error.message} (No more enhancements available)`);
          }
        } else if (error.message && error.message.includes('Please enter your actual')) {
          if (remainingEnhancements > 0) {
            toast.error(`${error.message} (${remainingEnhancements} enhancements remaining)`);
          } else {
            toast.error(`${error.message} (No more enhancements available)`);
          }
        } else if (error.message && error.message.includes('does not appear to be')) {
          if (remainingEnhancements > 0) {
            toast.error(`${error.message} (${remainingEnhancements} enhancements remaining)`);
          } else {
            toast.error(`${error.message} (No more enhancements available)`);
          }
        } else {
          if (remainingEnhancements > 0) {
            toast.error(`Failed to enhance content. Please try again. (${remainingEnhancements} enhancements remaining)`);
          } else {
            toast.error('Failed to enhance content. Please try again. (No more enhancements available)');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

  const handleAccept = () => {
    setShowConfirm(false);
    setRejectedResponses([]); // Clear rejected responses on accept
    setCurrentEnhancedContent('');
    toast.success('Enhanced content applied!');
  };

  const handleReject = () => {
    // Add the rejected response to the list
    setRejectedResponses(prev => [...prev, currentEnhancedContent]);
    
    // Restore original content
    onEnhanced(originalContent);
    setShowConfirm(false);
    setCurrentEnhancedContent('');
    
    const remainingEnhancements = MAX_ENHANCEMENTS - enhancementCount;
    if (remainingEnhancements > 0) {
      toast.info(`Original content restored. Try enhancing again for a different result. (${remainingEnhancements} enhancements remaining)`);
    } else {
      toast.info('Original content restored. No more enhancements available for this field.');
    }
  };

  // Show limit reached state
  if (enhancementCount >= MAX_ENHANCEMENTS) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className={`${className} text-gray-500 cursor-not-allowed`}
      >
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>Limit Reached</span>
      </Button>
    );
  }

  if (showConfirm) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAccept}
          className="text-green-600 hover:text-green-700"
          title="Accept enhanced content"
        >
          <Check className="h-4 w-4" />
          {!isMobile && <span className="ml-1">Accept</span>}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReject}
          className="text-red-600 hover:text-red-700"
          title="Reject and restore original content"
        >
          <Undo2 className="h-4 w-4" />
          {!isMobile && <span className="ml-1">Reject</span>}
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleEnhance}
      disabled={disabled || isLoading || !currentContent.trim()}
      className={`${className} hover:bg-blue-50 hover:text-blue-600`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      <span className="ml-1">Enhance</span>
    </Button>
  );
};

export default AIEnhanceButton;
