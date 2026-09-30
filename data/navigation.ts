import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/collection" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Consultation", href: "/consultation" },
];

export const mobileMenuLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Atelier", href: "/about" },
  { label: "Architectural Services", href: "/services" },
  { label: "Turnkey Products", href: "/collection" },
  { label: "Selected Works", href: "/portfolio" },
  { label: "Pricing & Packages", href: "/pricing" },
  { label: "Book Consultation", href: "/consultation" },
  { label: "FAQs & Guide", href: "/faqs" },
];

export const footerNavigationLinks: NavLink[] = [
  { label: "Home Studio", href: "/" },
  { label: "Architectural Services", href: "/services" },
  { label: "Turnkey Products", href: "/collection" },
  { label: "Book Consultation", href: "/consultation" },
  { label: "Selected Works", href: "/portfolio" },
  { label: "Pricing & Packages", href: "/pricing" },
];

export const footerResourceLinks: NavLink[] = [
  { label: "About MARK Atelier", href: "/about" },
  { label: "FAQs & Client Guide", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
