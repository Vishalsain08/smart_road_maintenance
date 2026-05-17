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

function AdminComplaintDetails({ complaint, onClose }) {
  if (!complaint) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Complaint Details
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {complaint.title}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {complaint.image ? (
              <img
                src={complaint.image}
                alt={complaint.title}
                className="h-72 w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-72 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                No image
              </div>
            )}

            <div>
              <h3 className="font-semibold text-slate-950">Description</h3>
              <p className="mt-2 leading-7 text-slate-600">
                {complaint.description}
              </p>
            </div>

            <ReadOnlyMap complaint={complaint} />
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 p-5">
              <StatusBadge status={complaint.status} />
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Category</dt>
                  <dd className="mt-1 text-slate-950">
                    {formatComplaintCategory(complaint.category)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Citizen</dt>
                  <dd className="mt-1 text-slate-950">
                    {complaint.reportedBy?.name || "Unknown"}
                  </dd>
                  <dd className="text-slate-500">
                    {complaint.reportedBy?.email || "No email"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Engineer</dt>
                  <dd className="mt-1 text-slate-950">
                    {complaint.assignedEngineer?.name || "Not assigned"}
                  </dd>
                  <dd className="text-slate-500">
                    {complaint.assignedEngineer?.email || ""}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Created</dt>
                  <dd className="mt-1 text-slate-950">
                    {formatDate(complaint.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-950">Resolution</h3>
              {complaint.resolutionImage ? (
                <img
                  src={complaint.resolutionImage}
                  alt="Resolution"
                  className="mt-3 h-48 w-full rounded-lg object-cover"
                />
              ) : (
                <p className="mt-2 text-sm text-slate-600">
                  No resolution image uploaded yet.
                </p>
              )}
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {complaint.resolutionNotes || "No resolution notes available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminComplaintDetails;
