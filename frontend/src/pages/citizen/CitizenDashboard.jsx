import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/citizen/DashboardCard.jsx";
import EmptyState from "../../components/citizen/EmptyState.jsx";
import LoadingSpinner from "../../components/citizen/LoadingSpinner.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import {
  formatComplaintCategory,
  normalizeComplaintStatus,
} from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
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

    fetchComplaints();
  }, []);

  const summary = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter(
        (item) => normalizeComplaintStatus(item.status) === "pending",
      ).length,
      inProgress: complaints.filter(
        (item) => normalizeComplaintStatus(item.status) === "in-progress",
      ).length,
      resolved: complaints.filter(
        (item) => normalizeComplaintStatus(item.status) === "resolved",
      ).length,
    }),
    [complaints],
  );

  const recentComplaints = complaints.slice(0, 5);

  if (isLoading) {
    return <LoadingSpinner label="Loading citizen dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold text-emerald-300">Welcome back</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {user?.name || "Citizen"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Track your road maintenance reports, review progress, and submit new
          civic issues from your citizen workspace.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Total Complaints" value={summary.total} />
        <DashboardCard label="Pending" value={summary.pending} tone="yellow" />
        <DashboardCard
          label="In Progress"
          value={summary.inProgress}
          tone="blue"
        />
        <DashboardCard label="Resolved" value={summary.resolved} tone="green" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Recent Complaints
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest reports submitted by you.
              </p>
            </div>
            <Link
              to="/citizen/complaints"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all
            </Link>
          </div>

          {recentComplaints.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentComplaints.map((complaint) => (
                <Link
                  key={complaint._id}
                  to={`/citizen/complaints/${complaint._id}`}
                  className="grid gap-3 p-5 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {complaint.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatComplaintCategory(complaint.category)}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                  <p className="text-sm text-slate-500">
                    {formatDate(complaint.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-5">
              <EmptyState
                title="No complaints submitted"
                message="Report your first road maintenance issue to start tracking it here."
                actionLabel="Report New Issue"
                actionTo="/citizen/create"
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Quick Actions
          </h2>
          <div className="mt-5 space-y-3">
            <Link
              to="/citizen/create"
              className="block rounded-md bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Report New Issue
            </Link>
            <Link
              to="/citizen/complaints"
              className="block rounded-md border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Complaints
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CitizenDashboard;
