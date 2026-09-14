import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Collection", href: "/collection" },
  { label: "Services & Consultation", href: "/consultation" },
];

export const mobileMenuLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services & Consultation", href: "/consultation" },
  { label: "Collection", href: "/collection" },
];

export const footerNavigationLinks: NavLink[] = [
  { label: "Home Studio", href: "/" },
  { label: "Selected Works", href: "/portfolio" },
  { label: "Services & Consultation", href: "/consultation" },
  { label: "Store Collection", href: "/collection" },
];

export const footerResourceLinks: NavLink[] = [
  { label: "Blueprint Access", href: "#" },
  { label: "Press Kit", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];
