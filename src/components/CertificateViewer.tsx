"use client";

/* eslint-disable @next/next/no-img-element -- full-resolution certificate preview inside a dialog */
import { useRef, useState, type ReactNode } from "react";
import { Close, Download } from "./Icons";

type Labels = { close: string; download: string; zoom: string; fit: string; certificate: string };

/**
 * Opens a certificate (image or PDF) in an accessible in-page dialog.
 * Native <dialog>: focus is trapped, Esc closes, the page behind is inert,
 * and focus returns to the button that opened it.
 */
export function CertificateButton({
  src,
  title,
  subtitle,
  labels,
  className = "",
  children,
}: {
  src: string;
  title: string;
  subtitle?: string;
  labels: Labels;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(false);
  const isPdf = /\.pdf($|\?)/i.test(src);
  const titleId = `cert-${src.replace(/[^a-z0-9]/gi, "")}`;

  const open = () => {
    setZoom(false);
    ref.current?.showModal();
  };
  const close = () => ref.current?.close();

  return (
    <>
      <button type="button" onClick={open} className={className} aria-haspopup="dialog">
        {children}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === ref.current) close(); // backdrop click
        }}
        className="m-auto max-h-[92dvh] w-[min(1100px,94vw)] overflow-hidden rounded-2xl border border-line bg-navy p-0 text-paper shadow-2xl backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-teal uppercase">{labels.certificate}</p>
            <h2 id={titleId} className="truncate font-semibold">{title}</h2>
            {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {!isPdf && (
              <button type="button" onClick={() => setZoom((z) => !z)} className="btn btn-ghost min-h-10 px-3 text-xs">
                {zoom ? labels.fit : labels.zoom}
              </button>
            )}
            <a href={src} download className="btn btn-ghost min-h-10 px-3 text-xs">
              <Download /> <span className="hidden sm:inline">{labels.download}</span>
            </a>
            <button type="button" onClick={close} className="inline-flex size-10 items-center justify-center rounded-full hover:bg-paper/10" aria-label={labels.close} autoFocus>
              <Close className="size-5" />
            </button>
          </div>
        </div>
        <div className={`max-h-[calc(92dvh-72px)] ${zoom ? "overflow-auto" : "overflow-hidden"} bg-ink/60`}>
          {isPdf ? (
            <object data={src} type="application/pdf" className="h-[calc(92dvh-72px)] w-full">
              <p className="p-6 text-sm">
                <a href={src} download className="link">{labels.download}</a>
              </p>
            </object>
          ) : (
            <img
              src={src}
              alt={title}
              onClick={() => setZoom((z) => !z)}
              className={zoom ? "max-w-none cursor-zoom-out" : "mx-auto max-h-[calc(92dvh-72px)] w-auto max-w-full cursor-zoom-in object-contain"}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
