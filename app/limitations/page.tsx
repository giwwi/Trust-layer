import Link from "next/link";

import { contestedDocumentSlug, defaultDocumentSlug } from "@/lib/mock-data";

const limitations = [
  {
    title: "Cannot determine truth",
    body: "A structured overlay can help readers locate claims, evidence, and uncertainty, but it cannot settle whether a text is true."
  },
  {
    title: "Cannot remove interpretive disagreement",
    body: "Reasonable reviewers can still diverge on what a text is doing, what it implies, and how much weight its evidence should carry."
  },
  {
    title: "Cannot replace domain expertise",
    body: "Serious review of analytical texts still requires people who understand the field, methods, and stakes in question."
  },
  {
    title: "Cannot guarantee fair allocation of reviewer attention",
    body: "Interfaces can help route attention, but they cannot ensure that scarce human review is distributed justly or wisely."
  },
  {
    title: "Cannot fully prevent strategic adaptation by authors",
    body: "Once authors know what a review layer rewards, some will learn to perform legibility without increasing substance."
  },
  {
    title: "Cannot reliably decompose every kind of text",
    body: "Some analytical texts are unstable, hybrid, or ambiguous in ways that resist neat segmentation into claims, evidence, and uncertainty zones."
  },
  {
    title: "Cannot solve legitimacy by interface design alone",
    body: "Legitimacy depends on institutions, norms, accountability, and expertise. A cleaner screen does not resolve those deeper conditions."
  },
  {
    title: "Cannot eliminate reviewer bias or epistemic bubbles",
    body: "Review overlays can still reproduce the assumptions, blind spots, and social filters of the people and institutions using them."
  }
];

export default function LimitationsPage() {
  return (
    <div className="space-y-12">
      <section className="panel-strong p-8 lg:p-10">
        <p className="eyebrow">Boundaries</p>
        <h1 className="mt-3 text-5xl text-slate-950">What Trust Layer cannot do</h1>
        <p className="mt-5 max-w-4xl text-xl leading-8 text-slate-600">
          The point of this prototype is not to claim that review friction disappears if we add a cleaner interface. It
          is to show how a bounded overlay might support early reading of analytical texts while keeping its own limits
          explicit.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {limitations.map((item) => (
          <div key={item.title} className="panel p-6">
            <h2 className="text-3xl text-slate-950">{item.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="panel p-8">
        <p className="eyebrow">Prototype Use</p>
        <h2 className="mt-2 text-4xl text-slate-950">Why build it anyway?</h2>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">
          Because even limited tools can help readers slow down, separate strong cases from weak ones, and keep
          disagreement visible instead of burying it under polished confidence.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/documents/${defaultDocumentSlug}`}
            className="rounded-full border border-slate-900/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Open sample text
          </Link>
          <Link
            href={`/passport/${contestedDocumentSlug}`}
            className="rounded-full border border-slate-900/10 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-900/20"
          >
            See contested passport
          </Link>
        </div>
      </section>
    </div>
  );
}
