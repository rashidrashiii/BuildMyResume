import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, ArrowLeft, Download, Eye, ZoomIn, ZoomOut, Maximize2, Settings, ChevronDown, ChevronRight, Palette, Edit3, Save, AlertTriangle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppNavigation } from "@/components/AppNavigation";
import { templates } from "@/templates";
import { templateConfigs } from "@/templates/config";
import ExportButtons from "@/components/ExportButtons";
import { PublishButton } from "@/components/PublishButton";
import ResumeForm from "@/components/ResumeForm";
import TemplateSelector from "@/components/TemplateSelector";
import { useResume } from "@/contexts/ResumeContext";
import { useToast } from "@/hooks/use-toast";
import { useReactToPrint } from "react-to-print";
import FullScreenLoader from "@/components/FullScreenLoader";
import { securePdfExport } from "@/utils/secureExport";
import { useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { ResumePreview } from "@/components/ResumePreview";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PublishedResumeService } from "@/services/publishedResume";
import { decryptAES, encryptAES } from '@/utils/export';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import sampleData from "@/data/sample.json";
  const restoreCaretPosition = (element: Element, position: number) => {
  let charIndex = 0;
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

        let node: Node | null;
      while ((node = walker.nextNode())) {
    const nextCharIndex = charIndex + node.textContent.length;
    if (position <= nextCharIndex) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(node, position - charIndex);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      break;
    }
    charIndex = nextCharIndex;
  }
};

// Utility function to estimate A4 pages
  const estimateA4PagesFromFullHtml = (htmlString: string) => {
  const A4_HEIGHT_PX = 1123; // 11.69in * 96dpi

  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '794px'; // A4 width
    iframe.style.height = 'auto';
    iframe.style.visibility = 'hidden';

    document.body.appendChild(iframe);

    iframe.onload = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) throw new Error("Failed to access iframe document");

        const totalHeight = iframeDoc.body.scrollHeight;
        document.body.removeChild(iframe);

        const pageCount = Math.ceil(totalHeight / A4_HEIGHT_PX);
        resolve(pageCount);
      } catch (err) {
        reject(err);
      }
    };

    iframe.srcdoc = htmlString;
  });
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState("edit");
  const [zoom, setZoom] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTemplatesSectionOpen, setIsTemplatesSectionOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [showShareLink, setShowShareLink] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isFormattingModeEnabled, setIsFormattingModeEnabled] = useState(false);
  const [showFormatConfirm, setShowFormatConfirm] = useState(false);

  const baseWidth = 794; // A4 width in pixels
  const baseHeight = 1123; // A4 height in pixels
  const { state, setTemplate, dispatch, loadData, setPreviewEditing, getPreviewData, setUserStartedEditing } = useResume();
  const [searchParams] = useSearchParams();
  const resumeRef = useRef(null);
  const editableRef = useRef(null);
  const toast = useToast();
  const [secureExportLoading, setSecureExportLoading] = useState(false);
  const secureExportRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const lastCaretPositionRef = useRef(null);


  const [isUserEditing, setIsUserEditing] = useState(false);
  const [lastUserInteraction, setLastUserInteraction] = useState(0);
  const userEditingTimeoutRef = useRef(null);

  const TemplateComponent = templates[state.data.selectedTemplate] || templates["modern-clean"];

  // Helper function to check if form has any data
  const hasFormData = () => {
    return !!(state.data.firstName || state.data.lastName || state.data.email || 
              state.data.phone || state.data.summary || state.data.experiences.length > 0 || 
              state.data.education.length > 0 || state.data.skills.length > 0);
  };

  // Helper function to get data for preview
  const getPreviewDataForEditor = () => {
    if (hasFormData()) {
      return state.data;
    }
    // Return sample data if form is empty, with proper type casting
    return {
      ...state.data,
      ...sampleData,
      languages: sampleData.languages.map(lang => ({
        ...lang,
        proficiency: lang.proficiency as "Native" | "Conversational" | "Basic" | "Fluent"
      }))
    };
  };

  // Memoized preview data to prevent unnecessary re-renders
  const memoizedPreviewData = useMemo(() => {
    return { ...getPreviewDataForEditor(), editedHtml: state.editedHtml };
  }, [state.data, state.editedHtml]);

  // Helper to get key from fragment
  function getKeyFromFragment() {
    const hash = window.location.hash;
    const match = hash.match(/key=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  // If editing a published resume, load it
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchResume = async () => {
      try {
        const result = await PublishedResumeService.getPublishedResume(id);
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setPublishedId(result.data.id);
          // Decrypt
          const key = getKeyFromFragment();
          setKey(key);
          if (!key) {
            setError("Invalid or missing key. Unable to edit resume.");
            return;
          }
          try {
            const decrypted = decryptAES(result.data.resume_data, key);
            const resumeData = JSON.parse(decrypted);
            loadData(resumeData);
            // Mark that user has started editing since this is their existing data
            setUserStartedEditing();
          } catch (e) {
            setError("Invalid or missing key. Unable to edit resume.");
          }
        }
      } catch (err) {
        setError("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
    // Listen for hash changes (user pastes key)
    window.addEventListener('hashchange', fetchResume);
    return () => window.removeEventListener('hashchange', fetchResume);
  }, [id, loadData, setUserStartedEditing]);

  // Handle template selection from URL parameters
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam) {
      // Verify the template exists in our config
      const templateExists = templateConfigs.find(t => t.id === templateParam);
      if (templateExists) {
        setTemplate(templateParam);
        // Mark that user has started editing since they're making template choices
        setUserStartedEditing();
      }
    }
  }, [searchParams, setTemplate, setUserStartedEditing]);

  // Save handler for published resumes
  const handleSavePublished = async () => {
    if (!key || !publishedId) {
      toast.toast({
        title: 'Error',
        description: 'Missing encryption key or resume ID.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const encrypted = encryptAES(JSON.stringify(state.data), key);
      // Use user's name for title if available
      const title = state.data.firstName && state.data.lastName
        ? `${state.data.firstName} ${state.data.lastName} Resume`
        : 'Resume';
      const result = await PublishedResumeService.publishResume(
        encrypted,
        title,
        publishedId
      );
      if (result.error) {
        throw new Error(result.error);
      }
      toast.toast({
        title: 'Resume saved!',
        description: 'Your changes have been saved successfully.',
      });
      // Show share link modal
      const url = `${window.location.origin}/view/${publishedId}#key=${encodeURIComponent(key)}`;
      setShareUrl(url);
      setShowShareLink(true);
    } catch (error) {
      toast.toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save resume',
        variant: 'destructive',
      });
    }
  };

  // Calculate page count whenever content changes
  useEffect(() => {
    const calculatePages = async () => {
      if (secureExportRef.current) {
        try {
          const htmlString = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: system-ui, -apple-system, sans-serif; 
                  font-size: 14px; 
                  line-height: 1.5; 
                  color: #000; 
                  width: 794px;
                  margin: 0;
                  padding: 0;
                }
                .page-break { page-break-before: always; }
              </style>
            </head>
            <body>${secureExportRef.current.innerHTML}</body>
            </html>
          `;
          const pages = await estimateA4PagesFromFullHtml(htmlString);
          setPageCount(pages as number);
        } catch (error) {
          setPageCount(1);
        }
      }
    };

    calculatePages();
  }, [state.data, editableContent]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fitToWidth = (containerWidth: number) => {
    const padding = 40;
    const availableWidth = containerWidth - padding;
    const newZoom = Math.min(availableWidth / baseWidth, 1);
    setZoom(newZoom);
  };

  const handleFormatClick = () => {
    if (isEditing) {
      // Save changes and exit edit mode
      // Get content from any editable element that has content
      const editableElements = document.querySelectorAll('.editable-resume-content');
      let newHtml = '';

      if (editableElements.length > 0) {
        // Find the element with the most content (usually the first one)
        let mostContentElement = editableElements[0];
        for (const element of editableElements) {
          if (element.innerHTML.length > mostContentElement.innerHTML.length) {
            mostContentElement = element;
          }
        }
        newHtml = mostContentElement.innerHTML;
      }

      if (newHtml) {
        // Update the resume context with edited content
        if (dispatch) {
          dispatch({
            type: 'UPDATE_EDITED_CONTENT',
            payload: { editedHtml: newHtml }
          });
        }

        toast.toast({
          title: "Changes Saved",
          description: "Your formatting changes have been applied to the resume.",
        });
      }

      // Disable preview editing mode
      setPreviewEditing(false);
      setIsEditing(false);
    } else {
      // Check if formatting mode is already enabled
      if (isFormattingModeEnabled) {
        // If already in formatting mode, just enter edit mode
        requestAnimationFrame(() => {
          const newEditableContent = state.editedHtml || (secureExportRef.current ? secureExportRef.current.innerHTML : '');
          
          // Set all states at once to prevent multiple re-renders
          setEditableContent(newEditableContent);
          setPreviewEditing(true);
          setIsEditing(true);
        });
      } else {
        // Show confirmation dialog first
        setShowFormatConfirm(true);
      }
    }
  };

  const handleConfirmFormatting = () => {
    // Enable formatting mode
    setIsFormattingModeEnabled(true);
    setShowFormatConfirm(false);

    // Show toast with instructions and YouTube link
    toast.toast({
      title: "Edit Mode Enabled",
      description: (
        <div className="space-y-2">
          <p>You can now edit your resume directly in the preview! Click on any text to edit it, press Enter for line breaks, and use Ctrl+Z to undo changes.</p>
          <a
            href="https://www.youtube.com/watch?v=Q_FjVnEu6Es&t=42s"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            📺 Watch editing tutorial
          </a>
        </div>
      ),
      duration: 8000,
    });

    // Use requestAnimationFrame to batch state changes after modal animation
    requestAnimationFrame(() => {
      const newEditableContent = state.editedHtml || (secureExportRef.current ? secureExportRef.current.innerHTML : '');
      
      // Set all states at once to prevent multiple re-renders
      setEditableContent(newEditableContent);
      setPreviewEditing(true);
      setIsEditing(true);
    });
  };

  const exportToPDF = async () => {
    try {
      setSecureExportLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use edited content if available, otherwise use the original template content
      let htmlToExport;
      if (editableContent) {
        htmlToExport = editableContent;
      } else if (secureExportRef.current) {
        htmlToExport = secureExportRef.current.innerHTML;
      } else {
        throw new Error("Resume content not ready.");
      }

      // Pass the HTML directly to securePdfExport
      await securePdfExport(htmlToExport);
      toast.toast({ title: "PDF Exported", description: "Your secure PDF is ready." });
    } catch (error) {
      toast.toast({
        title: "Export Failed",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSecureExportLoading(false);
    }
  };

  const exportToDocx = async () => {
    toast.toast({
      title: "Feature Coming Soon",
      description: "DOCX export will be available in the next update.",
      variant: "destructive",
    });
  };

  const exportToJSON = () => {
    try {
      // Use user's actual data for export, not preview data
      const dataStr = JSON.stringify(state.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${state.data.firstName || 'resume'}_${state.data.lastName || 'data'}_resume_data.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.toast({
        title: "Data Exported",
        description: "Your resume data has been saved as JSON.",
      });
    } catch (error) {
      toast.toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Ensure focus is restored when entering edit mode
  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
    }
  }, [isEditing]);

  // Restore caret position after content/state update
  useEffect(() => {
    if (isEditing && editableRef.current && lastCaretPositionRef.current !== null) {
      restoreCaretPosition(editableRef.current, lastCaretPositionRef.current);
    }
  }, [editableContent, isEditing]);

  // Reset editableContent when the template changes to prevent stale HTML in formatting mode
  useEffect(() => {
    if (isFormattingModeEnabled || isEditing) {
      setTimeout(() => {
        if (state.editedHtml) {
          setEditableContent(state.editedHtml);
        } else if (secureExportRef.current) {
          setEditableContent(secureExportRef.current.innerHTML);
        } else {
          setEditableContent("");
        }
      }, 100);
    }
    setIsEditing(false);
    setIsFormattingModeEnabled(false);
  }, [state.data.selectedTemplate]);

  // 1. Add state for the dialog
  const [showFormEditConfirm, setShowFormEditConfirm] = useState(false);

  // 2. Add handler for switching to form editing
  const handleSwitchToFormEdit = () => {
    // Clear formatting mode and edited HTML
    setIsFormattingModeEnabled(false);
    setIsEditing(false);
    setPreviewEditing(false);
    setShowFormEditConfirm(false);
    if (dispatch) {
      dispatch({ type: 'UPDATE_EDITED_CONTENT', payload: { editedHtml: undefined } });
    }
  };

  if (id && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (id && (error || !publishedId)) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation
          showBackButton={true}
          breadcrumb="Resume Editor"
        />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-100 border border-red-200 text-red-800 rounded-lg p-4">
            {error || "Resume not found"}
          </div>
          <div className="mt-8 text-center">
            <Link to="/editor">
              <Button>
                Create New Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hidden resume component for secure export */}
      <div
        key={state.data.selectedTemplate} // force re-render on template change
        style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: `${baseWidth}px`, height: 'auto', overflow: 'visible', zIndex: -1 }}
      >
        <div ref={secureExportRef} style={{ width: `${baseWidth}px`, height: 'auto', backgroundColor: 'white', padding: '20px', margin: '0', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px', lineHeight: '1.5', color: '#000', overflow: 'visible' }}>
          {isEditing && editableContent ? (
            <div dangerouslySetInnerHTML={{ __html: editableContent }} />
          ) : state.editedHtml ? (
            <div dangerouslySetInnerHTML={{ __html: state.editedHtml }} />
          ) : (
            <TemplateComponent data={getPreviewDataForEditor()} />
          )}
        </div>
      </div>

      {secureExportLoading && <FullScreenLoader message="Exporting your resume as PDF..." />}

      {/* Hidden resume component for printing */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: `${baseWidth}px`,
          height: 'auto',
          overflow: 'visible',
          zIndex: -1,
        }}
      >
        <div
          ref={resumeRef}
          style={{
            width: `${baseWidth}px`,
            height: 'auto',
            backgroundColor: 'white',
            padding: '20px',
            margin: '0',
            boxSizing: 'border-box',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#000',
            overflow: 'visible',
          }}
        >
          {isEditing && editableContent ? (
            <div dangerouslySetInnerHTML={{ __html: editableContent }} />
          ) : state.editedHtml ? (
            <div dangerouslySetInnerHTML={{ __html: state.editedHtml }} />
          ) : (
            <TemplateComponent data={getPreviewDataForEditor()} />
          )}
        </div>
      </div>

      {/* Navigation */}
      <AppNavigation
        actions={
          id ? (
            <>
              <ExportButtons exportToPDF={exportToPDF} exportToDocx={exportToDocx} exportToJSON={exportToJSON} />
              <Button
                onClick={handleSavePublished}
                className=" px-4 py-2 text-sm font-medium shadow-elegant"
              >
                <Save className="h-4 w-4 mr-2" />
                <span className="inline">Save</span>
              </Button>
              <Dialog open={showShareLink} onOpenChange={setShowShareLink}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Resume</DialogTitle>
                    <DialogDescription>
                      Your resume is now live! Save this link to edit your resume later:
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-xs sm:text-sm bg-muted rounded-md border font-mono break-all"
                    />
                    <Button
                      onClick={() => { navigator.clipboard.writeText(shareUrl); toast.toast({ title: 'Link copied!', description: 'The share link has been copied to your clipboard.' }); }}
                      variant="outline"
                      size="sm"
                      className="shrink-0 min-h-[36px] px-4 py-2 text-sm font-medium"
                    >
                      Copy
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex flex-row items-center gap-2">
              <ExportButtons exportToPDF={exportToPDF} exportToDocx={exportToDocx} exportToJSON={exportToJSON} />
              <PublishButton resumeData={state.data} />
            </div>
          )
        }
      />

      {/* Mobile Layout */}
      {isMobile ? (
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 my-4">
              <TabsTrigger value="edit" className="flex items-center space-x-2">
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="template" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Template</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-0">
              <div className="py-4">
                {!hasFormData() && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 text-sm">💡</span>
                      <div className="text-sm text-blue-800">
                        <strong>Tip:</strong> The preview shows example data. Start typing to see your own information!
                      </div>
                    </div>
                  </div>
                )}
                {isFormattingModeEnabled && (
                  <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-orange-800 mb-1">
                          Edit Mode Active
                        </h4>
                        <p className="text-sm text-orange-700">
                          The form is now disabled. All further changes must be made in the preview.
                        </p>
                        <div className="mt-2">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600 underline p-0 h-auto min-h-0"
                            onClick={() => setShowFormEditConfirm(true)}
                          >
                            Switch back to form editing
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <ResumeForm disabled={isFormattingModeEnabled} />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="py-4">
                <ResumePreview
                  data={memoizedPreviewData}
                  TemplateComponent={TemplateComponent}
                  isEditing={isEditing}
                  editableContent={editableContent}
                  setEditableContent={setEditableContent}
                  zoom={zoom}
                  setZoom={setZoom}
                  pageCount={pageCount}
                  setPageCount={setPageCount}
                  showZoomControls={true}
                  containerClassName=""
                  secureExportRef={secureExportRef}
                  rightControls={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          size="sm"
                          onClick={handleFormatClick}
                          className="h-8 px-3 text-xs font-medium ml-2"
                        >
                          {isEditing ? (
                            <>
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </>
                          ) : (
                            <>
                              <Edit3 className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Edit in Preview</span>
                              <span className="sm:hidden">Edit</span>
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit your resume directly in the preview. Click on text to edit, press Enter for line breaks, and use Ctrl+Z to undo.</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="template" className="mt-0">
              <TemplateSelector />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        /* Desktop Layout */
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - Form */}
          <div className="w-1/2 border-r bg-muted/20">
            <div className="h-full overflow-y-auto">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Build Your Resume</h2>
                  <p className="text-muted-foreground">
                    Fill in your information below and see your resume update in real-time.
                  </p>
                  {!hasFormData() && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 text-sm">💡</span>
                        <div className="text-sm text-blue-800">
                          <strong>Tip:</strong> The preview shows example data. Start typing in any field to see your own information appear!
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Collapsible Template Selector - Desktop Only */}
                <Collapsible open={isTemplatesSectionOpen} onOpenChange={setIsTemplatesSectionOpen} className="mb-8">
                  <div className="border rounded-lg bg-card overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50 rounded-none"
                        type="button"
                      >
                        <div className="flex items-center space-x-3">
                          <Palette className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-semibold">Template</div>
                            <div className="text-sm text-muted-foreground">
                              {templateConfigs.find(t => t.id === state.data.selectedTemplate)?.name || "Modern Professional"}
                            </div>
                          </div>
                        </div>
                        {isTemplatesSectionOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div>
                        <TemplateSelector />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                {/* Formatting Mode Warning */}
                {isFormattingModeEnabled && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-orange-800 mb-1">
                          Edit Mode Active
                        </h4>
                        <p className="text-sm text-orange-700">
                          The form is now disabled. All further changes must be made in the preview.
                        </p>
                        <div className="mt-2">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600 underline p-0 h-auto min-h-0"
                            onClick={() => setShowFormEditConfirm(true)}
                          >
                            Switch back to form editing
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resume Form */}
                <ResumeForm disabled={isFormattingModeEnabled} />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 bg-background">
            <div className="h-full overflow-y-auto">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Live Preview</h2>
                    <p className="text-muted-foreground">
                      {isEditing ? "Edit your resume directly" : "See how your resume looks as you type."}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={exportToPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToDocx}>
                      <Download className="h-4 w-4 mr-2" />
                      DOCX
                    </Button>
                  </div>
                </div>

                <ResumePreview
                  data={memoizedPreviewData}
                  TemplateComponent={TemplateComponent}
                  isEditing={isEditing}
                  editableContent={editableContent}
                  setEditableContent={setEditableContent}
                  zoom={zoom}
                  setZoom={setZoom}
                  pageCount={pageCount}
                  setPageCount={setPageCount}
                  showZoomControls={true}
                  containerClassName="flex-1"
                  secureExportRef={secureExportRef}
                  rightControls={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          size="sm"
                          onClick={handleFormatClick}
                          className="h-8 px-3 text-xs font-medium ml-2"
                        >
                          {isEditing ? (
                            <>
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </>
                          ) : (
                            <>
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit in Preview
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit your resume directly in the preview. Click on text to edit, press Enter for line breaks, and use Ctrl+Z to undo.</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Format Confirmation Dialog */}
      <AlertDialog open={showFormatConfirm} onOpenChange={setShowFormatConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              Edit Resume in Preview
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Switch to direct editing mode where you can format and edit your resume right in the preview
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Edit3 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Direct Editing</h4>
                  <p className="text-xs text-muted-foreground">Click and edit text directly in the preview</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0 text-center text-xs font-bold">↵</span>
                <div>
                  <h4 className="font-medium text-sm">Line Breaks</h4>
                  <p className="text-xs text-muted-foreground">Press Enter to add line breaks and spacing</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0 text-center text-xs font-bold">⌘Z</span>
                <div>
                  <h4 className="font-medium text-sm">Undo/Redo</h4>
                  <p className="text-xs text-muted-foreground">Use Ctrl+Z and Ctrl+Y to undo/redo changes</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 text-sm">⚠️</span>
                <div className="text-xs text-amber-800">
                  <strong>Note:</strong> Once you start formatting, the form will be disabled and you can only make changes in the preview.
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFormatting} className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Start Editing in Preview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add the confirmation dialog at the bottom (like the format dialog) */}
      <AlertDialog open={showFormEditConfirm} onOpenChange={setShowFormEditConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to Form Editing?</AlertDialogTitle>
            <AlertDialogDescription>
              If you switch to form editing, any changes made in formatting mode will be lost. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSwitchToFormEdit}>
              Yes, Edit Using Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Editor;