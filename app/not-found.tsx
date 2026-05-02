import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <section className="panel-strong max-w-2xl p-10 text-center">
        <p className="eyebrow">Not Found</p>
        <h1 className="mt-3 text-4xl text-slate-950">This prototype view does not exist.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Trust Layer only includes a bounded set of mock routes for the sample analytical texts in this prototype.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-full border border-slate-900/10 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-900/20"
        >
          Return to the landing page
        </Link>
      </section>
    </div>
  );
}
