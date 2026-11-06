import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { MotionRoot } from "@/components/motion-root";
import { Navbar } from "@/components/navbar";
import { getSiteUrl, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "greek"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: "%s — ORGANEXT",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  keywords: [
    "ORGANEXT",
    "ανάπτυξη λογισμικού",
    "εξατομικευμένες εφαρμογές",
    "πληροφοριακά συστήματα",
    "κατασκευή ιστοσελίδων",
    "ηλεκτρονικό κατάστημα",
    "αυτοματισμός",
    "τεχνητή νοημοσύνη",
  ],
  openGraph: {
    title: site.title,
    description: site.description,
    locale: "el_GR",
    type: "website",
    siteName: site.name,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: siteUrl,
    founder: {
      "@type": "Person",
      name: "Θεοχάρης Καφέτσης",
    },
    knowsLanguage: "el",
    knowsAbout: [
      "Ανάπτυξη λογισμικού",
      "Εξατομικευμένες εφαρμογές",
      "Πληροφοριακά συστήματα",
      "Ιστοσελίδες",
      "Ηλεκτρονικά καταστήματα",
      "Τεχνητή νοημοσύνη",
    ],
  };

  return (
    <html lang="el">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <MotionRoot />
        <a className="skip" href="#periexomeno">
          Μετάβαση στο περιεχόμενο
        </a>
        <Navbar />
        <main id="periexomeno">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
