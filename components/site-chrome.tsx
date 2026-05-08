import Link from "next/link";
import type { ReactNode } from "react";

import { contestedDocumentSlug, defaultDocumentSlug } from "@/lib/mock-data";

const navigation = [
  { href: "/", label: "Home" },
  { href: `/documents/${defaultDocumentSlug}`, label: "Sample Text" },
  { href: `/review-note/${contestedDocumentSlug}`, label: "Review Note" },
  { href: "/reviewer-workflow", label: "Reviewer Workflow" },
  { href: "/limitations", label: "Limitations" }
];

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(246,242,234,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-start gap-4">
            <Link href="/" className="shrink-0">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 text-sm font-semibold tracking-[0.2em] text-slate-700">
                TL
              </span>
            </Link>
            <div>
              <Link href="/" className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                Trust Layer
              </Link>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                An illustrative prototype for bounded review overlays on analytical texts.
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm text-slate-700 hover:border-black/20 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">{children}</main>

      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>Trust Layer is a concept prototype for analytical text triage, not a truth engine or authorship detector.</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/documents/${defaultDocumentSlug}`} className="hover:text-slate-900">
              Sample text
            </Link>
            <Link href={`/review-note/${contestedDocumentSlug}`} className="hover:text-slate-900">
              Contested review note
            </Link>
            <Link href="/limitations" className="hover:text-slate-900">
              Limits
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
