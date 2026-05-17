import { Link } from "react-router-dom";

const features = [
  {
    title: "Geo-tagged Complaints",
    description:
      "Capture road issue details with location context so civic teams can verify the affected area quickly.",
  },
  {
    title: "Real-time Tracking",
    description:
      "Follow every report as it moves through review, assignment, repair, and resolution stages.",
  },
  {
    title: "Engineer Assignment",
    description:
      "Route verified complaints to responsible engineers for inspection and repair coordination.",
  },
  {
    title: "Resolution Image Upload",
    description:
      "Support completed repairs with final site images for clear and visible closure.",
  },
];

const steps = [
  {
    title: "Citizen",
    description: "Reports the road issue with essential details.",
  },
  {
    title: "Admin",
    description: "Reviews the complaint and assigns responsibility.",
  },
  {
    title: "Engineer",
    description: "Inspects, updates progress, and completes the repair.",
  },
  {
    title: "Resolved",
    description: "The complaint is closed with completion evidence.",
  },
];

function LandingPage() {
  return (
    <div className="overflow-hidden">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Civic issue reporting
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Smart Road Maintenance System
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Report damaged roads, potholes, and maintenance issues through a
              clean civic portal built to help teams review, assign, and resolve
              problems faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Report Issue
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-emerald-700">
                Public reporting flow
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Clear reporting, assignment, and resolution
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                The system keeps the public-facing experience simple while
                preparing each report for efficient review by maintenance teams.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    Submit accurate issue details
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    Track repair progress clearly
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    Close reports with proof of completion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Built for road maintenance coordination
          </h2>
          <p className="mt-3 text-slate-600">
            Focused tools for citizens, administrators, and engineers involved
            in resolving road issues.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Citizen to Admin to Engineer to Resolved
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-slate-950 px-6 py-12 text-center shadow-sm sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
            Start reporting smarter
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white">
            Ready to report or track a road issue?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Register to submit a complaint, or login to continue tracking road
            maintenance progress.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
