import { Link } from "react-router-dom";
import { CalendarDays, MapPin, UserCog } from "lucide-react";
import StatusBadge from "../citizen/StatusBadge.jsx";
import { formatComplaintLocation } from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Not available";

function AssignedComplaintCard({ complaint, compact = false }) {
  return (
    <Link
      to={`/engineer/complaints/${complaint._id}`}
      className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-lg shadow-slate-950/10 transition-all duration-200 hover:-translate-y-1 hover:border-[#F97316]/35 hover:shadow-xl hover:shadow-slate-950/20"
    >
      {complaint.image ? (
        <img
          src={complaint.image}
          alt={complaint.title}
          className={`${compact ? "h-40" : "h-48"} w-full object-cover`}
        />
      ) : (
        <div
          className={`flex ${compact ? "h-40" : "h-48"} items-center justify-center bg-[#0F172A] text-sm text-[#94A3B8]`}
        >
          No image available
        </div>
      )}

      <div className="space-y-4 p-5">
        <div>
          <h2 className="line-clamp-2 font-semibold text-[#F8FAFC]">
            {complaint.title || "Untitled complaint"}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#94A3B8]">
            {complaint.description || "No description provided."}
          </p>
        </div>

        <div className="space-y-2 text-sm text-[#CBD5E1]">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />
            <span className="line-clamp-1">
              {formatComplaintLocation(complaint.location)}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />
            <span>{formatDate(complaint.createdAt)}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
          <StatusBadge status={complaint.status} />
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#CBD5E1]">
            <UserCog className="h-3.5 w-3.5 shrink-0 text-[#F97316]" aria-hidden="true" />
            <span className="truncate">
              {complaint.assignedEngineer?.name || "Assigned to you"}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#F97316] px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-orange-500">
            View Details
          </span>
          <span className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/[0.08] px-3 py-2 text-sm font-semibold text-[#F8FAFC] transition group-hover:border-[#38BDF8]/40">
            Update Status
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AssignedComplaintCard;
