import { normalizeComplaintStatus } from "../../utils/complaintConstants.js";

const statusStyles = {
  pending: "bg-amber-400/10 text-amber-300 ring-amber-300/20",
  resolved: "bg-emerald-400/10 text-emerald-300 ring-emerald-300/20",
};

const statusLabels = {
  pending: "Pending",
  resolved: "Resolved",
};

function StatusBadge({ status = "pending" }) {
  const normalizedStatus = normalizeComplaintStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        statusStyles[normalizedStatus] ||
        "bg-slate-400/10 text-slate-300 ring-slate-300/20"
      }`}
    >
      {statusLabels[normalizedStatus] || status}
    </span>
  );
}

export default StatusBadge;
