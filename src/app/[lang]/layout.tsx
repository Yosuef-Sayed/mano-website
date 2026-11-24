import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Archivo, IBM_Plex_Sans_Arabic, Inter, Lalezar, Permanent_Marker } from "next/font/google";
import "../globals.css";
import { activeSocials, site } from "@/config/site";
import { dirOf, isLang, locales } from "@/i18n/config";
import { getContent } from "@/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealController } from "@/components/Reveal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", weight: ["600", "700", "800", "900"] });
const brush = Permanent_Marker({ subsets: ["latin"], variable: "--font-brush", display: "swap", weight: "400" });
const arabicDisplay = Lalezar({ subsets: ["arabic"], variable: "--font-arabic", display: "swap", weight: "400", preload: false });
const arabicBody = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic-body", display: "swap", weight: ["400", "500", "600", "700"], preload: false });

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const c = getContent(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: c.meta.defaultTitle, template: c.meta.titleTemplate },
    description: c.meta.description,
    applicationName: site.brand,
    authors: [{ name: site.name }],
    creator: site.name,
    openGraph: {
      type: "website",
      siteName: `${site.brand} — ${site.tagline}`,
      title: c.meta.defaultTitle,
      description: c.meta.description,
      locale: lang === "ar" ? "ar_EG" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_EG",
      images: [{ url: `/og?lang=${lang}`, width: 1200, height: 630, alt: c.meta.defaultTitle }],
    },
    twitter: { card: "summary_large_image", title: c.meta.defaultTitle, description: c.meta.description, images: [`/og?lang=${lang}`] },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#050B0A", colorScheme: "dark" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        alternateName: [site.publicName, site.nameArabic, site.brand],
        email: `mailto:${site.email}`,
        url: site.url,
        image: `${site.url}/images/mano-portrait.jpg`,
        jobTitle: "Founder & CEO",
        worksFor: { "@type": "Organization", name: "ATHATHI" },
        description: c.meta.description,
        address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "Cairo University, Faculty of Computers and Artificial Intelligence" },
        knowsAbout: ["AI applications", "Software development", "Machine learning", "Product thinking", "Customer discovery"],
        sameAs: activeSocials().map((s) => s.href),
      },
      { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: `${site.brand} — ${site.tagline}`, publisher: { "@id": `${site.url}/#person` }, inLanguage: ["en", "ar"] },
    ],
  };
  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${inter.variable} ${archivo.variable} ${brush.variable} ${arabicDisplay.variable} ${arabicBody.variable}`}
    >
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header lang={lang} ui={c.ui} />
        <main id="main">{children}</main>
        <Footer lang={lang} c={c} />
        <RevealController />
      </body>
    </html>
  );
}
