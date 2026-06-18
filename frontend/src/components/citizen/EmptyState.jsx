import { Construction } from "lucide-react";
import { Link } from "react-router-dom";

function EmptyState({
  title = "Nothing here yet",
  message = "Once you add records, they will appear here.",
  actionLabel,
  actionTo,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
        <Construction className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[#F8FAFC]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#94A3B8]">
        {message}
      </p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 inline-flex rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-500"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
