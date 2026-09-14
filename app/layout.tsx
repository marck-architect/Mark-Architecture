import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "600", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://markarchitects.com"),
  title: "MARK Architects | Digital Atelier & Curated Store",
  description:
    "Precision in every pixel. Defining the future of architectural luxury and spatial legacy across the globe.",
  openGraph: {
    title: "MARK Architects | Digital Atelier",
    description:
      "Ultra-premium architectural excellence and innovative design thinking tailored for the global elite.",
    url: "https://markarchitects.com",
    siteName: "MARK Architects",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MARK Architects",
    description:
      "Defining the future of architectural luxury and spatial legacy across the globe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${montserrat.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-surface text-on-surface font-inter selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
