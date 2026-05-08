"use client";

import { useState } from "react";

import { contestedDocumentSlug, documentCases, reviewModes, type ReviewModeId } from "@/lib/mock-data";

export function WorkflowSimulator() {
  const [selectedSlug, setSelectedSlug] = useState(contestedDocumentSlug);
  const [selectedMode, setSelectedMode] = useState<ReviewModeId>("evidence");

  const currentDocument = documentCases.find((item) => item.slug === selectedSlug) ?? documentCases[0];
  const currentMode = reviewModes.find((item) => item.id === selectedMode) ?? reviewModes[0];

  const mainFields = [
    {
      label: "What kind of text is this, in your reading?",
      value: `${currentDocument.type}. ${currentDocument.deck}`,
      rows: 4
    },
    {
      label: "What is strongest in this text?",
      value: currentDocument.workflow.strongest,
      rows: 4
    },
    {
      label: "What is weakest in this text?",
      value: currentDocument.workflow.weakest,
      rows: 4
    },
    {
      label: "What is this text trying to do?",
      value: currentDocument.workflow.tryingToDo,
      rows: 4
    },
    {
      label: "Where does your assessment remain uncertain?",
      value: currentDocument.workflow.uncertainty,
      rows: 4
    },
    {
      label: "What would change your assessment?",
      value: currentDocument.workflow.changeAssessment,
      rows: 4
    },
    {
      label: "Would you recommend deeper review? In what context?",
      value: currentDocument.workflow.deeperReview,
      rows: 4
    }
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <section className="panel p-6">
          <p className="eyebrow">Sample Document</p>
          <h2 className="mt-2 text-2xl text-slate-950">Choose a review target</h2>
          <div className="mt-4 grid gap-3">
            {documentCases.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setSelectedSlug(item.slug)}
                className={`rounded-2xl border px-4 py-3 text-left ${
                  item.slug === selectedSlug
                    ? "border-slate-900/20 bg-white text-slate-950 shadow-soft"
                    : "border-slate-900/10 bg-white/60 text-slate-700 hover:border-slate-900/20 hover:bg-white/80"
                }`}
              >
                <p className="text-sm font-semibold">{item.shortTitle}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.profileLabel}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="panel p-6">
          <p className="eyebrow">Review Mode</p>
          <h2 className="mt-2 text-2xl text-slate-950">Select a reading posture</h2>
          <div className="mt-4 grid gap-3">
            {reviewModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                className={`rounded-2xl border px-4 py-3 text-left ${
                  mode.id === selectedMode
                    ? "border-slate-900/20 bg-white text-slate-950 shadow-soft"
                    : "border-slate-900/10 bg-white/60 text-slate-700 hover:border-slate-900/20 hover:bg-white/80"
                }`}
              >
                <p className="text-sm font-semibold">{mode.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{mode.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="panel p-6">
          <p className="eyebrow">Mode Guidance</p>
          <h2 className="mt-2 text-2xl text-slate-950">{currentMode.label}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{currentMode.description}</p>
          <div className="mt-4 space-y-3">
            {currentMode.focusPrompts.map((prompt) => (
              <div key={prompt} className="rounded-2xl border border-slate-900/10 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700">
                {prompt}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-amber-900/10 bg-amber-50/75 px-4 py-3 text-sm leading-6 text-amber-950">
            <span className="font-semibold">Watch for:</span> {currentMode.watchFor}
          </div>
        </section>

        <section className="panel p-6">
          <p className="eyebrow">Current Structured Reading</p>
          <h2 className="mt-2 text-2xl text-slate-950">{currentDocument.shortTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{currentDocument.overlay.centralArgument}</p>
          <div className="mt-4 rounded-2xl border border-slate-900/10 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700">
            Review remains interpretive and supports triage, not final judgment.
          </div>
        </section>
      </aside>

      <div key={`${selectedSlug}-${selectedMode}`} className="space-y-6">
        <section className="panel-strong p-8">
          <p className="eyebrow">Reviewer Workflow</p>
          <h1 className="mt-3 text-4xl text-slate-950">Structured review worksheet</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            This prototype treats review as an interpretive practice. The fields below help structure triage and
            disagreement without claiming to produce a final judgment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="pill">{currentDocument.profileLabel}</span>
            <span className="pill">{currentDocument.type}</span>
            <span className="pill">{currentMode.label}</span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {mainFields.map((field) => (
            <div key={field.label} className="panel p-5">
              <label className="block text-sm font-semibold text-slate-900">{field.label}</label>
              <textarea className="text-field mt-3" rows={field.rows} defaultValue={field.value} />
            </div>
          ))}
        </section>

        <section className="panel p-6">
          <p className="eyebrow">Secondary Evaluation</p>
          <h2 className="mt-2 text-3xl text-slate-950">Interpretive dimensions</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {currentDocument.workflow.secondary.map((metric) => {
              const isPriority = currentMode.priorityDimensions.includes(metric.label);

              return (
                <div
                  key={metric.label}
                  className={`rounded-[1.35rem] border p-4 ${
                    isPriority ? "border-slate-900/20 bg-white shadow-soft" : "border-slate-900/10 bg-white/70"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{metric.label}</p>
                  <p className="mt-2 text-lg text-slate-950">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{metric.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="panel p-5">
            <label className="block text-sm font-semibold text-slate-900">
              Would you contest the current structured reading?
            </label>
            <textarea className="text-field mt-3" rows={4} defaultValue={currentDocument.workflow.contestStructuredReading} />
          </div>
          <div className="panel p-5">
            <label className="block text-sm font-semibold text-slate-900">Should this review note be revised?</label>
            <textarea className="text-field mt-3" rows={4} defaultValue={currentDocument.workflow.reviseReviewNote} />
          </div>
        </section>
      </div>
    </div>
  );
}
