import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AdminDashboardCard from "../../components/admin/AdminDashboardCard.jsx";
import AnalyticsCard from "../../components/admin/AnalyticsCard.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import api from "../../services/api.js";
import {
  formatComplaintCategory,
  normalizeComplaintStatus,
} from "../../utils/complaintConstants.js";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Not available";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: complaintsData } = await api.get("/admin/complaints");

        setComplaints(
          Array.isArray(complaintsData)
            ? complaintsData
            : complaintsData.complaints || [],
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load admin complaints.",
        );
      }

      try {
        const { data: engineersData } = await api.get("/admin/engineers");

        setEngineers(
          Array.isArray(engineersData)
            ? engineersData
            : engineersData.engineers || [],
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load engineer count.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(
        (item) => normalizeComplaintStatus(item.status) === "pending",
      ).length,
      inProgress: complaints.filter((item) =>
        normalizeComplaintStatus(item.status) === "in-progress",
      ).length,
      resolved: complaints.filter(
        (item) => normalizeComplaintStatus(item.status) === "resolved",
      ).length,
      engineers: engineers.length,
    };
  }, [complaints, engineers]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    complaints.forEach((complaint) => {
      counts[complaint.category || "general"] =
        (counts[complaint.category || "general"] || 0) + 1;
    });
    return Object.entries(counts).slice(0, 5);
  }, [complaints]);

  const recentComplaints = complaints.slice(0, 5);

  if (isLoading) {
    return <div className="text-sm text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor citywide road maintenance complaints and field assignments.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminDashboardCard label="Total Complaints" value={stats.total} />
        <AdminDashboardCard label="Pending" value={stats.pending} tone="yellow" />
        <AdminDashboardCard label="In Progress" value={stats.inProgress} tone="blue" />
        <AdminDashboardCard label="Resolved" value={stats.resolved} tone="green" />
        <AdminDashboardCard label="Total Engineers" value={stats.engineers} tone="slate" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Recent Complaints
            </h2>
          </div>
          {recentComplaints.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {complaint.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {complaint.reportedBy?.name || "Unknown citizen"}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                  <p className="text-sm text-slate-500">
                    {formatDate(complaint.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-5 text-sm text-slate-600">No complaints found.</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Quick Actions
            </h2>
            <div className="mt-5 space-y-3">
              <Link className="block rounded-md bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700" to="/admin/complaints">
                Manage Complaints
              </Link>
              <Link className="block rounded-md border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" to="/admin/engineers">
                View Engineers
              </Link>
              <Link className="block rounded-md border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" to="/admin/map">
                Open Map Overview
              </Link>
            </div>
          </div>

          <AnalyticsCard title="Category Distribution">
            <div className="space-y-3">
              {categoryCounts.map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-slate-600">
                      {formatComplaintCategory(category)}
                    </span>
                    <span className="font-semibold text-slate-950">{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-600"
                      style={{
                        width: `${Math.max((count / Math.max(stats.total, 1)) * 100, 8)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
