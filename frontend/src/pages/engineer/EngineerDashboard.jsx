import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import LoadingSpinner from "../../components/citizen/LoadingSpinner.jsx";
import EngineerDashboardCard from "../../components/engineer/EngineerDashboardCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
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

  const stats = useMemo(
    () => ({
      total: complaints.length,
      inProgress: complaints.filter(
        (complaint) => normalizeComplaintStatus(complaint.status) === "in-progress",
      ).length,
      resolved: complaints.filter(
        (complaint) => normalizeComplaintStatus(complaint.status) === "resolved",
      ).length,
    }),
    [complaints],
  );

  const recentComplaints = complaints.slice(0, 5);

  if (isLoading) {
    return <LoadingSpinner label="Loading engineer dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {user?.name || "Engineer"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review assigned road maintenance work and submit completed repairs.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <EngineerDashboardCard
          label="Total Assigned Complaints"
          value={stats.total}
          helper="All work assigned to you"
        />
        <EngineerDashboardCard
          label="In Progress Complaints"
          value={stats.inProgress}
          helper="Currently active repairs"
          tone="blue"
        />
        <EngineerDashboardCard
          label="Resolved Complaints"
          value={stats.resolved}
          helper="Closed with resolution proof"
          tone="green"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Recent Assigned Complaints
            </h2>
          </div>

          {recentComplaints.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentComplaints.map((complaint) => (
                <Link
                  key={complaint._id}
                  to={`/engineer/complaints/${complaint._id}`}
                  className="grid gap-3 p-5 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {complaint.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(complaint.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                  <span className="text-sm font-semibold text-emerald-700">
                    View
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-5 text-sm text-slate-600">
              No complaints are assigned to you yet.
            </p>
          )}
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Quick Actions
          </h2>
          <div className="mt-5 space-y-3">
            <Link
              to="/engineer/complaints"
              className="block rounded-md bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              View Assigned Complaints
            </Link>
            <Link
              to="/engineer/resolved"
              className="block rounded-md border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Resolved Complaints
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default EngineerDashboard;
