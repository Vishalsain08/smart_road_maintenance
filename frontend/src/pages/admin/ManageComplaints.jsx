import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminComplaintDetails from "../../components/admin/AdminComplaintDetails.jsx";
import AssignEngineerModal from "../../components/admin/AssignEngineerModal.jsx";
import ComplaintFilters from "../../components/admin/ComplaintFilters.jsx";
import ComplaintTable from "../../components/admin/ComplaintTable.jsx";
import api from "../../services/api.js";
import { normalizeComplaintStatus } from "../../utils/complaintConstants.js";

const pageSize = 8;

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignComplaint, setAssignComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadComplaints = async () => {
    const { data } = await api.get("/admin/complaints");
    return Array.isArray(data) ? data : data.complaints || [];
  };

  useEffect(() => {
    const fetchInitialComplaints = async () => {
      try {
        const nextComplaints = await loadComplaints();
        setComplaints(nextComplaints);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load complaints.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialComplaints();
  }, []);

  const refreshComplaints = async () => {
    const nextComplaints = await loadComplaints();
    setComplaints(nextComplaints);
  };

  const filteredComplaints = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !searchValue ||
        complaint.title?.toLowerCase().includes(searchValue) ||
        complaint.category?.toLowerCase().includes(searchValue) ||
        complaint.reportedBy?.name?.toLowerCase().includes(searchValue) ||
        complaint.assignedEngineer?.name?.toLowerCase().includes(searchValue);
      const matchesStatus =
        statusFilter === "all" ||
        normalizeComplaintStatus(complaint.status) === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || complaint.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, complaints, searchTerm, statusFilter]);

  const totalPages = Math.max(Math.ceil(filteredComplaints.length / pageSize), 1);
  const visibleComplaints = filteredComplaints.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleStatusChange = async (complaint, status) => {
    try {
      const { data } = await api.patch(`/admin/status/${complaint._id}`, {
        status,
      });
      toast.success(data.message || "Status updated");
      refreshComplaints();
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
      refreshComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete complaint.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Manage Complaints
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review, assign, update, and remove road maintenance complaints.
        </p>
      </div>

      <ComplaintFilters
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryChange={(value) => {
          setCategoryFilter(value);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="text-sm text-slate-600">Loading complaints...</div>
      ) : visibleComplaints.length > 0 ? (
        <ComplaintTable
          complaints={visibleComplaints}
          onView={setSelectedComplaint}
          onAssign={setAssignComplaint}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          No complaints match the selected filters.
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page === totalPages}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50"
            onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
          >
            Next
          </button>
        </div>
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
          onAssigned={refreshComplaints}
        />
      )}
    </div>
  );
}

export default ManageComplaints;
