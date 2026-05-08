import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseSwitcher } from "@/components/case-switcher";
import { contestedDocumentSlug, documentCases, getDocumentBySlug } from "@/lib/mock-data";

const toneStyles = {
  steady: "text-emerald-900",
  promising: "text-sky-900",
  fragile: "text-amber-900",
  contested: "text-rose-900"
};

const fillStyles = {
  steady: "from-emerald-600 to-emerald-500",
  promising: "from-sky-600 to-slate-500",
  fragile: "from-amber-600 to-orange-500",
  contested: "from-rose-600 to-stone-500"
};

export function generateStaticParams() {
  return documentCases.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const document = getDocumentBySlug(params.slug);

  return {
    title: document ? `${document.shortTitle} review note` : "Trust Layer review note"
  };
}

export default function ReviewNotePage({ params }: { params: { slug: string } }) {
  const document = getDocumentBySlug(params.slug);

  if (!document) {
    notFound();
  }

  const isContested = document.slug === contestedDocumentSlug;

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel-strong subtle-grid p-8 lg:p-10">
          <p className="eyebrow">Review Note</p>
          <h1 className="mt-3 text-4xl leading-tight text-slate-950 md:text-5xl">{document.title}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-slate-600">{document.reviewNote.currentSynthesis}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-900/10 bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Title and metadata</p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Author:</span> {document.author}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Type:</span> {document.type}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Context:</span> {document.submissionContext}
                </p>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-slate-900/10 bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Current review note posture</p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <p>No single overall score.</p>
                <p>Review state is provisional and revisable.</p>
                <p>Disagreement stays visible where it matters.</p>
              </div>
            </div>
          </div>
          {isContested ? (
            <div className="mt-6 rounded-[1.5rem] border border-rose-900/10 bg-rose-50/80 p-5 text-base leading-7 text-rose-950">
              No stable review state exists yet. The current synthesis remains deliberately unresolved pending
              domain-specific follow-up.
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <section className="panel p-6">
            <p className="eyebrow">Suggested Reading Stance</p>
            <h2 className="mt-2 text-3xl text-slate-950">How to hold this text</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{document.reviewNote.readingStance}</p>
          </section>

          <section className="panel p-6">
            <p className="eyebrow">What Needs Further Verification</p>
            <div className="mt-4 space-y-3">
              {document.reviewNote.verificationNeeds.map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-slate-900/10 bg-white/70 p-4 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-6">
            <p className="eyebrow">Review History</p>
            <div className="mt-4 space-y-4">
              {document.reviewNote.reviewHistory.map((entry) => (
                <div key={`${entry.stage}-${entry.date}`} className="rounded-[1.25rem] border border-slate-900/10 bg-white/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{entry.stage}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{entry.date}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{entry.actor}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{entry.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <p className="eyebrow">Strengths</p>
          <h2 className="mt-2 text-3xl text-slate-950">What currently holds up best</h2>
          <div className="mt-5 space-y-3">
            {document.reviewNote.strengths.map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-emerald-900/10 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-950">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <p className="eyebrow">Weaknesses</p>
          <h2 className="mt-2 text-3xl text-slate-950">What needs checking</h2>
          <div className="mt-5 space-y-3">
            {document.reviewNote.weaknesses.map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-amber-900/10 bg-amber-50/80 p-4 text-sm leading-6 text-amber-950">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-6 lg:p-8">
        <p className="eyebrow">Review Dimensions</p>
        <h2 className="mt-2 text-4xl text-slate-950">Provisional dimensions, not a single verdict</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {document.reviewNote.dimensions.map((dimension) => (
            <div key={dimension.name} className="rounded-[1.5rem] border border-slate-900/10 bg-white/75 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-950">{dimension.name}</p>
                <p className={`text-sm font-semibold ${toneStyles[dimension.tone]}`}>{dimension.state}</p>
              </div>
              <div className="metric-track mt-4">
                <div
                  className={`metric-fill bg-gradient-to-r ${fillStyles[dimension.tone]}`}
                  style={{ width: `${dimension.width}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{dimension.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-strong p-8 lg:p-10">
        <p className="eyebrow">Reviewer Disagreement</p>
        <h2 className="mt-2 text-4xl text-slate-950">Disagreement stays visible</h2>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">{document.reviewNote.disagreement}</p>
        {document.reviewNote.reviewerViews?.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {document.reviewNote.reviewerViews.map((view) => (
              <div key={view.reviewer} className="rounded-[1.75rem] border border-slate-900/10 bg-white/80 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{view.reviewer}</p>
                <h3 className="mt-2 text-3xl text-slate-950">{view.stance}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{view.summary}</p>
                <div className="mt-5 space-y-3">
                  {view.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-[1.25rem] border border-slate-900/10 bg-slate-50/80 p-4 text-sm leading-6 text-slate-700">
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-slate-900/10 bg-white/75 p-5 text-base leading-7 text-slate-700">
            No sharply conflicting reviewer positions are currently recorded for this sample. The review note remains
            provisional anyway, but disagreement is not the main active issue in this case.
          </div>
        )}
      </section>

      <CaseSwitcher
        currentSlug={document.slug}
        destination="reviewNote"
        title="Compare the other review notes"
        description="Each review note keeps the review state provisional, avoids a single score, and shows where deeper review still needs to happen."
      />
    </div>
  );
}
