import StatusBadge from "../citizen/StatusBadge.jsx";
import {
  COMPLAINT_STATUSES,
  formatComplaintCategory,
  formatComplaintLocation,
  normalizeComplaintStatus,
} from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Not available";

function ComplaintTable({
  complaints,
  onView,
  onAssign,
  onStatusChange,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Complaint",
                "Category",
                "Status",
                "Location",
                "Citizen",
                "Engineer",
                "Created",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {complaint.image ? (
                      <img
                        src={complaint.image}
                        alt={complaint.title}
                        className="h-12 w-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded-md bg-slate-100" />
                    )}
                    <span className="max-w-56 font-semibold text-slate-950">
                      {complaint.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {formatComplaintCategory(complaint.category)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={complaint.status} />
                </td>
                <td className="max-w-64 px-4 py-4 text-sm text-slate-600">
                  <span className="line-clamp-2">
                    {formatComplaintLocation(complaint.location)}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {complaint.reportedBy?.name || "Unknown"}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {complaint.assignedEngineer?.name || "Unassigned"}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {formatDate(complaint.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button className="text-sm font-semibold text-emerald-700" onClick={() => onView(complaint)}>
                      View
                    </button>
                    <button className="text-sm font-semibold text-blue-700" onClick={() => onAssign(complaint)}>
                      Assign
                    </button>
                    <select
                      value={normalizeComplaintStatus(complaint.status)}
                      onChange={(event) =>
                        onStatusChange(complaint, event.target.value)
                      }
                      className="rounded border border-slate-300 px-2 py-1 text-xs"
                    >
                      {COMPLAINT_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <button className="text-sm font-semibold text-red-700" onClick={() => onDelete(complaint)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex gap-3">
              {complaint.image && (
                <img
                  src={complaint.image}
                  alt={complaint.title}
                  className="h-20 w-24 rounded-md object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-slate-950">
                  {complaint.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {formatComplaintCategory(complaint.category)}
                </p>
                <div className="mt-2">
                  <StatusBadge status={complaint.status} />
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <p>Citizen: {complaint.reportedBy?.name || "Unknown"}</p>
              <p>Engineer: {complaint.assignedEngineer?.name || "Unassigned"}</p>
              <p>Created: {formatDate(complaint.createdAt)}</p>
              <p>Location: {formatComplaintLocation(complaint.location)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="text-sm font-semibold text-emerald-700" onClick={() => onView(complaint)}>
                View
              </button>
              <button className="text-sm font-semibold text-blue-700" onClick={() => onAssign(complaint)}>
                Assign
              </button>
              <button className="text-sm font-semibold text-red-700" onClick={() => onDelete(complaint)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplaintTable;
