import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, FileText, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import ComplaintTimeline from "../../components/citizen/ComplaintTimeline.jsx";
import LoadingSpinner from "../../components/citizen/LoadingSpinner.jsx";
import ReadOnlyMap from "../../components/citizen/ReadOnlyMap.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import api from "../../services/api.js";
import { formatComplaintCategory } from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date))
    : "Not available";

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8]">
        <Icon className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-[#F8FAFC]">{value}</p>
    </div>
  );
}

function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
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
    };

    fetchComplaint();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner label="Loading complaint details..." />;
  }

  if (!complaint) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-[#F8FAFC]">
          Complaint not found
        </h1>
        <Link
          to="/citizen/complaints"
          className="mt-4 inline-flex rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to Complaints
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <Link
              to="/citizen/complaints"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] transition-colors duration-200 hover:text-orange-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to complaints
            </Link>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#F8FAFC]">
              {complaint.title}
            </h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              {formatComplaintCategory(complaint.category)}
            </p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-sm">
          {complaint.image ? (
            <img
              src={complaint.image}
              alt={complaint.title}
              className="h-80 w-full object-cover"
            />
          ) : (
            <div className="flex h-80 items-center justify-center bg-[#0F172A] text-[#94A3B8]">
              No image available
            </div>
          )}
          <div className="p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#F8FAFC]">
              <FileText className="h-5 w-5 text-[#F97316]" aria-hidden="true" />
              Description
            </h2>
            <p className="mt-3 leading-7 text-[#CBD5E1]">
              {complaint.description}
            </p>
          </div>
        </section>

        <aside className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            Complaint Info
          </h2>
          <div className="mt-5 grid gap-3">
            <InfoItem
              icon={CalendarDays}
              label="Created Date"
              value={formatDate(complaint.createdAt)}
            />
            <InfoItem
              icon={MapPin}
              label="Location"
              value={complaint.location?.address || "Address not available"}
            />
            <InfoItem
              icon={MapPin}
              label="Coordinates"
              value={
                Number.isFinite(complaint.location?.lat) &&
                Number.isFinite(complaint.location?.lng)
                  ? `${complaint.location.lat.toFixed(6)}, ${complaint.location.lng.toFixed(6)}`
                  : "Coordinates not available"
              }
            />
          </div>
        </aside>
      </div>

      <ComplaintTimeline status={complaint.status} />

      <section className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            Complaint Location
          </h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Read-only location marker for this complaint.
          </p>
        </div>
        <ReadOnlyMap complaint={complaint} />
      </section>
    </div>
  );
}

export default ComplaintDetails;
