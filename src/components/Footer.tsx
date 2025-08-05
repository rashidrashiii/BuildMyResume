import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GitHubStats from "@/components/GitHubStats";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6 md:space-y-0">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-semibold">BuildMyResume</span>
              <Badge variant="outline" className="text-xs">Open Source</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Created by{" "}
                <a 
                  href="https://linkedin.com/in/muhammed-rashid-v" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Muhammed Rashid V
                </a>
              </span>
            </div>
          </div>

          {/* Spacer for desktop */}
          <div className="hidden md:block h-4"></div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <a href="https://github.com/rashidrashiii" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://rashidv.dev" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                Website
              </a>
              <a href="https://github.com/rashidrashiii/BuildMyResume/blob/main/LICENSE" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                MIT License
              </a>
            </div>
          </div>

          {/* GitHub Stats */}
          <div className="flex justify-center pt-4">
            <GitHubStats showLanguage={false} className="text-center" />
          </div>

          {/* Copyright */}
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground px-2">
              © {currentYear} BuildMyResume. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Built with ❤️ for the community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 