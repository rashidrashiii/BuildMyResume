import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePublishResume } from "@/hooks/usePublishResume";
import { ResumeData } from "@/contexts/ResumeContext";
import { Share2, RefreshCw, Globe, Lock, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { generateEncryptionKey, encryptAES } from '@/utils/export';
import { checkRateLimit, validateResumeData, SECURITY_CONFIG } from '@/utils/security';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PublishButtonProps {
  resumeData: ResumeData;
  existingId?: string;
  onPublished?: (id: string) => void;
  keyProp?: string | null;
}

export const PublishButton = ({ resumeData, existingId, onPublished, keyProp }: PublishButtonProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(false);
  const { publishResume, isPublishing, publishedId } = usePublishResume();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [shareKey, setShareKey] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  // Get key from URL fragment if republishing
  function getKeyFromFragment() {
    const hash = window.location.hash;
    const match = hash.match(/key=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  const handlePublish = async () => {
    try {
      // Pre-validation checks
      const validation = validateResumeData(resumeData);
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: `Please fix the following issues: ${validation.errors.join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      // Rate limiting check with more lenient approach
      const rateLimit = checkRateLimit('resume_publish');
      // Check if rate limiting is enabled
      if (SECURITY_CONFIG.ENABLE_RATE_LIMITING && !rateLimit.allowed) {
        const resetTime = Math.ceil((rateLimit.resetTime! - Date.now()) / 60000);
        setShowRateLimitWarning(true);
        toast({
          title: "Rate Limit Exceeded",
          description: `You can publish ${rateLimit.remaining} more resumes. Limit resets in ${resetTime} minutes.`,
          variant: "destructive",
        });
        return;
      }

      // Show remaining publishes if low
      if (rateLimit.remaining <= 10) {
        toast({
          title: "Rate Limit Warning",
          description: `You have ${rateLimit.remaining} resume publications remaining in this time window.`,
        });
      }

      let key = keyProp || getKeyFromFragment();
      if (!key) {
        key = generateEncryptionKey();
      }
      setShareKey(key);
      const encrypted = encryptAES(JSON.stringify(resumeData), key);
      
      // Use user's name for title if available
      const title = resumeData.firstName && resumeData.lastName
        ? `${resumeData.firstName} ${resumeData.lastName} Resume`
        : 'Resume';
      
      const result = await publishResume(encrypted, key, title, existingId);
      if (result) {
        const action = existingId ? 'updated' : 'published';
        toast({
          title: `Resume ${action} successfully!`,
          description: `Your resume has been ${action} and is now editable anytime.`,
        });
        setShowConfirmation(false);
        setShowShareLink(true);
        onPublished?.(result.id);
        // Format: /view/[id]#key=...
        const url = `${window.location.origin}/view/${result.id}#key=${encodeURIComponent(key)}`;
        setShareUrl(url);
      }
    } catch (error) {
      // Enhanced error handling
      let errorMessage = "Failed to publish resume";
      
      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (error.message.includes('validation')) {
          errorMessage = error.message;
        } else if (error.message.includes('too large')) {
          errorMessage = "Resume data is too large. Please reduce the content size.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "The share link has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setShowConfirmation(true)}
        disabled={isPublishing}
        className={`flex items-center justify-center shadow-elegant sm:w-auto min-h-[44px]${isMobile ? ' h-10 w-10 min-w-10 min-h-10' : ''}`}
        variant={isMobile ? "default" : (existingId ? "outline" : "default")}
        size={isMobile ? "icon" : undefined}
        aria-label={isMobile ? (isPublishing ? (existingId ? 'Re-publishing Resume' : 'Publishing Resume') : (existingId ? 'Re-publish Resume' : 'Publish Resume')) : undefined}
      >
        {isPublishing ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {!isMobile && (
          <span className="ml-2">
            {isPublishing ? (existingId ? 'Re-publishing...' : 'Publishing...') : (existingId ? 'Re-publish' : 'Publish')}
          </span>
        )}
      </Button>

      {/* Rate Limit Warning Dialog */}
      <Dialog open={showRateLimitWarning} onOpenChange={setShowRateLimitWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Rate Limit Exceeded
            </DialogTitle>
            <DialogDescription>
              You've reached the maximum number of resume publications allowed in this time window. 
              This helps protect our service from abuse while allowing legitimate users to create resumes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Limits:</strong> 100 resume publications per 15 minutes
                <br />
                <strong>For testing:</strong> You can reset rate limits using the Security Monitor
              </AlertDescription>
            </Alert>
            <div className="text-sm text-muted-foreground">
              <p>• Rate limits reset automatically every 15 minutes</p>
              <p>• This protects our service from DDoS attacks</p>
              <p>• Most users never reach these limits</p>
              <p>• Contact support if you need higher limits</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {existingId ? 'Update Published Resume' : 'Publish Resume'}
            </DialogTitle>
            <DialogDescription>
              {existingId 
                ? 'This will update your published resume with the current changes.'
                : 'This will create a shareable link to your resume that you can edit anytime.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Your resume data is encrypted and secure. Only you can access it with the unique key.
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-muted-foreground">
              <p>• Your resume will be encrypted before storage</p>
              <p>• You'll receive a unique, shareable link</p>
              <p>• You can edit your resume anytime using the link</p>
              <p>• Anonymous resumes are automatically cleaned up after 30 days</p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  {existingId ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                existingId ? 'Update Resume' : 'Publish Resume'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Link Dialog */}
      <Dialog open={showShareLink} onOpenChange={setShowShareLink}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Resume Published Successfully!
            </DialogTitle>
            <DialogDescription>
              Your resume has been published and is now accessible via the link below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Share Link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 text-sm bg-background border rounded"
                />
                <Button onClick={copyToClipboard} size="sm">
                  Copy
                </Button>
              </div>
            </div>
            
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Save this link and key securely. You'll need them to edit your resume later.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};