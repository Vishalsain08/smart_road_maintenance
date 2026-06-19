import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ImageIcon,
  MapPin,
  MapPinned,
  MoreHorizontal,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AdminComplaintDetails from "../../components/admin/AdminComplaintDetails.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import {
  formatComplaintCategory,
  formatComplaintLocation,
  normalizeComplaintStatus,
} from "../../utils/complaintConstants.js";

const formatDate = (date, options = {}) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options,
      }).format(new Date(date))
    : "Not available";

const statusIconMap = {
  pending: AlertCircle,
  resolved: CheckCircle2,
  "in-progress": MoreHorizontal,
  in_progress: MoreHorizontal,
};

const statCards = [
  { key: "total", label: "Total Complaints", icon: ClipboardList },
  { key: "pending", label: "Pending", icon: AlertCircle },
  { key: "resolved", label: "Resolved", icon: CheckCircle2 },
];

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-xl shadow-slate-950/15">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
          {label}
        </p>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316] ring-1 ring-[#F97316]/20">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-[#F8FAFC]">
        {value}
      </p>
    </div>
  );
}

function DistributionCard({ title, items, total, formatter, icon: Icon }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#F8FAFC]">{title}</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Current complaint mix</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F172A] text-[#38BDF8]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {items.length > 0 ? (
          items.map(([label, count]) => {
            const width = `${Math.max((count / Math.max(total, 1)) * 100, 7)}%`;

            return (
              <div key={label}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="truncate text-[#CBD5E1]">{formatter(label)}</span>
                  <span className="font-semibold text-[#F8FAFC]">{count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#F97316] transition-all duration-200"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-[#94A3B8]">No data available yet.</p>
        )}
      </div>
    </section>
  );
}

function ComplaintCard({ complaint, onDelete, onOpen, onStatusChange }) {
  const normalizedStatus = normalizeComplaintStatus(complaint.status);
  const StatusIcon = statusIconMap[normalizedStatus] || MoreHorizontal;
  const isResolved = normalizedStatus === "resolved";

  const stopAction = (event) => {
    event.stopPropagation();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] shadow-lg shadow-slate-950/10 outline-none transition-all duration-200 hover:-translate-y-1 hover:border-[#F97316]/35 hover:shadow-xl hover:shadow-slate-950/20 focus-visible:ring-2 focus-visible:ring-[#F97316]/70"
      onClick={() => onOpen(complaint)}
      onKeyDown={(event) => {
        if (event.currentTarget === event.target && event.key === "Enter") {
          onOpen(complaint);
        }
      }}
    >
      {complaint.image ? (
        <img
          src={complaint.image}
          alt={complaint.title}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-[#0F172A] text-[#94A3B8]">
          <ImageIcon className="h-8 w-8" aria-hidden="true" />
        </div>
      )}

      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-semibold leading-6 text-[#F8FAFC]">
              {complaint.title || "Untitled complaint"}
            </h3>
            <StatusIcon className="mt-1 h-4 w-4 shrink-0 text-[#F97316]" />
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#94A3B8]">
            {complaint.description || "No description provided."}
          </p>
        </div>

        <div className="space-y-2 text-sm text-[#CBD5E1]">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />
            <span className="line-clamp-1">
              {formatComplaintLocation(complaint.location)}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <UserRound className="h-4 w-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />
            <span>{complaint.reportedBy?.name || "Unknown citizen"}</span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />
            <span>{formatDate(complaint.createdAt)}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
          <StatusBadge status={complaint.status} />
          <span className="inline-flex rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#CBD5E1]">
            {formatComplaintCategory(complaint.category)}
          </span>
        </div>

        <div className="grid gap-2 pt-1 sm:grid-cols-[1fr_auto]">
          {isResolved ? (
            <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Resolved
            </span>
          ) : (
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500"
              onClick={(event) => {
                stopAction(event);
                onStatusChange(complaint, "resolved");
              }}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Resolve
            </button>
          )}
          <button
            type="button"
            className="rounded-2xl border border-white/[0.08] px-4 py-2 text-sm font-semibold text-[#F8FAFC] transition-all duration-200 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
            onClick={(event) => {
              stopAction(event);
              onDelete(complaint);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadComplaints = useCallback(async () => {
    const { data } = await api.get("/admin/complaints");
    return Array.isArray(data) ? data : data.complaints || [];
  }, []);

  const refreshDashboard = useCallback(async () => {
    const nextComplaints = await loadComplaints();
    setComplaints(nextComplaints);
  }, [loadComplaints]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        await refreshDashboard();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load admin dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [refreshDashboard]);

  const stats = useMemo(
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

  const categoryCounts = useMemo(() => {
    const counts = {};
    complaints.forEach((complaint) => {
      const category = complaint.category || "general";
      counts[category] = (counts[category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [complaints]);

  const handleStatusChange = async (complaint, status) => {
    if (normalizeComplaintStatus(complaint.status) === status) {
      return;
    }

    if (normalizeComplaintStatus(complaint.status) === "resolved") {
      toast.error("Resolved complaints cannot be reopened.");
      return;
    }

    if (status !== "resolved") {
      toast.error("Complaints can only move forward to resolved.");
      return;
    }

    const confirmed = window.confirm(`Mark complaint "${complaint.title}" as resolved?`);
    if (!confirmed) {
      return;
    }

    try {
      const { data } = await api.patch(`/admin/status/${complaint._id}`, {
        status,
      });
      toast.success(data.message || "Status updated");
      await refreshDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status.");
    }
  };

  const handleDelete = async (complaint) => {
    const confirmed = window.confirm(`Delete complaint "${complaint.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      const { data } = await api.delete(`/admin/complaints/${complaint._id}`);
      toast.success(data.message || "Complaint deleted");
      await refreshDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete complaint.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="sticky top-[73px] z-30 rounded-2xl border border-white/[0.08] bg-[#0F172A]/85 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {user?.name || "Admin"}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#94A3B8]">
                Monitor citizen complaints, track road issues, and keep
                maintenance operations running smoothly.
              </p>
              <p className="mt-2 text-sm font-semibold text-[#CBD5E1]">
                Total complaints received, current pending issues, and completed
                resolutions at a glance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#1E293B] px-3 py-2 text-sm font-semibold text-[#CBD5E1]">
                <CalendarDays className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
                {formatDate(new Date(), { weekday: "short" })}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-3 py-2 text-sm font-semibold text-[#BAE6FD]">
                Live
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#1E293B] px-3 py-2 text-sm font-semibold text-[#F8FAFC]">
                <UserRound className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
                {user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-32" />
              ))
            : statCards.map((item) => (
                <StatCard
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  value={stats[item.key]}
                />
              ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px] xl:items-start">
          <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 shadow-lg shadow-slate-950/10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-[#F97316]">
                  Civic operations
                </p>
                <h2 className="mt-1 text-xl font-bold">Road Fix command center</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">
                  Review incoming reports, update complaint status, and keep
                  road maintenance records current from one workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/map"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500"
                >
                  <MapPinned className="h-4 w-4" aria-hidden="true" />
                  Map View
                </Link>
              </div>
            </div>
          </div>

          {isLoading ? (
            <SkeletonBlock className="h-64" />
          ) : (
            <DistributionCard
              title="Category Distribution"
              items={categoryCounts}
              total={stats.total}
              formatter={formatComplaintCategory}
              icon={ClipboardList}
            />
          )}
        </section>

        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold">All Complaints</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Click a card for full complaint details and location history.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-[420px]" />
              ))}
            </div>
          ) : complaints.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  onDelete={handleDelete}
                  onOpen={setSelectedComplaint}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-8 text-center text-sm text-[#94A3B8]">
              No complaints found.
            </div>
          )}
        </section>
      </div>

      {selectedComplaint && (
        <AdminComplaintDetails
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </main>
  );
}

export default AdminDashboard;
