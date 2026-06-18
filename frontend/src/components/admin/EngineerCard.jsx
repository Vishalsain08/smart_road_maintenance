import { Mail, UserCog, Wrench } from "lucide-react";

function EngineerCard({ engineer }) {
  const assignedCount = engineer.assignedComplaintsCount || 0;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10 transition-all duration-200 hover:-translate-y-1 hover:border-[#F97316]/35">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
          <UserCog className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-[#F8FAFC]">
            {engineer.name}
          </h2>
          <p className="mt-2 flex items-center gap-2 truncate text-sm text-[#94A3B8]">
            <Mail className="h-4 w-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />
            <span className="truncate">{engineer.email}</span>
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
          <Wrench className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
          Assigned complaints
        </p>
        <p className="mt-2 text-3xl font-bold text-[#F8FAFC]">{assignedCount}</p>
      </div>
    </div>
  );
}

export default EngineerCard;
