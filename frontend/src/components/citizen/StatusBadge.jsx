import { normalizeComplaintStatus } from "../../utils/complaintConstants.js";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 ring-blue-200",
  resolved: "bg-green-100 text-green-800 ring-green-200",
};

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  resolved: "Resolved",
};

function StatusBadge({ status = "pending" }) {
  const normalizedStatus = normalizeComplaintStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        statusStyles[normalizedStatus] ||
        "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {statusLabels[normalizedStatus] || status}
    </span>
  );
}

export default StatusBadge;
