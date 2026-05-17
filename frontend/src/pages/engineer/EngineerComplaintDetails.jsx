import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/citizen/LoadingSpinner.jsx";
import ReadOnlyMap from "../../components/citizen/ReadOnlyMap.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import ResolutionForm from "../../components/engineer/ResolutionForm.jsx";
import api from "../../services/api.js";
import {
  formatComplaintCategory,
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

function EngineerComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    fetchComplaint();
  }, [fetchComplaint]);

  if (isLoading) {
    return <LoadingSpinner label="Loading complaint details..." />;
  }

  if (!complaint) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-950">
          Complaint not found
        </h1>
        <Link
          to="/engineer/complaints"
          className="mt-4 inline-flex rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to Assigned Complaints
        </Link>
      </div>
    );
  }

  const isResolved = normalizeComplaintStatus(complaint.status) === "resolved";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/engineer/complaints"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Back to assigned complaints
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {complaint.title}
          </h1>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {complaint.image ? (
            <img
              src={complaint.image}
              alt={complaint.title}
              className="h-80 w-full object-cover"
            />
          ) : (
            <div className="flex h-80 items-center justify-center bg-slate-100 text-slate-500">
              No image available
            </div>
          )}
          <div className="p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Description
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              {complaint.description}
            </p>
          </div>
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Complaint Info
          </h2>
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
                {complaint.reportedBy?.name || "Unknown citizen"}
              </dd>
              <dd className="mt-1 text-slate-500">
                {complaint.reportedBy?.email}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Created Date</dt>
              <dd className="mt-1 text-slate-950">
                {formatDateTime(complaint.createdAt)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-950">
          Complaint Location
        </h2>
        <ReadOnlyMap complaint={complaint} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {isResolved ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Resolution Proof
            </h2>
            {complaint.resolutionImage ? (
              <img
                src={complaint.resolutionImage}
                alt="Resolution"
                className="mt-4 h-64 w-full rounded-lg object-cover"
              />
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                Resolution image is not available.
              </p>
            )}
          </div>
        ) : (
          <ResolutionForm complaintId={complaint._id} onResolved={fetchComplaint} />
        )}

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Resolution Notes
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            {complaint.resolutionNotes || "No resolution notes submitted yet."}
          </p>
          {complaint.resolvedAt && (
            <p className="mt-4 text-sm font-semibold text-green-700">
              Resolved on {formatDateTime(complaint.resolvedAt)}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default EngineerComplaintDetails;
