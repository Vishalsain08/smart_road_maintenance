import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AnalyticsCard from "../../components/admin/AnalyticsCard.jsx";
import api from "../../services/api.js";
import {
  formatComplaintCategory,
  normalizeComplaintStatus,
} from "../../utils/complaintConstants.js";

function BarRow({ label, value, total }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="capitalize text-slate-600">
          {formatComplaintCategory(label)}
        </span>
        <span className="font-semibold text-slate-950">{value}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-emerald-600"
          style={{ width: `${Math.max((value / Math.max(total, 1)) * 100, 6)}%` }}
        />
      </div>
    </div>
  );
}

function Analytics() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/admin/complaints");
        setComplaints(Array.isArray(data) ? data : data.complaints || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const analytics = useMemo(() => {
    const byCategory = {};
    const byStatus = {};
    const byMonth = {};
    const engineers = {};

    complaints.forEach((complaint) => {
      byCategory[complaint.category || "general"] =
        (byCategory[complaint.category || "general"] || 0) + 1;
      byStatus[normalizeComplaintStatus(complaint.status)] =
        (byStatus[normalizeComplaintStatus(complaint.status)] || 0) + 1;

      const month = complaint.createdAt
        ? new Intl.DateTimeFormat("en-IN", {
            month: "short",
            year: "numeric",
          }).format(new Date(complaint.createdAt))
        : "Unknown";
      byMonth[month] = (byMonth[month] || 0) + 1;

      if (complaint.assignedEngineer?._id) {
        const id = complaint.assignedEngineer._id;
        engineers[id] = engineers[id] || {
          name: complaint.assignedEngineer.name,
          total: 0,
          resolved: 0,
        };
        engineers[id].total += 1;
        if (normalizeComplaintStatus(complaint.status) === "resolved") {
          engineers[id].resolved += 1;
        }
      }
    });

    return { byCategory, byStatus, byMonth, engineers };
  }, [complaints]);

  if (isLoading) {
    return <div className="text-sm text-slate-600">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Lightweight operational analytics from live complaint records.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AnalyticsCard title="Complaints by Category">
          <div className="space-y-4">
            {Object.entries(analytics.byCategory).map(([label, value]) => (
              <BarRow key={label} label={label} value={value} total={complaints.length} />
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Status Distribution">
          <div className="space-y-4">
            {Object.entries(analytics.byStatus).map(([label, value]) => (
              <BarRow key={label} label={label} value={value} total={complaints.length} />
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Monthly Complaint Trends">
          <div className="space-y-4">
            {Object.entries(analytics.byMonth).map(([label, value]) => (
              <BarRow key={label} label={label} value={value} total={complaints.length} />
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Engineer Performance Overview">
          <div className="space-y-4">
            {Object.values(analytics.engineers).length > 0 ? (
              Object.values(analytics.engineers).map((engineer) => (
                <div key={engineer.name} className="rounded-md bg-slate-50 p-3">
                  <p className="font-semibold text-slate-950">{engineer.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {engineer.resolved} resolved of {engineer.total} active
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">
                No engineer assignment data available yet.
              </p>
            )}
          </div>
        </AnalyticsCard>
      </div>
    </div>
  );
}

export default Analytics;
