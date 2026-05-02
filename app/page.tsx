import Link from "next/link";

import { contestedDocumentSlug, defaultDocumentSlug, documentCases } from "@/lib/mock-data";

const illustrationCards = [
  {
    title: "Structure early reading",
    body: "Map likely argument shape, evidence-bearing sections, and uncertainty zones before scarce reviewer attention gets spent."
  },
  {
    title: "Keep interpretation provisional",
    body: "Show decompositions and summaries as illustrative and contestable rather than as reliable automated understanding."
  },
  {
    title: "Preserve disagreement",
    body: "Make it visible when reviewers diverge, instead of forcing a false single trust state."
  },
  {
    title: "Route deeper review",
    body: "Help decide which analytical texts deserve specialist follow-up, and which do not."
  }
];

const notItems = [
  "It is not a universal trust system for all longform writing.",
  "It does not detect AI authorship.",
  "It does not determine truth or settle legitimacy.",
  "It does not turn mock overlays into reliable automated interpretation.",
  "It does not remove interpretive disagreement.",
  "It does not solve legitimacy by interface design alone."
];

const caseTints: Record<string, string> = {
  "municipal-heat-resilience": "from-slate-100 to-emerald-50",
  "institutional-memory-infrastructure": "from-stone-100 to-amber-50",
  "ai-ready-regions": "from-zinc-100 to-slate-50",
  "civic-provenance-ledger": "from-blue-100 to-stone-100"
};

export default function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-20">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="panel-strong p-8 lg:p-12">
          <p className="eyebrow">Illustrative Concept Prototype</p>
          <h1 className="mt-4 max-w-4xl text-5xl leading-none text-slate-950 md:text-6xl">Trust Layer</h1>
          <p className="mt-5 max-w-3xl text-2xl leading-snug text-slate-700 md:text-3xl">
            A bounded review overlay for analytical texts in the age of AI overproduction.
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Analytical texts are now cheap to generate, expensive to read, and increasingly hard to triage
            responsibly. Trust Layer sketches one narrow response: a structured overlay for early-stage reading of
            research drafts, policy memos, white papers, analytical essays, and book proposals.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            It does not produce final judgments. It does not claim to solve legitimacy. It illustrates how a
            disciplined review layer might help readers slow down, narrow claims, and route attention more carefully.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
              View trust passport
            </Link>
            <Link
              href="/limitations"
              className="rounded-full border border-slate-900/10 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-900/20 hover:bg-white"
            >
              Read limitations
            </Link>
          </div>
        </div>

        <div className="panel subtle-grid p-8">
          <p className="eyebrow">Prototype Posture</p>
          <h2 className="mt-3 text-3xl text-slate-950">For analytical texts only</h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-slate-600">
            <p>
              Trust Layer is scoped to research drafts, policy memos, white papers, analytical essays, and book
              proposals. It is not framed here as a general-purpose system for all longform writing.
            </p>
            <p>
              The overlays and passports in this demo are human-prepared mock examples. They are meant to illustrate
              bounded triage, visible uncertainty, and reviewer disagreement.
            </p>
            <div className="rounded-[1.5rem] border border-slate-900/10 bg-white/75 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Core caution</p>
              <p className="mt-2 text-base leading-7 text-slate-700">
                Decomposition and summaries can be useful scaffolds while still being provisional, revisable, and open
                to contest.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-3xl">
          <p className="eyebrow">What It Illustrates</p>
          <h2 className="mt-2 text-4xl text-slate-950">A review overlay, not a verdict machine</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The prototype focuses on a smaller question: how to make early-stage review of analytical texts more
            legible without pretending that interface design can dissolve epistemic difficulty.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {illustrationCards.map((card) => (
            <div key={card.title} className="panel p-6">
              <h3 className="text-2xl text-slate-950">{card.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-2xl">
          <p className="eyebrow">What It Is Not</p>
          <h2 className="mt-2 text-4xl text-slate-950">Boundaries matter more than branding here</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Trust Layer is deliberately narrow. It is not presented as proof that a clean interface can stabilize
            legitimacy or automate warranted trust.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {notItems.map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-slate-900/10 bg-white/70 p-4 text-base leading-7 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="sample-cases" className="space-y-6">
        <div className="max-w-3xl">
          <p className="eyebrow">Sample Cases</p>
          <h2 className="mt-2 text-4xl text-slate-950">Useful cases, weak cases, and unstable ones</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The sample corpus includes a strong policy memo, a conceptually rich but speculative fragment, a polished
            shallow white paper, and a contested essay-proposal where no stable trust profile exists yet.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {documentCases.map((item) => (
            <div key={item.slug} className="panel overflow-hidden p-6">
              <div className={`rounded-[1.75rem] bg-gradient-to-br ${caseTints[item.slug]} p-5`}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">{item.profileLabel}</p>
                <h3 className="mt-2 text-3xl text-slate-950">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-700">{item.previewNote}</p>
              </div>
              <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-slate-900">Type</p>
                  <p className="mt-1">{item.type}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Author</p>
                  <p className="mt-1">{item.author}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Signal</p>
                  <p className="mt-1">{item.landingSummary}</p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-600">{item.deck}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/documents/${item.slug}`}
                  className="rounded-full border border-slate-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-900/20"
                >
                  Open text
                </Link>
                <Link
                  href={`/passport/${item.slug}`}
                  className="rounded-full border border-slate-900/10 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-900/20 hover:bg-white"
                >
                  Open passport
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
