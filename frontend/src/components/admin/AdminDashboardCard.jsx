function AdminDashboardCard({ label, value, helper, tone = "emerald" }) {
  const tones = {
    emerald: "border-[#F97316]/25 bg-[#F97316]/10 text-[#FDBA74]",
    yellow: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    blue: "border-sky-400/25 bg-sky-400/10 text-sky-200",
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    slate: "border-white/[0.08] bg-[#0F172A] text-[#CBD5E1]",
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-sm">
      <div
        className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold ${
          tones[tone] || tones.emerald
        }`}
      >
        {String(label).slice(0, 1)}
      </div>
      <p className="text-sm font-medium text-[#94A3B8]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#F8FAFC]">{value}</p>
      {helper && <p className="mt-2 text-xs text-[#94A3B8]">{helper}</p>}
    </div>
  );
}

export default AdminDashboardCard;
