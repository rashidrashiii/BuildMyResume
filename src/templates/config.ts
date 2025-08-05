import ModernCleanResume from "./ModernCleanResume";
import ATSOptimizedResume from "./ATSOptimizedResume";
import ClassicProfessionalResume from "./ClassicProfessionalResume";
import ModernA4Resume from "./ModernA4Resume";
import ModernTwoColumnResume from "./ModernTwoColumnResume";
import ElitePremiumResume from "./ElitePremiumResume";
import TraditionalBusinessResume from "./TraditionalBusinessResume";
import EngineeringResume from "./EngineeringResume";
import TwoColumnLayoutResume from "./TwoColumnLayoutResume";
import CorporateProfessionalResume from "./CorporateProfessionalResume";
import MinimalistResume from "./MinimalistResume";
import CreativeDesignResume from "./CreativeDesignResume";
import ElegantMinimalistResume from "./ElegantMinimalistResume";
import BoldCreativeResume from "./BoldCreativeResume";
import SoftwareEngineerResume from "./SoftwareEngineerResume";

export const templateConfigs = [
  // Professional & Traditional Category
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "Traditional serif font design with centered layout, perfect for conservative industries.",
    category: "Professional & Traditional",
    previewImage: "/templates/classic-professional.png",
    component: ClassicProfessionalResume,
  },
  {
    id: "traditional-business",
    name: "Traditional Business",
    description: "Standard business format with clean, professional appearance suitable for all industries.",
    category: "Professional & Traditional",
    previewImage: "/templates/traditional-business.png",
    component: TraditionalBusinessResume,
  },
  {
    id: "corporate-professional",
    name: "Corporate Professional",
    description: "Clean corporate style with modern typography and professional color scheme.",
    category: "Professional & Traditional",
    previewImage: "/templates/corporate-professional.png",
    component: CorporateProfessionalResume,
  },

  // Modern & Contemporary Category
  {
    id: "modern-clean",
    name: "Modern Clean",
    description: "Clean, contemporary design with professional color scheme and modern typography.",
    category: "Modern & Contemporary",
    previewImage: "/templates/modern-clean.png",
    component: ModernCleanResume,
  },
  {
    id: "modern-a4",
    name: "Modern A4",
    description: "Modern design optimized for A4 paper format with gradient backgrounds and icons.",
    category: "Modern & Contemporary",
    previewImage: "/templates/modern-a4.png",
    component: ModernA4Resume,
  },
  {
    id: "modern-two-column",
    name: "Modern Two Column",
    description: "Contemporary two-column layout with clean design and efficient space utilization.",
    category: "Modern & Contemporary",
    previewImage: "/templates/modern-two-column.png",
    component: ModernTwoColumnResume,
  },

  // ATS & Applicant Tracking Category
  {
    id: "ats-optimized",
    name: "ATS Optimized",
    description: "ATS-friendly template with clear sections, standard formatting, and keyword optimization.",
    category: "ATS & Applicant Tracking",
    previewImage: "/templates/ats-optimized.png",
    component: ATSOptimizedResume,
  },

  // Technical & Engineering Category
  {
    id: "software-engineer",
    name: "Software Engineer",
    description: "Terminal-inspired design with technical focus, perfect for software developers and tech professionals.",
    category: "Technical & Engineering",
    previewImage: "/templates/software-engineer.png",
    component: SoftwareEngineerResume,
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Specialized template designed for engineering professionals with technical skill emphasis.",
    category: "Technical & Engineering",
    previewImage: "/templates/engineering.png",
    component: EngineeringResume,
  },

  // Creative & Design Category
  {
    id: "creative-design",
    name: "Creative Design",
    description: "Creative layout with color blocks and unique design elements for creative professionals.",
    category: "Creative & Design",
    previewImage: "/templates/creative-design.png",
    component: CreativeDesignResume,
  },
  {
    id: "bold-creative",
    name: "Bold Creative",
    description: "Bold and powerful template with strong visual impact and creative styling.",
    category: "Creative & Design",
    previewImage: "/templates/bold-creative.png",
    component: BoldCreativeResume,
  },

  // Elegant & Premium Category
  {
    id: "elite-premium",
    name: "Elite Premium",
    description: "Premium template with sophisticated gradient design and elegant styling for executive positions.",
    category: "Elegant & Premium",
    previewImage: "/templates/elite-premium.png",
    component: ElitePremiumResume,
  },
  {
    id: "elegant-minimalist",
    name: "Elegant Minimalist",
    description: "Elegant template with sophisticated typography and refined spacing for professional appeal.",
    category: "Elegant & Premium",
    previewImage: "/templates/elegant-minimalist.png",
    component: ElegantMinimalistResume,
  },

  // Minimalist & Clean Category
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean minimalist design with black and white color scheme for elegant simplicity and professional appeal.",
    category: "Minimalist & Clean",
    previewImage: "/templates/minimalist.png",
    component: MinimalistResume,
  },
  {
    id: "two-column-layout",
    name: "Two Column Layout",
    description: "Simple and efficient two-column layout for comprehensive information display.",
    category: "Minimalist & Clean",
    previewImage: "/templates/two-column-layout.png",
    component: TwoColumnLayoutResume,
  },
]; 