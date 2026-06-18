import { CalendarDays, ImageIcon, MapPin, UserRound, Wrench, X } from "lucide-react";
import ReadOnlyMap from "../citizen/ReadOnlyMap.jsx";
import StatusBadge from "../citizen/StatusBadge.jsx";
import {
  formatComplaintCategory,
  formatComplaintLocation,
} from "../../utils/complaintConstants.js";

const formatDateTime = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date))
    : "Not available";

function DetailItem({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
        {Icon && <Icon className="h-4 w-4 text-[#F97316]" aria-hidden="true" />}
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold text-[#F8FAFC]">
        {value}
      </dd>
      {helper && <dd className="mt-1 break-words text-sm text-[#94A3B8]">{helper}</dd>}
    </div>
  );
}

function AdminComplaintDetails({ complaint, onClose }) {
  if (!complaint) {
    return null;
  }

  const coordinates =
    Number.isFinite(complaint.location?.lat) &&
    Number.isFinite(complaint.location?.lng)
      ? `${complaint.location.lat.toFixed(6)}, ${complaint.location.lng.toFixed(6)}`
      : "Coordinates not available";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-2xl shadow-slate-950/40">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.08] bg-[#1E293B]/95 p-5 backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold text-[#F97316]">
              Complaint Details
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#F8FAFC]">
              {complaint.title}
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] text-[#CBD5E1] transition-all duration-200 hover:border-[#F97316]/40 hover:bg-white/[0.04] hover:text-white"
            aria-label="Close complaint details"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {complaint.image ? (
              <img
                src={complaint.image}
                alt={complaint.title}
                className="h-80 w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0F172A] text-[#94A3B8]">
                <ImageIcon className="h-10 w-10" aria-hidden="true" />
              </div>
            )}

            <section className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-5">
              <h3 className="font-semibold text-[#F8FAFC]">Full Description</h3>
              <p className="mt-3 leading-7 text-[#CBD5E1]">
                {complaint.description || "No description provided."}
              </p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
                <MapPin className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
                Location Map
              </div>
              <ReadOnlyMap complaint={complaint} />
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-5">
              <div className="flex items-center justify-between gap-4">
                <StatusBadge status={complaint.status} />
                <span className="rounded-full bg-[#F97316]/10 px-3 py-1 text-xs font-semibold text-[#FDBA74]">
                  {formatComplaintCategory(complaint.category)}
                </span>
              </div>

              <dl className="mt-5 grid gap-3">
                <DetailItem
                  label="Location"
                  value={formatComplaintLocation(complaint.location)}
                  helper={coordinates}
                  icon={MapPin}
                />
                <DetailItem
                  label="Reported User"
                  value={complaint.reportedBy?.name || "Unknown"}
                  helper={complaint.reportedBy?.email || "No email"}
                  icon={UserRound}
                />
                <DetailItem
                  label="Assigned Engineer"
                  value={complaint.assignedEngineer?.name || "Not assigned"}
                  helper={complaint.assignedEngineer?.email || "Awaiting assignment"}
                  icon={Wrench}
                />
                <DetailItem
                  label="Created"
                  value={formatDateTime(complaint.createdAt)}
                  icon={CalendarDays}
                />
                <DetailItem
                  label="Updated"
                  value={formatDateTime(complaint.updatedAt)}
                  icon={CalendarDays}
                />
              </dl>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-5">
              <h3 className="font-semibold text-[#F8FAFC]">Resolution</h3>
              {complaint.resolutionImage ? (
                <img
                  src={complaint.resolutionImage}
                  alt="Resolution"
                  className="mt-4 h-52 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="mt-4 flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/[0.12] text-sm text-[#94A3B8]">
                  No resolution image uploaded yet.
                </div>
              )}
              <p className="mt-4 text-sm leading-6 text-[#CBD5E1]">
                {complaint.resolutionNotes || "No resolution notes available."}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminComplaintDetails;
