import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-3 text-5xl">This page doesn&apos;t exist.</h1>
      <p className="lead mt-4">The link may be outdated. Here are a few places to start.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Home</Link>
        <Link href="/projects" className="btn btn-secondary">Projects</Link>
        <Link href="/contact" className="btn btn-ghost">Contact</Link>
      </div>
    </section>
  );
}
