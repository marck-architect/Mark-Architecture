import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Products", href: "/collection" },
  { label: "Services & Pricing", href: "/pricing" },
  { label: "Consultation", href: "/consultation" },
  { label: "FAQs", href: "/faqs" },
];

export const mobileMenuLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Atelier", href: "/about" },
  { label: "Selected Works", href: "/portfolio" },
  { label: "Turnkey Products", href: "/collection" },
  { label: "Services & Pricing", href: "/pricing" },
  { label: "Book Consultation", href: "/consultation" },
  { label: "FAQs & Guide", href: "/faqs" },
];

export const footerNavigationLinks: NavLink[] = [
  { label: "Home Studio", href: "/" },
  { label: "Services & Pricing", href: "/pricing" },
  { label: "Turnkey Products", href: "/collection" },
  { label: "Book Consultation", href: "/consultation" },
  { label: "Selected Works", href: "/portfolio" },
];

export const footerResourceLinks: NavLink[] = [
  { label: "About MARK Atelier", href: "/about" },
  { label: "FAQs & Client Guide", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
