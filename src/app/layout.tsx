import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Lalezar, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { site, activeSocials } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealController } from "@/components/Reveal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", weight: ["600", "700", "800", "900"] });
const brush = Permanent_Marker({ subsets: ["latin"], variable: "--font-brush", display: "swap", weight: "400" });
const arabic = Lalezar({ subsets: ["arabic"], variable: "--font-arabic", display: "swap", weight: "400", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.publicName} | ${site.role}`,
    template: `%s | ${site.publicName}`,
  },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: `${site.brand} — ${site.tagline}`,
    title: `${site.publicName} | ${site.role}`,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: `${site.publicName} | ${site.role}`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050B0A",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: [site.publicName, site.brand],
      email: `mailto:${site.email}`,
      url: site.url,
      image: `${site.url}/images/mano-portrait.jpg`,
      jobTitle: "Founder & CEO",
      worksFor: { "@type": "Organization", name: "ATHATHI" },
      description: site.description,
      address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Cairo University, Faculty of Computers and Artificial Intelligence" },
      knowsAbout: ["Artificial Intelligence", "Machine Learning", "Software Development", "Entrepreneurship", "Business Development", "Marketing"],
      sameAs: activeSocials().map((s) => s.href),
    },
    { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: `${site.brand} — ${site.tagline}`, publisher: { "@id": `${site.url}/#person` }, inLanguage: "en" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${archivo.variable} ${brush.variable} ${arabic.variable}`}>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealController />
      </body>
    </html>
  );
}
