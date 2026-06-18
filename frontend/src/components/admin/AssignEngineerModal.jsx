import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";

function AssignEngineerModal({ complaint, onClose, onAssigned }) {
  const [engineerId, setEngineerId] = useState(
    complaint?.assignedEngineer?._id || "",
  );
  const [engineers, setEngineers] = useState([]);
  const [isFetchingEngineers, setIsFetchingEngineers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const { data } = await api.get("/admin/engineers");
        setEngineers(data.engineers || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load engineers.",
        );
      } finally {
        setIsFetchingEngineers(false);
      }
    };

    fetchEngineers();
  }, []);

  const handleAssign = async () => {
    if (!engineerId) {
      toast.error("Please select an engineer.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.patch(`/admin/assign/${complaint._id}`, {
        engineerId,
      });
      toast.success(data.message || "Engineer assigned successfully");
      onAssigned();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to assign engineer with the current backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!complaint) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-2xl shadow-slate-950/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              Assign Engineer
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">{complaint.title}</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] text-[#CBD5E1] transition-all duration-200 hover:border-[#F97316]/40 hover:bg-white/[0.04] hover:text-white"
            aria-label="Close assign engineer modal"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <select
          value={engineerId}
          onChange={(event) => setEngineerId(event.target.value)}
          disabled={isFetchingEngineers}
          className="mt-5 w-full rounded-2xl border border-white/[0.08] bg-[#0F172A] px-3 py-3 text-sm text-[#F8FAFC] outline-none transition-all duration-200 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
        >
          <option value="">
            {isFetchingEngineers ? "Loading engineers..." : "Select engineer"}
          </option>
          {engineers.map((engineer) => (
            <option key={engineer._id} value={engineer._id}>
              {engineer.name} - {engineer.email}
            </option>
          ))}
        </select>

        {engineers.length === 0 && (
          <p className="mt-3 text-sm text-[#94A3B8]">
            No engineer accounts found. Create or update a user with the
            engineer role, then try again.
          </p>
        )}

        <button
          type="button"
          disabled={isLoading || isFetchingEngineers || engineers.length === 0}
          className="mt-5 w-full rounded-2xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-[#F97316]/50"
          onClick={handleAssign}
        >
          {isLoading ? "Assigning..." : "Assign Engineer"}
        </button>
      </div>
    </div>
  );
}

export default AssignEngineerModal;
