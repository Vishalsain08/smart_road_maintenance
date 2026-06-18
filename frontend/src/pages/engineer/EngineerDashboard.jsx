import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, ClipboardList, Cone, UserCog } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AssignedComplaintCard from "../../components/engineer/AssignedComplaintCard.jsx";
import EngineerDashboardCard from "../../components/engineer/EngineerDashboardCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import { normalizeComplaintStatus } from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

function EmptyAssignedState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-8 text-center shadow-lg shadow-slate-950/10">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
        <Cone className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-semibold text-[#F8FAFC]">
        No complaints assigned yet
      </p>
    </div>
  );
}

function EngineerDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/engineer/complaints");
        setComplaints(data.complaints || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load engineer dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const groupedComplaints = useMemo(() => {
    const pending = complaints.filter(
      (complaint) => normalizeComplaintStatus(complaint.status) !== "resolved",
    );
    const resolved = complaints.filter(
      (complaint) => normalizeComplaintStatus(complaint.status) === "resolved",
    );

    return {
      pending,
      resolved,
      recentResolved: resolved.slice(0, 3),
    };
  }, [complaints]);

  const stats = useMemo(
    () => ({
      total: complaints.length,
      inProgress: complaints.filter(
        (complaint) => normalizeComplaintStatus(complaint.status) === "in-progress",
      ).length,
      resolved: groupedComplaints.resolved.length,
    }),
    [complaints, groupedComplaints.resolved.length],
  );

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-white/[0.08] bg-[#1E293B]/80 p-5 shadow-lg shadow-slate-950/20 backdrop-blur">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-[#F97316]">
                Field work console
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {user?.name || "Engineer"}
              </h1>
              <p className="mt-2 text-sm text-[#94A3B8]">
                Manage and resolve assigned road issues.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-3 py-2 text-sm font-semibold text-[#CBD5E1]">
                <CalendarDays className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
                {formatDate(new Date())}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
                <UserCog className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {isLoading ? (
            <>
              <SkeletonBlock className="h-32" />
              <SkeletonBlock className="h-32" />
              <SkeletonBlock className="h-32" />
            </>
          ) : (
            <>
              <EngineerDashboardCard
                icon={ClipboardList}
                label="Assigned Complaints"
                value={stats.total}
                helper="All assigned work"
              />
              <EngineerDashboardCard
                icon={Clock3}
                label="In Progress"
                value={stats.inProgress}
                helper="Active repairs"
              />
              <EngineerDashboardCard
                icon={CheckCircle2}
                label="Resolved Complaints"
                value={stats.resolved}
                helper="Closed with proof"
              />
            </>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Pending Complaints</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Pending and in-progress complaints assigned to you.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-[390px]" />
              ))}
            </div>
          ) : groupedComplaints.pending.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {groupedComplaints.pending.map((complaint) => (
                <AssignedComplaintCard key={complaint._id} complaint={complaint} />
              ))}
            </div>
          ) : (
            <EmptyAssignedState />
          )}
        </section>

        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold">Resolved Complaints</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Recent completed repairs with submitted proof.
              </p>
            </div>
            <Link
              to="/engineer/resolved"
              className="inline-flex items-center justify-center rounded-2xl border border-white/[0.08] bg-[#1E293B] px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-200 hover:border-[#F97316]/40 hover:bg-white/[0.04]"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-[340px]" />
              ))}
            </div>
          ) : groupedComplaints.recentResolved.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {groupedComplaints.recentResolved.map((complaint) => (
                <AssignedComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  compact
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-8 text-center text-sm text-[#94A3B8]">
              Resolved complaints will appear here after proof is submitted.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default EngineerDashboard;
