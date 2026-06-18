import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FilePlus2, RefreshCw, Road } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ComplaintCard from "../../components/citizen/ComplaintCard.jsx";
import DashboardCard from "../../components/citizen/DashboardCard.jsx";
import EmptyState from "../../components/citizen/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import { normalizeComplaintStatus } from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-sm">
      <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-8 w-14 animate-pulse rounded bg-white/10" />
    </div>
  );
}

function ComplaintSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-sm">
      <div className="h-44 animate-pulse bg-white/10" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchInitialComplaints = async () => {
      try {
        const { data } = await api.get("/complaints/my");
        setComplaints(data.complaints || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load dashboard data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialComplaints();
  }, []);

  const refreshComplaints = async () => {
    setIsRefreshing(true);

    try {
      const { data } = await api.get("/complaints/my");
      setComplaints(data.complaints || []);
      toast.success("Complaints refreshed");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to refresh complaints.",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const summary = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter(
        (item) => normalizeComplaintStatus(item.status) === "pending",
      ).length,
      resolved: complaints.filter(
        (item) => normalizeComplaintStatus(item.status) === "resolved",
      ).length,
    }),
    [complaints],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 text-[#F8FAFC] sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_25rem] lg:items-stretch">
          <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/25 bg-[#F97316]/10 px-3 py-1 text-xs font-semibold text-[#FDBA74]">
                  <Road className="h-4 w-4" aria-hidden="true" />
                  Citizen workspace
                </span>
                <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
                  Welcome back, {user?.name || "Citizen"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#94A3B8]">
                  Track and manage your reported road issues.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 text-sm text-[#CBD5E1]">
                <CalendarDays className="h-4 w-4 text-[#F97316]" />
                {formatDate(new Date())}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {isLoading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <DashboardCard label="Total Complaints" value={summary.total} />
                <DashboardCard
                  label="Pending Complaints"
                  value={summary.pending}
                  tone="yellow"
                />
                <DashboardCard
                  label="Resolved Complaints"
                  value={summary.resolved}
                  tone="green"
                />
              </>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#F8FAFC]">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Submit a new complaint or refresh the latest updates.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/citizen/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500"
            >
              <FilePlus2 className="h-4 w-4" aria-hidden="true" />
              Report an Issue
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0F172A] px-5 py-3 text-sm font-semibold text-[#F8FAFC] transition-colors duration-200 hover:border-[#F97316]/35 hover:bg-[#162033] disabled:cursor-not-allowed disabled:opacity-70"
              onClick={refreshComplaints}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {isRefreshing ? "Refreshing..." : "Refresh Complaints"}
            </button>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
                My Complaints
              </h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Open any complaint to view full details, location, assignment,
                and resolution updates.
              </p>
            </div>
            <Link
              to="/citizen/complaints"
              className="text-sm font-semibold text-[#F97316] transition-colors duration-200 hover:text-orange-300"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ComplaintSkeleton key={index} />
              ))}
            </div>
          ) : complaints.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint._id} complaint={complaint} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No complaints reported yet"
              message="Report your first road maintenance issue to start tracking it here."
              actionLabel="Report Your First Issue"
              actionTo="/citizen/create"
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default CitizenDashboard;
