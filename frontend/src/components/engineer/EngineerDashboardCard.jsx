function EngineerDashboardCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-4 shadow-lg shadow-slate-950/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
          {label}
        </p>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-[#F8FAFC]">{value}</p>
      {helper && <p className="mt-1 text-sm text-[#94A3B8]">{helper}</p>}
    </div>
  );
}

export default EngineerDashboardCard;
