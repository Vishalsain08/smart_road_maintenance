import { useEffect, useMemo, useState } from "react";
import { Cone } from "lucide-react";
import toast from "react-hot-toast";
import AssignedComplaintCard from "../../components/engineer/AssignedComplaintCard.jsx";
import api from "../../services/api.js";
import { normalizeComplaintStatus } from "../../utils/complaintConstants.js";

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

function AssignedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/engineer/complaints");
        setComplaints(data.complaints || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load assigned complaints.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const activeComplaints = useMemo(
    () =>
      complaints.filter(
        (complaint) => normalizeComplaintStatus(complaint.status) !== "resolved",
      ),
    [complaints],
  );

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#F97316]">Assigned work</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Pending Complaints
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            All pending and in-progress complaints assigned to your account.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-[390px]" />
            ))}
          </div>
        ) : activeComplaints.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activeComplaints.map((complaint) => (
              <AssignedComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-8 text-center shadow-lg shadow-slate-950/10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
              <Cone className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-semibold text-[#F8FAFC]">
              No complaints assigned yet
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default AssignedComplaints;
