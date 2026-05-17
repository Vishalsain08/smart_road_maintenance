import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import EmptyState from "../../components/citizen/EmptyState.jsx";
import LoadingSpinner from "../../components/citizen/LoadingSpinner.jsx";
import api from "../../services/api.js";
import { normalizeComplaintStatus } from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Not available";

function ResolvedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/engineer/complaints");
        setComplaints(data.complaints || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load resolved complaints.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const resolvedComplaints = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const isResolved = normalizeComplaintStatus(complaint.status) === "resolved";
      const matchesSearch =
        !searchValue ||
        complaint.title?.toLowerCase().includes(searchValue) ||
        complaint.category?.toLowerCase().includes(searchValue);

      return isResolved && matchesSearch;
    });
  }, [complaints, searchTerm]);

  if (isLoading) {
    return <LoadingSpinner label="Loading resolved complaints..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Resolved Complaints
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Completed repairs with submitted proof.
          </p>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-72"
          placeholder="Search resolved complaints"
        />
      </div>

      {resolvedComplaints.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resolvedComplaints.map((complaint) => (
            <article
              key={complaint._id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="grid grid-cols-2">
                {complaint.image ? (
                  <img
                    src={complaint.image}
                    alt={complaint.title}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-slate-100 text-xs text-slate-500">
                    Original
                  </div>
                )}
                {complaint.resolutionImage ? (
                  <img
                    src={complaint.resolutionImage}
                    alt="Resolution"
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-green-50 text-xs text-green-700">
                    Resolution
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-semibold text-slate-950">
                  {complaint.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Resolved {formatDate(complaint.resolvedAt || complaint.updatedAt)}
                </p>
                <Link
                  to={`/engineer/complaints/${complaint._id}`}
                  className="mt-4 inline-flex w-full justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No resolved complaints found"
          message="Resolved complaints will appear here after you submit repair proof."
        />
      )}
    </div>
  );
}

export default ResolvedComplaints;
