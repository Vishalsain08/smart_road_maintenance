import { AlertCircle, CheckCircle2, ClipboardList } from "lucide-react";

const toneStyles = {
  orange: {
    icon: ClipboardList,
    className: "bg-[#F97316]/10 text-[#F97316]",
  },
  yellow: {
    icon: AlertCircle,
    className: "bg-amber-400/10 text-amber-300",
  },
  green: {
    icon: CheckCircle2,
    className: "bg-emerald-400/10 text-emerald-300",
  },
};

function DashboardCard({ label, value, tone = "orange" }) {
  const toneConfig = toneStyles[tone] || toneStyles.orange;
  const Icon = toneConfig.icon;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F97316]/25">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#94A3B8]">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#F8FAFC]">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneConfig.className}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

export default DashboardCard;
