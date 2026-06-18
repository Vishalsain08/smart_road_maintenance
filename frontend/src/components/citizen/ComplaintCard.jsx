import { CalendarDays, MapPin, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { formatComplaintCategory } from "../../utils/complaintConstants.js";
import StatusBadge from "./StatusBadge.jsx";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Not available";

function ComplaintCard({ complaint }) {
  return (
    <Link
      to={`/citizen/complaints/${complaint._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F97316]/25"
    >
      <div className="h-44 bg-[#0F172A]">
        {complaint.image ? (
          <img
            src={complaint.image}
            alt={complaint.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#94A3B8]">
            No image available
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-2.5 py-1 text-xs font-semibold text-[#FDBA74]">
              {formatComplaintCategory(complaint.category)}
            </span>
            <h2 className="mt-3 line-clamp-2 text-base font-semibold text-[#F8FAFC] transition-colors duration-200 group-hover:text-[#FDBA74]">
              {complaint.title}
            </h2>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        {complaint.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#94A3B8]">
            {complaint.description}
          </p>
        )}

        <div className="mt-4 space-y-2 text-sm text-[#94A3B8]">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
            <span className="line-clamp-1">
              {complaint.location?.address || "Location not available"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#38BDF8]" />
            <span>{formatDate(complaint.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 shrink-0 text-[#38BDF8]" />
            <span>
              {complaint.assignedEngineer?.name
                ? `Assigned to ${complaint.assignedEngineer.name}`
                : "Engineer not assigned"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ComplaintCard;
