import { Link } from "react-router-dom";
import ReadOnlyMap from "../citizen/ReadOnlyMap.jsx";
import StatusBadge from "../citizen/StatusBadge.jsx";
import { formatComplaintCategory } from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Not available";

function AssignedComplaintCard({ complaint }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {complaint.image ? (
        <img
          src={complaint.image}
          alt={complaint.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-500">
          No image available
        </div>
      )}

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-950">{complaint.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {formatComplaintCategory(complaint.category)} - {formatDate(complaint.createdAt)}
            </p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="overflow-hidden rounded-md">
          <ReadOnlyMap complaint={complaint} heightClass="h-48" />
        </div>

        <Link
          to={`/engineer/complaints/${complaint._id}`}
          className="inline-flex w-full justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default AssignedComplaintCard;
