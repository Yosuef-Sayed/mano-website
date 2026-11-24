import type { Metadata } from "next";
import { BookingForm } from "@/components/forms/Forms";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Request an online session with Abdelrahman MANO: an introductory call or a Project & Startup Clarity Session.",
  alternates: { canonical: "/book" },
};

const steps = [
  ["Send a request", "Choose a session type, a preferred date and a time window in your time zone."],
  ["I review it", "I check fit and availability, and agree scope (and price, if any) by email."],
  ["Confirmation", "Only then is the session confirmed and the meeting link sent."],
];

export default async function BookPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const { session } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Book a session"
        title="Request an online meeting."
        lead="Sessions are requested here and confirmed personally — there is no fake live calendar. My working time zone is Cairo (Africa/Cairo); you pick times in yours."
      >
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-xl border border-line bg-surface/40 p-4">
              <p className="font-display text-sm font-bold text-amber">0{i + 1}</p>
              <p className="mt-1 font-semibold">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </PageHero>
      <section className="container-x max-w-4xl" aria-label="Session request form">
        <div className="card p-6 sm:p-8">
          <BookingForm key={session ?? "none"} initialSession={session ?? ""} />
        </div>
      </section>
    </>
  );
}
