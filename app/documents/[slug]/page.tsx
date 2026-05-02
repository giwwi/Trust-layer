import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseSwitcher } from "@/components/case-switcher";
import { documentCases, getDocumentBySlug } from "@/lib/mock-data";

const signalStyles = {
  steady: "border-emerald-900/10 bg-emerald-50 text-emerald-950",
  promising: "border-sky-900/10 bg-sky-50 text-sky-950",
  fragile: "border-amber-900/10 bg-amber-50 text-amber-950",
  contested: "border-rose-900/10 bg-rose-50 text-rose-950"
};

export function generateStaticParams() {
  return documentCases.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const document = getDocumentBySlug(params.slug);

  return {
    title: document ? `${document.shortTitle} text` : "Document view"
  };
}

export default function DocumentPage({ params }: { params: { slug: string } }) {
  const document = getDocumentBySlug(params.slug);

  if (!document) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_360px]">
        <div className="space-y-6">
          <section className="panel-strong p-8 lg:p-10">
            <p className="eyebrow">{document.profileLabel}</p>
            <h1 className="mt-3 text-4xl leading-tight text-slate-950 md:text-5xl">{document.title}</h1>
            <p className="mt-5 max-w-3xl text-xl leading-8 text-slate-600">{document.deck}</p>
            <div className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-slate-900/10 bg-white/70 p-4">
                <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Author</p>
                <p className="mt-2 text-base text-slate-900">{document.author}</p>
              </div>
              <div className="rounded-[1.35rem] border border-slate-900/10 bg-white/70 p-4">
                <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Document type</p>
                <p className="mt-2 text-base text-slate-900">{document.type}</p>
              </div>
              <div className="rounded-[1.35rem] border border-slate-900/10 bg-white/70 p-4">
                <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Submission context</p>
                <p className="mt-2 text-base text-slate-900">{document.submissionContext}</p>
              </div>
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-slate-900/10 bg-slate-50/90 p-5 text-sm leading-7 text-slate-700">
              Trust Layer treats the decomposition below as an illustrative structured reading. It is a human-prepared
              mock example of assisted triage, not proof of reliable automatic interpretation.
            </div>
          </section>

          {document.textSections.map((section, index) => (
            <section key={section.heading} className="panel p-6 lg:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">Section {index + 1}</p>
                  <h2 className="mt-2 text-3xl text-slate-950">{section.heading}</h2>
                </div>
                <span className="pill">{section.zone}</span>
              </div>
              <p className="mt-4 text-base font-semibold leading-7 text-slate-700">{section.summary}</p>
              <div className="mt-5 max-w-prosewide space-y-4 text-lg leading-8 text-slate-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <section className="panel p-6">
            <p className="eyebrow">Illustrative Structured Reading</p>
            <h2 className="mt-2 text-3xl text-slate-950">{document.shortTitle}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <div>
                <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">Probable central argument</p>
                <p className="mt-2 text-base text-slate-800">{document.overlay.centralArgument}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">Main claim zones</p>
                <div className="mt-3 space-y-3">
                  {document.overlay.mainClaimZones.map((item) => (
                    <div key={item.label} className="rounded-[1.25rem] border border-slate-900/10 bg-white/70 p-4">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">Evidence-bearing areas</p>
                <div className="mt-3 space-y-3">
                  {document.overlay.evidenceAreas.map((item) => (
                    <div key={item.label} className="rounded-[1.25rem] border border-slate-900/10 bg-white/70 p-4">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">Interpretive uncertainty zones</p>
                <div className="mt-3 space-y-3">
                  {document.overlay.uncertaintyZones.map((item) => (
                    <div key={item.label} className="rounded-[1.25rem] border border-slate-900/10 bg-white/70 p-4">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">Suggested review focus</p>
                <div className="mt-3 space-y-3">
                  {document.overlay.reviewFocus.map((item) => (
                    <div key={item} className="rounded-[1.25rem] border border-slate-900/10 bg-white/70 p-4">
                      <p className="text-sm leading-6 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">Illustrative review map</p>
                <div className="mt-3 space-y-3">
                  {document.overlay.reviewMap.map((item) => (
                    <div key={item.step} className="rounded-[1.25rem] border border-slate-900/10 bg-white/70 p-4">
                      <p className="font-semibold text-slate-900">{item.step}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.emphasis}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-slate-900/10 bg-slate-50/90 p-4">
                <p className="font-semibold uppercase tracking-[0.16em] text-slate-500">Review status</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{document.overlay.reviewStatus}</p>
              </div>
            </div>
          </section>

          <section className="panel p-6">
            <p className="eyebrow">Quick Signals</p>
            <div className="mt-4 grid gap-3">
              {document.overlay.quickSignals.map((signal) => (
                <div
                  key={signal.label}
                  className={`rounded-[1.25rem] border px-4 py-3 ${signalStyles[signal.tone]}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">{signal.label}</p>
                  <p className="mt-2 text-base font-semibold">{signal.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-6">
            <p className="eyebrow">Next Views</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={`/passport/${document.slug}`}
                className="rounded-full border border-slate-900/10 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
              >
                Open trust passport
              </Link>
              <Link
                href="/reviewer-workflow"
                className="rounded-full border border-slate-900/10 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:border-slate-900/20"
              >
                Open reviewer workflow
              </Link>
            </div>
          </section>
        </aside>
      </section>

      <CaseSwitcher
        currentSlug={document.slug}
        destination="document"
        title="Compare the other sample texts"
        description="Useful cases and failure cases sit side by side in this prototype so the overlay does not only showcase comfortable wins."
      />
    </div>
  );
}
