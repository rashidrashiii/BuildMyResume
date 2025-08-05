import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Star, Github, User } from "lucide-react";
import { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useGitHubData } from "@/hooks/useGitHubData";

interface AppNavigationProps {
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonLink?: string;
  breadcrumb?: string;
  actions?: ReactNode;
  showGitHubStar?: boolean;
  showGitHubButton?: boolean;
}

export const AppNavigation = ({
  showBackButton = false,
  backButtonText = "Home",
  backButtonLink = "/",
  breadcrumb,
  actions,
  showGitHubStar = false,
  showGitHubButton = false,
}: AppNavigationProps) => {
  const { formattedStarCount, loading } = useGitHubData();
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {showBackButton && (
              <Link to={backButtonLink}>
                <Button variant="ghost" size="sm" className="min-h-[36px] px-2 sm:px-3 py-2 text-sm">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{backButtonText}</span>
                </Button>
              </Link>
            )}
            
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <span className="text-lg sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
                BuildMyResume
              </span>
            </Link>
            
            {breadcrumb && (
              <span className="text-sm text-muted-foreground hidden md:block">
                / {breadcrumb}
              </span>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {showGitHubButton && (
              <a 
                href="https://github.com/rashidrashiii/BuildMyResume" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:block"
              >
                <Button variant="ghost" size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </a>
            )}
            
            {showGitHubStar && (
              <a
                href="https://github.com/rashidrashiii/BuildMyResume"
                target="_blank"
                rel="noopener noreferrer"
                className="flex"
              >
                <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary/40">
                  <Star className="h-4 w-4 mr-2" />
                  <span>
                    {loading ? '...' : `${formattedStarCount}`}
                  </span>
                </Button>
              </a>
            )}
            
            <ThemeToggle />
            
            {actions}
          </div>
        </div>
      </div>
    </nav>
  );
};