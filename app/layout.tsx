import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { playfair, inter, montserrat } from "@/lib/fonts";

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
