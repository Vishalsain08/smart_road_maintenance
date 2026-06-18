import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImageIcon,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import ReadOnlyMap from "../../components/citizen/ReadOnlyMap.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import ResolutionForm from "../../components/engineer/ResolutionForm.jsx";
import api from "../../services/api.js";
import {
  formatComplaintCategory,
  formatComplaintLocation,
  normalizeComplaintStatus,
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

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

function DetailItem({ icon: Icon, label, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
        <Icon className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-sm text-[#F8FAFC]">{children}</dd>
    </div>
  );
}

function EngineerComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchComplaint = useCallback(async () => {
    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data.complaint);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load complaint details.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Fetching route data on mount keeps the existing detail endpoint flow intact.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComplaint();
  }, [fetchComplaint]);

  const handleStatusChange = async (status) => {
    if (!complaint || normalizeComplaintStatus(complaint.status) === status) {
      return;
    }

    setIsUpdatingStatus(true);

    try {
      const { data } = await api.patch(`/engineer/complaints/${complaint._id}/status`, {
        status,
      });
      toast.success(data.message || "Complaint status updated");
      setComplaint(data.complaint);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <SkeletonBlock className="h-24" />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <SkeletonBlock className="h-[34rem]" />
            <SkeletonBlock className="h-[34rem]" />
          </div>
        </div>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="min-h-screen bg-[#0F172A] px-4 py-6 text-[#F8FAFC]">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/[0.08] bg-[#1E293B] p-8 text-center shadow-lg shadow-slate-950/10">
          <h1 className="text-xl font-bold">Complaint not found</h1>
          <Link
            to="/engineer"
            className="mt-4 inline-flex rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const normalizedStatus = normalizeComplaintStatus(complaint.status);
  const isResolved = normalizedStatus === "resolved";
  const coordinates =
    Number.isFinite(complaint.location?.lat) &&
    Number.isFinite(complaint.location?.lng)
      ? `${complaint.location.lat}, ${complaint.location.lng}`
      : "Not available";

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10 sm:flex-row sm:items-center">
          <div>
            <Link
              to="/engineer"
              className="text-sm font-semibold text-[#F97316] transition hover:text-orange-300"
            >
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {complaint.title || "Untitled complaint"}
            </h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              {formatComplaintCategory(complaint.category)}
            </p>
          </div>
          <StatusBadge status={complaint.status} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-lg shadow-slate-950/10">
            {complaint.image ? (
              <img
                src={complaint.image}
                alt={complaint.title}
                className="h-80 w-full object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center bg-[#0F172A] text-[#94A3B8]">
                <ImageIcon className="h-8 w-8" aria-hidden="true" />
              </div>
            )}
            <div className="p-5">
              <h2 className="text-lg font-semibold">Full Description</h2>
              <p className="mt-3 leading-7 text-[#CBD5E1]">
                {complaint.description || "No description provided."}
              </p>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10">
              <h2 className="text-lg font-semibold">Complaint Details</h2>
              <dl className="mt-5 grid gap-3">
                <DetailItem icon={MapPin} label="Location">
                  {formatComplaintLocation(complaint.location)}
                </DetailItem>
                <DetailItem icon={MapPin} label="Coordinates">
                  {coordinates}
                </DetailItem>
                <DetailItem icon={UserRound} label="Citizen">
                  {complaint.reportedBy?.name || "Unknown citizen"}
                </DetailItem>
                <DetailItem icon={Mail} label="Citizen Email">
                  {complaint.reportedBy?.email || "Not available"}
                </DetailItem>
                <DetailItem icon={CalendarDays} label="Created">
                  {formatDateTime(complaint.createdAt)}
                </DetailItem>
                <DetailItem icon={Clock3} label="Updated">
                  {formatDateTime(complaint.updatedAt)}
                </DetailItem>
              </dl>
            </div>

            {!isResolved && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10">
                <h2 className="text-lg font-semibold">Update Status</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={isUpdatingStatus || normalizedStatus === "in-progress"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-4 py-2.5 text-sm font-semibold text-[#BAE6FD] transition-all duration-200 hover:bg-[#38BDF8]/15 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleStatusChange("in-progress")}
                  >
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    In Progress
                  </button>
                  <a
                    href="#resolution-upload"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-500"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Upload Proof
                  </a>
                </div>
              </div>
            )}
          </aside>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Location Map</h2>
          <ReadOnlyMap complaint={complaint} />
        </section>

        <section id="resolution-upload" className="grid gap-6 lg:grid-cols-2">
          {isResolved ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10">
              <h2 className="text-lg font-semibold">Resolution Image</h2>
              {complaint.resolutionImage ? (
                <img
                  src={complaint.resolutionImage}
                  alt="Resolution"
                  className="mt-4 h-64 w-full rounded-2xl object-cover"
                />
              ) : (
                <p className="mt-3 text-sm text-[#94A3B8]">
                  Resolution image is not available.
                </p>
              )}
            </div>
          ) : (
            <ResolutionForm complaintId={complaint._id} onResolved={setComplaint} />
          )}

          <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10">
            <h2 className="text-lg font-semibold">Resolution Notes</h2>
            <p className="mt-3 leading-7 text-[#CBD5E1]">
              {complaint.resolutionNotes || "No resolution notes submitted yet."}
            </p>
            {complaint.resolvedAt && (
              <p className="mt-4 text-sm font-semibold text-emerald-300">
                Resolved on {formatDateTime(complaint.resolvedAt)}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default EngineerComplaintDetails;
