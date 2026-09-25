import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Products", href: "/collection" },
  { label: "Pricing", href: "/pricing" },
  { label: "Services & Consultation", href: "/consultation" },
  { label: "FAQs", href: "/faqs" },
];

export const mobileMenuLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Products", href: "/collection" },
  { label: "Pricing", href: "/pricing" },
  { label: "Services & Consultation", href: "/consultation" },
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
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
