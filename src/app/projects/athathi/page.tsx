import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CtaBand, StatusBadge } from "@/components/ui";

export const metadata: Metadata = {
  title: "ATHATHI Case Study",
  description:
    "How customer discovery, a business model and AI assistants came together in ATHATHI, an early-stage furniture-tech startup — including what is still unfinished.",
  alternates: { canonical: "/projects/athathi" },
};

/** Edit when the evidence changes. */
const STATUS = "Functional Prototype — Further Integration & Refinement Required";

const toc = [
  ["overview", "Overview"],
  ["opportunity", "The opportunity"],
  ["discovery", "Market discovery"],
  ["model", "Business model"],
  ["product", "Product experience"],
  ["stack", "Technical overview"],
  ["contributions", "My contributions"],
  ["architecture", "Architecture"],
  ["challenges", "Challenges"],
  ["status", "Current status"],
  ["learning", "Key learning"],
];

function Block({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-line pt-12" data-reveal>
      <p className="font-display text-sm font-bold text-amber">{String(n).padStart(2, "0")}</p>
      <h2 id={`${id}-h`} className="h-display mt-1 text-3xl sm:text-4xl">{title}</h2>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-paper/85">{children}</div>
    </section>
  );
}

const journey = ["Budget", "Design", "Materials", "Production", "Delivery"];

const teamStack = [
  ["Frontend", "React, JavaScript"],
  ["Backend", "Django, Python"],
  ["Mobile", "Flutter"],
  ["Database", "SQL"],
  ["AI & integration", "LangChain, LangGraph, FastAPI, RAG, Tavily Search, vector database"],
  ["Collaboration", "Docker (consistent environments and migrations across the team)"],
];

const contributions = {
  "AI & technical": [
    "AI pipeline work behind the Customer Assistant and Business Assistant",
    "RAG-based recommendation workflow on a vector database",
    "System prompts for both assistants",
    "FastAPI integration of the AI service",
    "Tavily Search integration for current web data (e.g. wood prices, trends)",
    "Contributions to backend structure and the SQL database schema",
    "Figma UI/UX for the AI assistant pages and connected flows",
  ],
  "Business & leadership": [
    "Customer discovery: 30+ customer and 7+ business interviews",
    "Segmentation, STP, competitor analysis, value propositions",
    "Business planning, financial and market analysis",
    "Partnership exploration with vendors and factories",
    "Brand identity, logo and social media positioning",
    "Coordinating a six-person core team (including me) and ~25 contributors as needed",
  ],
};

function Node({ title, sub, tone = "base", children }: { title: string; sub?: string; tone?: "base" | "mine" | "pending"; children?: ReactNode }) {
  const cls =
    tone === "mine" ? "border-teal/60 bg-teal/10" : tone === "pending" ? "border-dashed border-amber/60 bg-amber/5" : "border-line bg-surface/70";
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${cls}`}>
      <p className="text-sm font-bold text-paper">{title}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
      {children}
    </div>
  );
}
const Down = ({ dashed, label }: { dashed?: boolean; label?: string }) => (
  <div className="flex flex-col items-center py-1" aria-hidden>
    <span className={`h-6 w-px ${dashed ? "border-l border-dashed border-amber/70" : "bg-teal/60"}`} />
    {label && <span className="text-[10px] font-semibold tracking-wider text-amber uppercase">{label}</span>}
    <span className={`size-0 border-x-4 border-t-[6px] border-x-transparent ${dashed ? "border-t-amber/70" : "border-t-teal/60"}`} />
  </div>
);

export default function Athathi() {
  return (
    <>
      <header className="relative overflow-hidden grain">
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-24 size-[36rem] rounded-full bg-amber/15 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-20 size-[30rem] rounded-full bg-teal/10 blur-[120px]" />
        <div className="container-x relative pb-16 pt-14 sm:pt-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/projects" className="hover:text-teal">Projects</Link> <span aria-hidden>/</span> ATHATHI
          </nav>
          <p className="eyebrow mt-6">Case study · Startup · May 2025 – Present</p>
          <h1 className="h-display mt-3 text-5xl sm:text-7xl">ATHATHI</h1>
          <p className="mt-4 max-w-3xl text-xl text-paper/85 sm:text-2xl">
            From 30+ customer conversations to an AI assistant prototype: a furniture-tech venture where business research and
            technical work had to meet in the middle.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StatusBadge tone="amber">{STATUS}</StatusBadge>
            <span className="tag">My role: Founder & CEO</span>
            <span className="tag">Six-person core team + ~25 contributors</span>
          </div>
        </div>
      </header>

      <div className="container-x grid gap-12 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Case study sections" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-line text-sm">
            {toc.map(([id, l]) => (
              <li key={id}><a href={`#${id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-muted transition hover:border-teal hover:text-paper">{l}</a></li>
            ))}
          </ol>
        </nav>

        <article className="min-w-0 space-y-16">
          <Block id="overview" n={1} title="Project overview">
            <p>
              ATHATHI is an early-stage furniture and interior solutions venture. It connects customers with furniture vendors and uses a
              technology and AI layer to support product discovery, recommendations and business insight for vendors.
            </p>
            <p className="text-base text-muted">
              It is a startup in development, not a launched marketplace. This page separates what exists from what is planned.
            </p>
          </Block>

          <Block id="opportunity" n={2} title="The opportunity">
            <p>Furnishing a home is a long chain of decisions, and customers often struggle to understand:</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {["Which options are actually available", "Whether their budget is realistic", "Materials and their trade-offs", "Design decisions", "How far products can be customized", "Which vendor to trust"].map((x) => (
                <li key={x} className="rounded-xl border border-line bg-surface/40 px-4 py-3 text-base">{x}</li>
              ))}
            </ul>
            <p>ATHATHI explores whether a guided digital experience can make that chain simpler — for customers and for the vendors serving them.</p>
          </Block>

          <Block id="discovery" n={3} title="Market discovery">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-6"><p className="h-display text-5xl text-teal">30+</p><p className="mt-1 font-semibold">customer interviews</p><p className="text-sm text-muted">Pain points across the buying journey</p></div>
              <div className="card p-6"><p className="h-display text-5xl text-teal">7+</p><p className="mt-1 font-semibold">furniture business interviews</p><p className="text-sm text-muted">Vendors and business owners</p></div>
            </div>
            <p>Alongside the interviews: competitor analysis, customer pain-point discovery and market segmentation. The interviews shaped the business model, not the other way round.</p>
          </Block>

          <Block id="model" n={4} title="Business model">
            <p>The customer journey the product is designed around:</p>
            <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch" aria-label="Customer journey">
              {journey.map((j, i) => (
                <li key={j} className="flex flex-1 items-center gap-2 sm:flex-col sm:gap-0">
                  <span className="flex w-full items-center justify-center rounded-xl border border-teal/40 bg-teal/10 px-3 py-3 text-base font-semibold">{j}</span>
                  {i < journey.length - 1 && <span aria-hidden className="text-teal sm:hidden">↓</span>}
                </li>
              ))}
            </ol>
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Economy", "Budget-conscious buyers"], ["Mid-range", "Value and quality balance"], ["Premium", "Customization and finish"]].map(([t, d]) => (
                <div key={t} className="card p-5"><p className="font-bold">{t}</p><p className="text-sm text-muted">{d}</p></div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-5 text-base"><p className="eyebrow">Customer side</p><p className="mt-2 text-paper/80">People furnishing or renovating homes, budget-conscious buyers and those wanting customized furniture: help them discover, compare and decide.</p></div>
              <div className="card p-5 text-base"><p className="eyebrow">Vendor side</p><p className="mt-2 text-paper/80">Furniture businesses and factories: reach the right customers and understand behavior, trends and best sellers.</p></div>
            </div>
          </Block>

          <Block id="product" n={5} title="Product experience">
            <p className="text-base text-muted">What each component is for. Their current state is described under Challenges and Status below.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Customer Assistant", "Designed to help customers discover furniture, clarify their requirements and get relevant recommendations from ATHATHI vendors."],
                ["Business Assistant", "Designed to give vendors insight into customer behavior, needs, trends and best-selling products."],
                ["RAG recommendations", "Designed to retrieve relevant products from a vector database so recommendations draw on vendor catalogue data."],
              ].map(([t, d]) => (
                <div key={t} className="card p-5 text-base"><p className="font-bold text-teal">{t}</p><p className="mt-2 text-paper/80">{d}</p></div>
              ))}
            </div>
          </Block>

          <Block id="stack" n={6} title="Technical overview">
            <p className="text-base text-muted">This is the <b className="text-paper">team&apos;s</b> technology stack. My personal contributions are listed separately in the next section.</p>
            <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line text-base">
              {teamStack.map(([k, v]) => (
                <div key={k} className="grid gap-1 bg-surface/30 px-5 py-3 sm:grid-cols-[180px_1fr]">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="text-paper/80">{v}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block id="contributions" n={7} title="My contributions">
            <div className="grid gap-5 md:grid-cols-2">
              {Object.entries(contributions).map(([k, list]) => (
                <div key={k} className="card p-6">
                  <p className="eyebrow">{k}</p>
                  <ul className="mt-4 space-y-2.5 text-base">
                    {list.map((c) => (
                      <li key={c} className="flex gap-3"><span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-teal" /><span className="text-paper/85">{c}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-base text-muted">
              The agent has six tools in total; my work focused on the Customer Assistant, Business Assistant and the RAG recommender. I
              contributed to selected parts of the system — I did not independently architect or deploy it.
            </p>
          </Block>

          <Block id="architecture" n={8} title="High-level project architecture">
            <p className="text-base text-muted">
              A simplified view of how the parts relate. It is a project architecture, not a verified production deployment. Dashed lines
              mark connections that are not finished yet.
            </p>
            <div className="card p-5 sm:p-8" role="img" aria-label="Architecture: customer and vendor interface connects, with integration in progress, to a FastAPI AI service, which runs a LangChain and LangGraph agent with six tools, including the Customer Assistant, Business Assistant and RAG recommender, which use a vector database and Tavily Search. The Django backend and SQL database sit alongside.">
              <div className="mx-auto max-w-2xl">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Node title="Customer / Vendor interface" sub="React web · Flutter mobile" />
                  <Node title="Application backend" sub="Django · SQL database" />
                </div>
                <Down dashed label="Integration in progress" />
                <Node title="AI service" sub="FastAPI" tone="mine" />
                <Down />
                <Node title="Agent" sub="LangChain · LangGraph · six tools" />
                <Down />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Node title="Customer Assistant" tone="mine" />
                  <Node title="Business Assistant" tone="mine" />
                  <Node title="RAG recommender" tone="mine" />
                </div>
                <Down dashed label="Retrieval quality being refined" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Node title="Vector database" sub="Product retrieval" />
                  <Node title="Tavily Search" sub="Current web data" />
                </div>
              </div>
              <ul className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted">
                <li className="flex items-center gap-2"><span className="size-3 rounded border border-teal/60 bg-teal/10" /> My work</li>
                <li className="flex items-center gap-2"><span className="size-3 rounded border border-line bg-surface" /> Team / system</li>
                <li className="flex items-center gap-2"><span className="h-px w-5 border-t border-dashed border-amber" /> Not finished</li>
              </ul>
            </div>
          </Block>

          <Block id="challenges" n={9} title="Development challenges">
            <p>The prototype responds correctly through the terminal. Getting from there to a product is where the real work is:</p>
            <ul className="space-y-3 text-base">
              {[
                ["Frontend integration", "Connecting the AI service to the web interface was not completed."],
                ["RAG integration", "The retrieval pipeline needed further debugging."],
                ["Retrieval quality", "References and recommendation relevance needed improvement."],
                ["Scope", "Not all intended capabilities were complete."],
              ].map(([t, d]) => (
                <li key={t} className="rounded-xl border border-dashed border-amber/40 bg-amber/5 px-5 py-4"><b className="text-amber">{t}.</b> <span className="text-paper/85">{d}</span></li>
              ))}
            </ul>
            <p>I&apos;m listing these because they are where most of the learning happened — not because they are achievements.</p>
          </Block>

          <Block id="status" n={10} title="Current status">
            <StatusBadge tone="amber">{STATUS}</StatusBadge>
            <p>The business side continues — research, model refinement and partnership exploration. The AI work is a working prototype that still needs integration and refinement before anyone could use it.</p>
          </Block>

          <Block id="learning" n={11} title="Key learning">
            <ul className="grid gap-3 sm:grid-cols-2 text-base">
              {[
                ["Research before code", "Interviews shaped the business model the assistants are meant to serve."],
                ["AI is a component, not the product", "A recommender is only useful inside a journey customers already trust."],
                ["Integration is the hard part", "A working model in a terminal is far from a working product."],
                ["Honest status builds trust", "Clear labels for prototype vs. production make collaboration easier."],
                ["Iterate in small loops", "Test, debug, adjust — on both the business and the technical side."],
                ["Teams need translation", "Coordinating business and engineering contributors means explaining each side to the other."],
              ].map(([t, d]) => (
                <li key={t} className="card p-5"><p className="font-bold">{t}</p><p className="mt-1 text-sm text-muted">{d}</p></li>
              ))}
            </ul>
          </Block>
        </article>
      </div>

      <CtaBand title="Exploring a similar problem — or want to talk about ATHATHI?" text="I'm happy to talk about customer discovery, AI assistants in early products, or the venture itself." />
    </>
  );
}
