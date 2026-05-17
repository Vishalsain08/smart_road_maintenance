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
      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="aspect-[16/10] bg-slate-100">
        {complaint.image ? (
          <img
            src={complaint.image}
            alt={complaint.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-base font-semibold text-slate-950 group-hover:text-emerald-700">
            {complaint.title}
          </h2>
          <StatusBadge status={complaint.status} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>{formatComplaintCategory(complaint.category)}</span>
          <span>{formatDate(complaint.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default ComplaintCard;
