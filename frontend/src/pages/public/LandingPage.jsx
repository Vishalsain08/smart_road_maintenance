import {
  ArrowRight,
  ClipboardCheck,
  Construction,
  FileText,
  MapPinned,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: FileText,
    title: "Report Road Issues",
    description:
      "Citizens can submit structured complaints with issue details and location context for faster review.",
  },
  {
    icon: UserCheck,
    title: "Engineer Assignment",
    description:
      "Admins can route approved complaints to responsible field engineers for coordinated action.",
  },
  {
    icon: ClipboardCheck,
    title: "Faster Complaint Resolution",
    description:
      "Clear complaint records help teams move road maintenance work from review to completion efficiently.",
  },
];

const steps = [
  {
    icon: FileText,
    title: "Citizen Reports Issue",
    description: "A citizen submits the damaged road details through the portal.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Reviews Complaint",
    description: "The admin verifies the complaint and prepares it for action.",
  },
  {
    icon: UserCheck,
    title: "Engineer Gets Assigned",
    description: "A field engineer receives responsibility for the repair work.",
  },
  {
    icon: Wrench,
    title: "Road Issue Resolved",
    description: "The issue is closed after the repair workflow is completed.",
  },
];

function DashboardIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-xl rounded-2xl border border-white/[0.08] bg-[#1E293B] p-4 shadow-lg shadow-slate-950/20">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <p className="text-sm font-semibold text-[#F8FAFC]">Road Fix Console</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Complaint operations overview</p>
        </div>
        <span className="rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-3 py-1 text-xs font-semibold text-[#38BDF8]">
          Active
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-3">
          {[
            ["Pothole on Ring Road", "Under Review", "#F97316"],
            ["Damaged divider lane", "Assigned", "#38BDF8"],
            ["Broken shoulder edge", "Resolved", "#22C55E"],
          ].map(([title, status, color]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{title}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">Ward 14 maintenance zone</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: `${color}22`, color }}
                >
                  {status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
              <MapPinned className="h-4 w-4 text-[#F97316]" />
              Zone Map
            </div>
            <div className="relative h-36 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#162033]">
              <div className="absolute left-5 top-5 h-16 w-24 rounded-xl border border-[#38BDF8]/20" />
              <div className="absolute bottom-4 right-4 h-20 w-20 rounded-xl border border-[#F97316]/20" />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316]" />
              <div className="absolute inset-x-0 top-16 h-px bg-white/10" />
              <div className="absolute inset-y-0 left-20 w-px bg-white/10" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4">
            <p className="text-sm font-semibold text-[#F8FAFC]">Engineer Assignment</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F97316]/15 text-sm font-bold text-[#F97316]">
                RK
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC]">Rahul Kumar</p>
                <p className="text-xs text-[#94A3B8]">Road maintenance engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="overflow-hidden bg-[#0F172A]">
      <section className="relative border-b border-white/[0.08]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
          <div className="relative flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full border border-[#F97316]/25 bg-[#1E293B] px-4 py-2 text-sm font-semibold text-[#FDBA74]">
              Digital Civic Infrastructure
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl">
              Smart Road Maintenance System
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#CBD5E1]">
              Report and resolve road maintenance issues through a centralized
              platform built for citizens, administrators, and field engineers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-500"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl border border-[#F97316]/50 px-5 py-3 text-sm font-semibold text-[#F8FAFC] transition-colors duration-200 hover:bg-[#F97316]/10"
              >
                Report Issue
              </Link>
            </div>
          </div>

          <div className="relative flex items-center">
            <DashboardIllustration />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#F97316]">
            Platform Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Platform Features
          </h2>
          <p className="mt-3 text-[#94A3B8]">
            Focused tools for a cleaner complaint lifecycle and better civic
            maintenance coordination.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 shadow-sm transition-colors duration-200 hover:border-[#F97316]/30"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[#F8FAFC]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-[#111827]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#F97316]">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#F8FAFC]">
              How It Works
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-[calc(100%-0.25rem)] top-10 hidden h-px w-5 bg-[#F97316]/70 md:block" />
                  )}
                  <div className="h-full rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-[#F8FAFC]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#F97316]/20 bg-[#9A3412] px-6 py-12 text-center shadow-lg shadow-slate-950/20 sm:px-10">
          <Construction className="mx-auto h-10 w-10 text-white" aria-hidden="true" />
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white">
            Help Build Better Roads
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-orange-50">
            Report road issues in your area and help improve local infrastructure
            through a simple, accountable civic platform.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#9A3412] transition-colors duration-200 hover:bg-orange-50"
            >
              Report Complaint
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              Join Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
