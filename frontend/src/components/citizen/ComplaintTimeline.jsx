import { CheckCircle2 } from "lucide-react";
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
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#F8FAFC]">
        Complaint Timeline
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {timelineSteps.map((step, index) => {
          const isActive = index <= activeIndex;

          return (
            <div key={step.key} className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  isActive
                    ? "bg-[#F97316] text-white"
                    : "bg-white/10 text-[#94A3B8]"
                }`}
              >
                {isActive ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </div>
              <p
                className={`mt-3 text-sm font-semibold ${
                  isActive ? "text-[#F8FAFC]" : "text-[#94A3B8]"
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
