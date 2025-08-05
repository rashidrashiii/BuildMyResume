import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, ArrowLeft, Edit, AlertCircle } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { PublishedResumeService, PublishedResume } from "@/services/publishedResume";
import { templates } from "@/templates";
import { useReactToPrint } from "react-to-print";
import { useToast } from "@/hooks/use-toast";
import { decryptAES } from '@/utils/export';
import {ResumePreview} from "@/components/ResumePreview";
import { estimateA4PagesFromFullHtml } from "@/utils/findPages";
import ExportButtons from "@/components/ExportButtons";
import { securePdfExport } from "@/utils/secureExport";
import FullScreenLoader from "@/components/FullScreenLoader";

const ViewResume = () => {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<PublishedResume | null>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [zoom, setZoom] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const secureExportRef = useRef<HTMLDivElement>(null);
  const [secureExportLoading, setSecureExportLoading] = useState(false);

  // Helper to get key from fragment
  function getKeyFromFragment() {
    const hash = window.location.hash;
    const match = hash.match(/key=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) {
        setError("Resume ID not provided");
        setLoading(false);
        return;
      }
      try {
        const result = await PublishedResumeService.getPublishedResume(id);
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setResume(result.data);
          // Decrypt
          const key = getKeyFromFragment();
          if (!key) {
            setError("Invalid or missing key. Unable to view resume.");
            return;
          }
          try {
            const decrypted = decryptAES(result.data.resume_data, key);
            setDecryptedData(JSON.parse(decrypted));
          } catch (e) {
            setError("Invalid or missing key. Unable to view resume.");
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
  }, [id]);

  // Calculate page count whenever decryptedData changes
  useEffect(() => {
    const calculatePages = async () => {
      if (secureExportRef.current && decryptedData) {
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
  }, [decryptedData]);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: resume ? `${resume.title}` : "Resume",
    onAfterPrint: () => {
      toast({
        title: "Resume Downloaded",
        description: "Your resume has been saved as a PDF.",
      });
    },
  });

  // Stub handlers for DOCX/JSON export
  const handleExportDocx = () => {
    toast({
      title: "Feature Coming Soon",
      description: "DOCX export will be available in the next update.",
      variant: "destructive",
    });
  };
  const handleExportJSON = () => {
    toast({
      title: "Feature Coming Soon",
      description: "JSON export will be available in the next update.",
      variant: "destructive",
    });
  };

  // Secure PDF export handler (same as editor)
  const handleExportPDF = async () => {
    try {
      setSecureExportLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
      let htmlToExport;
      if (secureExportRef.current) {
        htmlToExport = secureExportRef.current.innerHTML;
      } else {
        throw new Error("Resume content not ready.");
      }
      await securePdfExport(htmlToExport);
      toast({ title: "PDF Exported", description: "Your secure PDF is ready." });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSecureExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume || !decryptedData) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation
          showBackButton={true}
          breadcrumb="Resume Viewer"
        />

        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Resume not found"}
            </AlertDescription>
          </Alert>
          
          <div className="mt-8 text-center">
            <Link to="/editor">
              <Button>
                Create Your Own Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

      const TemplateComponent = templates[decryptedData.selectedTemplate || resume.template_name] || templates["modern-clean"];
  const keyFragment = window.location.hash;

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden resume component for page count calculation */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: `794px`, height: 'auto', overflow: 'visible', zIndex: -1 }}>
        <div ref={secureExportRef} style={{ width: `794px`, height: 'auto', backgroundColor: 'white', padding: '20px', margin: '0', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px', lineHeight: '1.5', color: '#000', overflow: 'visible' }}>
          <TemplateComponent data={decryptedData} />
        </div>
      </div>
      {secureExportLoading && <FullScreenLoader message="Exporting your resume as PDF..." />}
      <AppNavigation
        showBackButton={true}
        breadcrumb="Resume Viewer"
        actions={
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to={`/editor/${resume.id}${keyFragment}`} className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px] px-4 py-2 text-sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <ExportButtons
              exportToPDF={handleExportPDF}
              exportToDocx={handleExportDocx}
              exportToJSON={handleExportJSON}
            />
          </div>
        }
      />

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6 text-center">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 px-2">{resume.title}</h1>
              <p className="text-sm sm:text-base text-muted-foreground px-2">
                Published on {new Date(resume.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="border rounded-lg p-3 sm:p-4 lg:p-6 bg-white overflow-hidden resume-preview-container">
              <div className="w-full overflow-x-auto">
                <ResumePreview
                  data={decryptedData}
                  TemplateComponent={TemplateComponent}
                  showZoomControls={true}
                  containerClassName=""
                  zoom={zoom}
                  setZoom={setZoom}
                  pageCount={pageCount}
                  setPageCount={setPageCount}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewResume;