import Link from "next/link";

import { documentCases } from "@/lib/mock-data";

const caseTints: Record<string, string> = {
  "after-labor-and-capital": "from-slate-100 to-emerald-50",
  "institutional-memory-infrastructure": "from-stone-100 to-amber-50",
  "ai-ready-regions": "from-zinc-100 to-slate-50",
  "civic-provenance-ledger": "from-blue-100 to-stone-100"
};

export function CaseSwitcher({
  currentSlug,
  destination,
  title,
  description
}: {
  currentSlug: string;
  destination: "document" | "passport";
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="eyebrow">Sample Corpus</p>
        <h2 className="mt-2 text-3xl text-slate-950">{title}</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {documentCases.map((item) => {
          const href = destination === "document" ? `/documents/${item.slug}` : `/passport/${item.slug}`;
          const isCurrent = item.slug === currentSlug;

          return (
            <Link
              key={item.slug}
              href={href}
              className={`panel block overflow-hidden p-5 hover:-translate-y-0.5 ${
                isCurrent ? "border-black/20 bg-white" : ""
              }`}
            >
              <div
                className={`mb-4 rounded-2xl bg-gradient-to-br ${caseTints[item.slug]} p-4 text-sm text-slate-700`}
              >
                <p className="font-semibold text-slate-900">{item.profileLabel}</p>
                <p className="mt-1 leading-6">{item.previewNote}</p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.type}</p>
              <h3 className="mt-2 text-2xl leading-tight text-slate-950">{item.shortTitle}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.landingSummary}</p>
              <div className="mt-4 inline-flex items-center rounded-full border border-black/10 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-700">
                {isCurrent ? "Current view" : destination === "document" ? "Open text" : "Open passport"}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
