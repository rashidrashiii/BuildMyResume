import { Star, GitFork, Eye } from "lucide-react";
import { useGitHubData } from "@/hooks/useGitHubData";
import { Badge } from "@/components/ui/badge";

interface GitHubStatsProps {
  showForks?: boolean;
  showLanguage?: boolean;
  compact?: boolean;
  className?: string;
}

export const GitHubStats = ({ 
  showForks = true, 
  showLanguage = true, 
  compact = false,
  className = ""
}: GitHubStatsProps) => {
  const { data, loading, formattedStarCount, formattedForkCount } = useGitHubData();

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-pulse bg-muted rounded h-4 w-16"></div>
        {showForks && <div className="animate-pulse bg-muted rounded h-4 w-12"></div>}
        {showLanguage && <div className="animate-pulse bg-muted rounded h-4 w-8"></div>}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <Star className="h-3 w-3 text-yellow-500" />
        <span className="text-sm font-medium">{formattedStarCount}</span>
      </div>
      
      {showForks && (
        <div className="flex items-center gap-1">
          <GitFork className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{formattedForkCount}</span>
        </div>
      )}
      
      {showLanguage && data.language && (
        <Badge variant="secondary" className="text-xs">
          {data.language}
        </Badge>
      )}
    </div>
  );
};

export default GitHubStats; 