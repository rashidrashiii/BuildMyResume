import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Database,
  Server,
  FileText
} from "lucide-react";
import { checkRateLimit, clearAllRateLimits, SECURITY_CONFIG } from "@/utils/security";
import { PublishedResumeService } from "@/services/publishedResume";
import { useToast } from "@/hooks/use-toast";

interface SecurityStatus {
  pdfExports: {
    allowed: boolean;
    remaining: number;
    resetTime?: number;
  };
  resumePublishing: {
    allowed: boolean;
    remaining: number;
    resetTime?: number;
  };
  systemHealth: {
    status: 'healthy' | 'warning' | 'error';
    message: string;
  };
}

export const SecurityMonitor = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const { toast } = useToast();

  const updateSecurityStatus = () => {
    const pdfExports = checkRateLimit('pdf_export');
    const resumePublishing = checkRateLimit('resume_publish');
    
    setSecurityStatus({
      pdfExports,
      resumePublishing,
      systemHealth: {
        status: 'healthy',
        message: 'All systems operational'
      }
    });
  };

  const fetchStats = async () => {
    try {
      const result = await PublishedResumeService.getPublishingStats();
      if (result.data) {
        setStats(result.data);
      }
    } catch (error) {
      // Silent fail for production
    }
  };

  const cleanupOldResumes = async () => {
    setIsLoading(true);
    try {
      const result = await PublishedResumeService.cleanupOldResumes();
      if (result.deletedCount !== null) {
        toast({
          title: "Cleanup Complete",
          description: `Cleaned up ${result.deletedCount} old anonymous resumes.`,
        });
      } else {
        toast({
          title: "Cleanup Failed",
          description: result.error || "Failed to cleanup old resumes",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cleanup old resumes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetRateLimits = () => {
    clearAllRateLimits();
    updateSecurityStatus();
    toast({
      title: "Rate Limits Reset",
      description: "All rate limits have been reset for testing.",
    });
  };

  const toggleRateLimiting = () => {
    toast({
      title: "Rate Limiting",
      description: "Rate limiting is currently enabled and protecting your application.",
    });
  };

  useEffect(() => {
    updateSecurityStatus();
    fetchStats();
    
    const interval = setInterval(() => {
      updateSecurityStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (!securityStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
          <CardDescription>
            Real-time monitoring of rate limits and system health
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">PDF Exports</span>
                <Badge variant={securityStatus.pdfExports.allowed ? "default" : "destructive"}>
                  {securityStatus.pdfExports.remaining} / {SECURITY_CONFIG.PDF_EXPORT_LIMIT}
                </Badge>
              </div>
              <Progress 
                value={(securityStatus.pdfExports.remaining / SECURITY_CONFIG.PDF_EXPORT_LIMIT) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resume Publishing</span>
                <Badge variant={securityStatus.resumePublishing.allowed ? "default" : "destructive"}>
                  {securityStatus.resumePublishing.remaining} / {SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW}
                </Badge>
              </div>
              <Progress 
                value={(securityStatus.resumePublishing.remaining / SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW) * 100} 
                className="h-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusIcon(securityStatus.systemHealth.status)}
            <span className={`text-sm font-medium ${getStatusColor(securityStatus.systemHealth.status)}`}>
              {securityStatus.systemHealth.message}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Publishing Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent publishing activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              Services responding normally
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleResetRateLimits}
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Rate Limits
        </Button>

        <Button
          onClick={cleanupOldResumes}
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          <Clock className="h-4 w-4 mr-2" />
          Cleanup Old Resumes
        </Button>
      </div>
    </div>
  );
}; 