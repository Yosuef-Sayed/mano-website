"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lh, type Lang } from "@/i18n/config";

const text = {
  en: { title: "This page doesn't exist.", lead: "The link may be outdated. Here are a few places to start.", home: "Home", projects: "Projects", contact: "Contact" },
  ar: { title: "هذه الصفحة غير موجودة.", lead: "ربما يكون الرابط قديمًا. إليك بعض الأماكن للبدء.", home: "الرئيسية", projects: "المشروعات", contact: "تواصل" },
};

export default function NotFound() {
  const lang: Lang = /^\/ar(\/|$)/.test(usePathname() || "") ? "ar" : "en";
  const t = text[lang];
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow latin">404</p>
      <h1 className="h-display mt-3 text-5xl">{t.title}</h1>
      <p className="lead mt-4">{t.lead}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={lh(lang, "/")} className="btn btn-primary">{t.home}</Link>
        <Link href={lh(lang, "/projects")} className="btn btn-secondary">{t.projects}</Link>
        <Link href={lh(lang, "/contact")} className="btn btn-ghost">{t.contact}</Link>
      </div>
    </section>
  );
}
