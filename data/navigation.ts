import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services & Pricing", href: "/pricing" },
  { label: "Products", href: "/collection" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Consultation", href: "/consultation" },
  { label: "FAQs", href: "/faqs" },
];

export const mobileMenuLinks: NavLink[] = navLinks;

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
  { label: "Track Your Order", href: "/orders/track" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
