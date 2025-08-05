import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, Image, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { checkRateLimit, SECURITY_CONFIG } from "@/utils/security";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonsProps {
  exportToPDF: () => void;
  exportToDocx: () => void;
  exportToJSON: () => void;
}

const ExportButtons = ({ exportToPDF, exportToDocx, exportToJSON }: ExportButtonsProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handlePDFExport = () => {
    // Check rate limit before PDF export
    const rateLimit = checkRateLimit('pdf_export');
    // Check if rate limiting is enabled
    if (SECURITY_CONFIG.ENABLE_RATE_LIMITING && !rateLimit.allowed) {
      toast({
        title: "Rate Limit Exceeded",
        description: `PDF export limit reached. Please try again in ${Math.ceil((rateLimit.resetTime! - Date.now()) / 60000)} minutes.`,
        variant: "destructive",
      });
      return;
    }

    // Show remaining exports info
    if (SECURITY_CONFIG.ENABLE_RATE_LIMITING && rateLimit.remaining <= 3) {
      toast({
        title: "PDF Export",
        description: `You have ${rateLimit.remaining} PDF exports remaining in this hour.`,
      });
    }

    exportToPDF();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="shadow-elegant"
          size={isMobile ? "icon" : undefined}
          aria-label="Export Resume"
        >
          <Download className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Export Resume</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 md:w-56 bg-background border border-border z-50">
        <DropdownMenuItem onClick={handlePDFExport}>
          <FileText className="h-4 w-4 mr-2" />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToDocx}>
          <FileText className="h-4 w-4 mr-2" />
          Download as DOCX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <Image className="h-4 w-4 mr-2" />
          Export Data (JSON)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButtons;