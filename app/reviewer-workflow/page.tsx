import { WorkflowSimulator } from "@/components/workflow-simulator";

export default function ReviewerWorkflowPage() {
  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <p className="eyebrow">Reviewer Workflow</p>
        <h1 className="mt-2 text-5xl text-slate-950">A structured worksheet for bounded review</h1>
        <p className="mt-5 text-xl leading-8 text-slate-600">
          This screen illustrates how a reviewer might move through a text without collapsing interpretation into a
          score. The workflow supports triage, contestation, and revision; it does not issue a final judgment.
        </p>
      </section>
      <WorkflowSimulator />
    </div>
  );
}
