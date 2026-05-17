import { normalizeComplaintStatus } from "../../utils/complaintConstants.js";

const timelineSteps = [
  { key: "created", label: "Complaint Created" },
  { key: "in-progress", label: "Engineer Assigned & Work Started" },
  { key: "resolved", label: "Resolved" },
];

const statusOrder = {
  pending: 0,
  "in-progress": 1,
  resolved: 2,
};

function ComplaintTimeline({ status = "pending" }) {
  const activeIndex = statusOrder[normalizeComplaintStatus(status)] ?? 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Complaint Timeline
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {timelineSteps.map((step, index) => {
          const isActive = index <= activeIndex;

          return (
            <div key={step.key} className="relative">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-4 ring-white ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-3 text-sm font-semibold ${
                  isActive ? "text-slate-950" : "text-slate-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ComplaintTimeline;
