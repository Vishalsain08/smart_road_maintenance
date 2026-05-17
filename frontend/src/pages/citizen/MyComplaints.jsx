import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ComplaintCard from "../../components/citizen/ComplaintCard.jsx";
import ComplaintMap from "../../components/citizen/ComplaintMap.jsx";
import EmptyState from "../../components/citizen/EmptyState.jsx";
import api from "../../services/api.js";
import {
  COMPLAINT_STATUSES,
  normalizeComplaintStatus,
} from "../../utils/complaintConstants.js";

const statusFilters = [
  { label: "All", value: "all" },
  ...COMPLAINT_STATUSES,
];

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[16/10] animate-pulse bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/complaints/my");
        setComplaints(data.complaints || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load complaints.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(
    () =>
      complaints.filter((complaint) => {
        const matchesStatus =
          statusFilter === "all" ||
          normalizeComplaintStatus(complaint.status) === statusFilter;
        const searchValue = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !searchValue ||
          complaint.title?.toLowerCase().includes(searchValue) ||
          complaint.category?.toLowerCase().includes(searchValue);

        return matchesStatus && matchesSearch;
      }),
    [complaints, searchTerm, statusFilter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            My Complaints
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review every issue you have reported and follow its current status.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="inline-flex rounded-md border border-slate-300 bg-white p-1">
            <button
              type="button"
              className={`rounded px-3 py-1.5 text-sm font-semibold transition ${
                viewMode === "list"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setViewMode("list")}
            >
              List View
            </button>
            <button
              type="button"
              className={`rounded px-3 py-1.5 text-sm font-semibold transition ${
                viewMode === "map"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setViewMode("map")}
            >
              Map View
            </button>
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-64"
            placeholder="Search complaints"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filteredComplaints.length > 0 && viewMode === "map" ? (
        <ComplaintMap complaints={filteredComplaints} />
      ) : filteredComplaints.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No complaints found"
          message="Try changing the search or status filter, or submit a new road maintenance issue."
          actionLabel="Report New Issue"
          actionTo="/citizen/create"
        />
      )}
    </div>
  );
}

export default MyComplaints;
