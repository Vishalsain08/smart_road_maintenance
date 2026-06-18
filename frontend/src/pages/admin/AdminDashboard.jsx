import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ImageIcon,
  MapPin,
  MapPinned,
  MoreHorizontal,
  Plus,
  UserCog,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AdminComplaintDetails from "../../components/admin/AdminComplaintDetails.jsx";
import AssignEngineerModal from "../../components/admin/AssignEngineerModal.jsx";
import StatusBadge from "../../components/citizen/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import {
  COMPLAINT_STATUSES,
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

const formatStatusLabel = (status) =>
  normalizeComplaintStatus(status)
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");

const statusIconMap = {
  pending: AlertCircle,
  "in-progress": Clock3,
  resolved: CheckCircle2,
};

const statCards = [
  { key: "total", label: "Total Complaints", icon: ClipboardList },
  { key: "pending", label: "Pending", icon: AlertCircle },
  { key: "inProgress", label: "In Progress", icon: Clock3 },
  { key: "resolved", label: "Resolved", icon: CheckCircle2 },
];

const initialEngineerForm = {
  name: "",
  email: "",
  password: "",
};

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-4 shadow-lg shadow-slate-950/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
          {label}
        </p>
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-[#F8FAFC]">{value}</p>
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

function ComplaintCard({
  complaint,
  onAssign,
  onDelete,
  onOpen,
  onStatusChange,
}) {
  const normalizedStatus = normalizeComplaintStatus(complaint.status);
  const StatusIcon = statusIconMap[normalizedStatus] || MoreHorizontal;

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
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#CBD5E1]">
            <Wrench className="h-3.5 w-3.5 shrink-0 text-[#F97316]" aria-hidden="true" />
            <span className="truncate">
              {complaint.assignedEngineer?.name || "Unassigned"}
            </span>
          </span>
        </div>

        <div className="grid gap-2 pt-1 sm:grid-cols-[1fr_auto_auto]">
          <select
            value={normalizedStatus}
            className="min-h-10 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-3 text-sm font-semibold text-[#F8FAFC] outline-none transition-all duration-200 hover:border-[#38BDF8]/40 focus:border-[#38BDF8]"
            onClick={stopAction}
            onChange={(event) => {
              stopAction(event);
              onStatusChange(complaint, event.target.value);
            }}
          >
            {COMPLAINT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-2xl bg-[#F97316] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-500"
            onClick={(event) => {
              stopAction(event);
              onAssign(complaint);
            }}
          >
            Assign
          </button>
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

function EngineerOverviewCard({ engineer }) {
  const activeCount = engineer.assignedComplaintsCount || 0;
  const workload =
    activeCount >= 8 ? "High" : activeCount >= 4 ? "Moderate" : "Light";

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-4 shadow-lg shadow-slate-950/10">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
          <UserCog className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[#F8FAFC]">{engineer.name}</h3>
          <p className="mt-1 truncate text-sm text-[#94A3B8]">{engineer.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[#CBD5E1]">
              {activeCount} assigned
            </span>
            <span className="rounded-full bg-[#38BDF8]/10 px-3 py-1 text-[#38BDF8]">
              {workload} workload
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignComplaint, setAssignComplaint] = useState(null);
  const [isEngineerModalOpen, setIsEngineerModalOpen] = useState(false);
  const [engineerFormData, setEngineerFormData] = useState(initialEngineerForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingEngineer, setIsCreatingEngineer] = useState(false);

  const loadComplaints = useCallback(async () => {
    const { data } = await api.get("/admin/complaints");
    return Array.isArray(data) ? data : data.complaints || [];
  }, []);

  const loadEngineers = useCallback(async () => {
    const { data } = await api.get("/admin/engineers");
    return Array.isArray(data) ? data : data.engineers || [];
  }, []);

  const refreshDashboard = useCallback(async () => {
    const [nextComplaints, nextEngineers] = await Promise.all([
      loadComplaints(),
      loadEngineers(),
    ]);
    setComplaints(nextComplaints);
    setEngineers(nextEngineers);
  }, [loadComplaints, loadEngineers]);

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
      inProgress: complaints.filter(
        (item) => normalizeComplaintStatus(item.status) === "in-progress",
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

  const statusCounts = useMemo(() => {
    const counts = {};
    complaints.forEach((complaint) => {
      const status = normalizeComplaintStatus(complaint.status);
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts);
  }, [complaints]);

  const handleStatusChange = async (complaint, status) => {
    if (normalizeComplaintStatus(complaint.status) === status) {
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

  const handleEngineerFormChange = (event) => {
    const { name, value } = event.target;
    setEngineerFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCreateEngineer = async (event) => {
    event.preventDefault();
    setIsCreatingEngineer(true);

    try {
      const { data } = await api.post("/admin/engineers", engineerFormData);
      toast.success(data.message || "Engineer created successfully");
      await refreshDashboard();
      setEngineerFormData(initialEngineerForm);
      setIsEngineerModalOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Engineer creation requires a backend /admin/engineers endpoint.",
      );
    } finally {
      setIsCreatingEngineer(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="sticky top-[73px] z-30 rounded-2xl border border-white/[0.08] bg-[#0F172A]/85 p-4 shadow-lg shadow-slate-950/20 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Manage road maintenance complaints
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

        <section className="grid gap-6 xl:grid-cols-[1fr_520px] xl:items-start">
          <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-[#F97316]">
                  Civic operations
                </p>
                <h2 className="mt-1 text-xl font-bold">Road Fix command center</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">
                  Review incoming reports, assign engineers, and keep field work
                  moving from one clean workspace.
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
                <Link
                  to="/admin/engineers"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-200 hover:border-[#F97316]/40 hover:bg-white/[0.04]"
                >
                  <UsersRound className="h-4 w-4" aria-hidden="true" />
                  View Engineers
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-28" />
                ))
              : statCards.map((item) => (
                  <StatCard
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    value={stats[item.key]}
                  />
                ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {isLoading ? (
            <>
              <SkeletonBlock className="h-64" />
              <SkeletonBlock className="h-64" />
            </>
          ) : (
            <>
              <DistributionCard
                title="Category Distribution"
                items={categoryCounts}
                total={stats.total}
                formatter={formatComplaintCategory}
                icon={ClipboardList}
              />
              <DistributionCard
                title="Status Distribution"
                items={statusCounts}
                total={stats.total}
                formatter={formatStatusLabel}
                icon={Clock3}
              />
            </>
          )}
        </section>

        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold">All Complaints</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Click a card for full complaint details and field history.
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
                  onAssign={setAssignComplaint}
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

        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold">Engineer Overview</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Current workload by field engineer.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-2xl bg-[#F97316]/10 px-3 py-2 text-sm font-semibold text-[#FDBA74]">
                {engineers.length} engineers
              </span>
              <Link
                to="/admin/engineers"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-200 hover:border-[#F97316]/40 hover:bg-white/[0.04]"
              >
                <UsersRound className="h-4 w-4" aria-hidden="true" />
                View All
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500"
                onClick={() => setIsEngineerModalOpen(true)}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Engineer
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-32" />
              ))}
            </div>
          ) : engineers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {engineers.map((engineer) => (
                <EngineerOverviewCard key={engineer._id} engineer={engineer} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-8 text-center text-sm text-[#94A3B8]">
              No engineer accounts found.
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
      {assignComplaint && (
        <AssignEngineerModal
          complaint={assignComplaint}
          onClose={() => setAssignComplaint(null)}
          onAssigned={refreshDashboard}
        />
      )}
      {isEngineerModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreateEngineer}
            className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-2xl shadow-slate-950/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  Add Engineer
                </h2>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  New engineers can log in with this email and password.
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-[#CBD5E1] transition hover:bg-white/[0.06] hover:text-[#F8FAFC]"
                onClick={() => setIsEngineerModalOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {["name", "email", "password"].map((field) => (
                <input
                  key={field}
                  name={field}
                  type={
                    field === "password"
                      ? "password"
                      : field === "email"
                        ? "email"
                        : "text"
                  }
                  value={engineerFormData[field]}
                  onChange={handleEngineerFormChange}
                  required
                  minLength={field === "password" ? 8 : undefined}
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#0F172A] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                  placeholder={field.slice(0, 1).toUpperCase() + field.slice(1)}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isCreatingEngineer}
              className="mt-5 w-full rounded-2xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-[#F97316]/50"
            >
              {isCreatingEngineer ? "Adding..." : "Add Engineer"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default AdminDashboard;
