import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../../components/citizen/EmptyState.jsx";
import LoadingSpinner from "../../components/citizen/LoadingSpinner.jsx";
import AssignedComplaintCard from "../../components/engineer/AssignedComplaintCard.jsx";
import api from "../../services/api.js";
import {
  COMPLAINT_STATUSES,
  normalizeComplaintStatus,
} from "../../utils/complaintConstants.js";

function AssignedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const filteredComplaints = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !searchValue ||
        complaint.title?.toLowerCase().includes(searchValue) ||
        complaint.category?.toLowerCase().includes(searchValue) ||
        complaint.description?.toLowerCase().includes(searchValue);
      const matchesStatus =
        statusFilter === "all" ||
        normalizeComplaintStatus(complaint.status) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchTerm, statusFilter]);

  if (isLoading) {
    return <LoadingSpinner label="Loading assigned complaints..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Assigned Complaints
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Work items assigned to your engineer account.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-72"
            placeholder="Search complaints"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">All Statuses</option>
            {COMPLAINT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredComplaints.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredComplaints.map((complaint) => (
            <AssignedComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No assigned complaints found"
          message="Try changing the search or status filter, or check back after an admin assigns work to you."
        />
      )}
    </div>
  );
}

export default AssignedComplaints;
