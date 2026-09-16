import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Products", href: "/collection" },
  { label: "Services & Consultation", href: "/consultation" },
  { label: "FAQs", href: "/faqs" },
];

export const mobileMenuLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing Menu", href: "/pricing" },
  { label: "Services & Consultation", href: "/consultation" },
  { label: "Products", href: "/collection" },
  { label: "FAQs & Guide", href: "/faqs" },
];

export const footerNavigationLinks: NavLink[] = [
  { label: "Home Studio", href: "/" },
  { label: "Selected Works", href: "/portfolio" },
  { label: "Pricing & Packages", href: "/pricing" },
  { label: "Services & Consultation", href: "/consultation" },
  { label: "Store Collection", href: "/collection" },
  { label: "Architectural FAQs", href: "/faqs" },
];

export const footerResourceLinks: NavLink[] = [
  { label: "FAQs & Client Guide", href: "/faqs" },
  { label: "Blueprint Access", href: "#" },
  { label: "Press Kit", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];
