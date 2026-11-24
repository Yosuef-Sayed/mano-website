import type { Metadata } from "next";
import { site } from "@/config/site";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How information sent through this website's forms is handled.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Privacy notice" title="What happens to what you send." />
      <section className="container-x max-w-3xl space-y-5 text-paper/85">
        <p>When you submit a form, the details you enter (such as your name, email and message) are stored securely and sent to me by email so I can reply.</p>
        <p>They are used only to respond to your request. They are not sold, shared for marketing, or added to a mailing list.</p>
        <p>The site keeps no advertising trackers. Basic technical logs (such as IP address, used for spam and abuse protection) may be kept briefly by the hosting provider.</p>
        <p>To have your submission deleted, email <a className="link" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </section>
    </>
  );
}
