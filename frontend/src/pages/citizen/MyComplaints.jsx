import { useEffect, useState } from "react";
import { List, Map } from "lucide-react";
import toast from "react-hot-toast";
import ComplaintCard from "../../components/citizen/ComplaintCard.jsx";
import ComplaintMap from "../../components/citizen/ComplaintMap.jsx";
import EmptyState from "../../components/citizen/EmptyState.jsx";
import api from "../../services/api.js";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-sm">
      <div className="h-44 animate-pulse bg-white/10" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
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

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              My Complaints
            </h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Review every issue you have reported and follow its current status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex rounded-2xl border border-white/[0.08] bg-[#0F172A] p-1">
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  viewMode === "list"
                    ? "bg-[#F97316] text-white"
                    : "text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#F8FAFC]"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" aria-hidden="true" />
                List View
              </button>
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  viewMode === "map"
                    ? "bg-[#F97316] text-white"
                    : "text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#F8FAFC]"
                }`}
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4" aria-hidden="true" />
                Map View
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : complaints.length > 0 && viewMode === "map" ? (
        <ComplaintMap complaints={complaints} />
      ) : complaints.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No complaints reported yet"
          message="Submit a new road maintenance issue to start tracking it here."
          actionLabel="Report New Issue"
          actionTo="/citizen/create"
        />
      )}
    </div>
  );
}

export default MyComplaints;
