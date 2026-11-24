type Info = { forWho: string; needs: string; analyzes: string; produces: string; cannot: string; privacy: string };

/** What every tool must disclose before it is used. */
export function ToolInfo({ info, labels }: { info: Info; labels: { forWho: string; needs: string; analyzes: string; produces: string; cannot: string; privacy: string } }) {
  const rows: [string, string, string][] = [
    [labels.forWho, info.forWho, ""],
    [labels.needs, info.needs, ""],
    [labels.analyzes, info.analyzes, ""],
    [labels.produces, info.produces, ""],
    [labels.cannot, info.cannot, "border-amber/30 bg-amber/5"],
    [labels.privacy, info.privacy, ""],
  ];
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map(([k, v, extra]) => (
        <div key={k} className={`rounded-xl border border-line bg-surface/40 p-4 ${extra}`}>
          <dt className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">{k}</dt>
          <dd className="mt-1 text-sm text-paper/85">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
