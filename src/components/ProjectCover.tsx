/**
 * Original illustrated covers (inline SVG) for each project, in the MANO palette.
 * They are illustrations — not screenshots, interfaces or logos — and are labelled as such.
 */
const T = "#14B8A6";
const A = "#FFB15A";
const P = "rgb(237 237 237 / .55)";
const D = "rgb(237 237 237 / .14)";

function Athathi() {
  return (
    <g>
      <defs>
        <radialGradient id="ath-lamp" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor={A} stopOpacity=".55" />
          <stop offset="1" stopColor={A} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="292" cy="70" rx="120" ry="120" fill="url(#ath-lamp)" />
      {/* floor + wall line */}
      <path d="M20 182 H380" stroke={D} strokeWidth="1.5" />
      {/* sofa */}
      <path d="M150 150 q0-22 22-22 h96 q22 0 22 22 v18 h-140z" fill="none" stroke={P} strokeWidth="2" />
      <path d="M138 146 q0-10 10-10 h4 v36 h-14z M290 136 h4 q10 0 10 10 v26 h-14z" fill="none" stroke={P} strokeWidth="2" />
      <path d="M152 168 v14 M288 168 v14" stroke={P} strokeWidth="2" />
      {/* lamp */}
      <path d="M292 60 l-16 26 h32z" fill={A} fillOpacity=".85" />
      <path d="M292 86 v96 M280 182 h24" stroke={P} strokeWidth="2" />
      {/* plant */}
      <path d="M96 182 v-34 m0 10 q-14-6-16-22 q14 2 16 16 m0-8 q10-14 22-12 q-4 14-22 16" fill="none" stroke={T} strokeWidth="2" />
      <rect x="86" y="164" width="20" height="18" rx="3" fill="none" stroke={P} strokeWidth="2" />
      {/* customer ↔ vendor network */}
      <circle cx="40" cy="58" r="9" fill="none" stroke={T} strokeWidth="2" />
      <circle cx="360" cy="140" r="9" fill="none" stroke={T} strokeWidth="2" />
      <circle cx="210" cy="96" r="6" fill={T} />
      <path d="M49 60 Q130 70 204 94 M216 98 Q300 118 351 138" fill="none" stroke={T} strokeWidth="1.5" strokeDasharray="4 5" />
    </g>
  );
}

function Masroofy() {
  const bands = [
    [70, T],
    [50, A],
    [35, P],
    [25, D],
  ] as const;
  let x = 200;
  return (
    <g>
      {/* wallet */}
      <rect x="60" y="62" width="120" height="96" rx="14" fill="none" stroke={P} strokeWidth="2" />
      <path d="M60 86 h120" stroke={D} strokeWidth="2" />
      <rect x="136" y="98" width="52" height="30" rx="8" fill="none" stroke={T} strokeWidth="2" />
      <circle cx="152" cy="113" r="4" fill={T} />
      {/* budget split bar */}
      <g transform="translate(0 0)">
        {bands.map(([w, c], i) => {
          const r = <rect key={i} x={x} y="62" width={w - 4} height="14" rx="7" fill={c} fillOpacity={i < 2 ? 0.9 : 1} />;
          x += w;
          return r;
        })}
      </g>
      {/* category stack */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={200} y={96 + i * 16} width={180 - i * 40} height="8" rx="4" fill={i === 0 ? T : D} />
      ))}
      {/* alert ring */}
      <circle cx="320" cy="160" r="16" fill="none" stroke={A} strokeWidth="2" />
      <path d="M320 152 v10 M320 167 v1" stroke={A} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Gameboard() {
  const cells = (ox: number, oy: number, n: number, s: number) =>
    Array.from({ length: n * n }).map((_, i) => <rect key={`${ox}-${i}`} x={ox + (i % n) * s} y={oy + Math.floor(i / n) * s} width={s - 4} height={s - 4} rx="4" fill="none" stroke={D} strokeWidth="1.5" />);
  return (
    <g>
      <g transform="rotate(-8 110 112)">
        {cells(56, 58, 3, 36)}
        <path d="M66 68 l16 16 m0 -16 l-16 16" stroke={T} strokeWidth="3" strokeLinecap="round" />
        <circle cx="110" cy="112" r="9" fill="none" stroke={A} strokeWidth="3" />
        <path d="M138 140 l16 16 m0 -16 l-16 16" stroke={T} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* 4 in a row */}
      {Array.from({ length: 4 }).map((_, i) => (
        <circle key={i} cx={196 + i * 24} cy={64 + i * 24} r="9" fill={i % 2 ? "none" : T} stroke={T} strokeWidth="2" />
      ))}
      {/* pyramid */}
      {[1, 3, 5].map((n, r) =>
        Array.from({ length: n }).map((_, i) => (
          <rect key={`p${r}${i}`} x={350 - (n * 18) / 2 + i * 18} y={118 + r * 20} width="14" height="14" rx="3" fill={r === 2 && i === 2 ? A : "none"} stroke={P} strokeWidth="1.5" />
        )),
      )}
    </g>
  );
}

function Manofy() {
  const wave = (amp: number, phase: number, y: number) => {
    let d = `M20 ${y}`;
    for (let x = 20; x <= 380; x += 8) d += ` L${x} ${y + Math.sin((x + phase) / 18) * amp * Math.sin(x / 120)}`;
    return d;
  };
  return (
    <g>
      <path d={wave(34, 0, 104)} fill="none" stroke={T} strokeWidth="2" />
      <path d={wave(22, 40, 112)} fill="none" stroke={A} strokeWidth="1.5" opacity=".8" />
      <path d={wave(12, 90, 108)} fill="none" stroke={P} strokeWidth="1" />
      {/* loop brackets */}
      <path d="M130 52 h-10 v104 h10 M270 52 h10 v104 h-10" fill="none" stroke={A} strokeWidth="2" />
      {/* playhead */}
      <path d="M200 44 v122" stroke={P} strokeWidth="1.5" strokeDasharray="3 4" />
      {/* playlist */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={30 + i * 118} y="182" width="96" height="8" rx="4" fill={i === 1 ? T : D} />
      ))}
    </g>
  );
}

function Manopix() {
  const n = 12;
  const s = 16;
  return (
    <g>
      {Array.from({ length: n * 8 }).map((_, i) => {
        const cx = i % n;
        const cy = Math.floor(i / n);
        const t = cx / (n - 1);
        const lum = 30 + ((cx * 7 + cy * 13) % 50);
        const color = t < 0.45 ? `rgb(${lum + 80} ${lum + 80} ${lum + 80} / .5)` : t < 0.6 ? `rgb(237 237 237 / .15)` : (cx + cy) % 3 === 0 ? A : (cx + cy) % 3 === 1 ? T : `rgb(20 184 166 / .35)`;
        return <rect key={i} x={104 + cx * s} y={44 + cy * s} width={s - 3} height={s - 3} rx="2" fill={color} />;
      })}
      {/* edge-detect diagonal */}
      <path d="M196 40 L236 176" stroke={T} strokeWidth="2" />
      {/* crop corners */}
      <path d="M92 52 v-16 h16 M302 36 h16 v16 M318 168 v16 h-16 M108 184 h-16 v-16" fill="none" stroke={P} strokeWidth="2" />
    </g>
  );
}

const art: Record<string, () => React.ReactElement> = {
  athathi: Athathi,
  masroofy: Masroofy,
  gameboard: Gameboard,
  manofy: Manofy,
  manopix: Manopix,
};

export function ProjectCover({ id, label, className = "", tags = [] }: { id: string; label: string; className?: string; tags?: string[] }) {
  const Art = art[id];
  return (
    <div className={`relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-navy via-surface to-ink ${className}`}>
      {Art && (
        <svg viewBox="0 0 400 225" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <Art />
        </svg>
      )}
      {tags.length > 0 && (
        <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          {tags.map((l) => <span key={l} className="rounded bg-ink/75 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-teal uppercase backdrop-blur">{l}</span>)}
        </div>
      )}
      <span className="absolute bottom-2 end-3 rounded bg-ink/70 px-1.5 py-0.5 text-[10px] text-paper/60">{label}</span>
    </div>
  );
}
