import { useEffect, useState } from "react";
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Assign Engineer
            </h2>
            <p className="mt-1 text-sm text-slate-500">{complaint.title}</p>
          </div>
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <select
          value={engineerId}
          onChange={(event) => setEngineerId(event.target.value)}
          disabled={isFetchingEngineers}
          className="mt-5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
          <p className="mt-3 text-sm text-slate-500">
            No engineer accounts found. Create or update a user with the
            engineer role, then try again.
          </p>
        )}

        <button
          type="button"
          disabled={isLoading || isFetchingEngineers || engineers.length === 0}
          className="mt-5 w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          onClick={handleAssign}
        >
          {isLoading ? "Assigning..." : "Assign Engineer"}
        </button>
      </div>
    </div>
  );
}

export default AssignEngineerModal;
