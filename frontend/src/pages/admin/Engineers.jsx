import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import EngineerCard from "../../components/admin/EngineerCard.jsx";
import api from "../../services/api.js";

const initialEngineerForm = {
  name: "",
  email: "",
  password: "",
};

function Engineers() {
  const [engineers, setEngineers] = useState([]);
  const [formData, setFormData] = useState(initialEngineerForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const { data } = await api.get("/admin/engineers");
        setEngineers(data.engineers || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load engineer workload.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCreateEngineer = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const { data } = await api.post("/admin/engineers", formData);
      toast.success(data.message || "Engineer created successfully");
      setEngineers((current) => [...current, data.engineer]);
      setFormData(initialEngineerForm);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Engineer creation requires a backend /admin/engineers endpoint.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#F97316]">
              Field team
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Engineers
            </h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Review all engineer accounts and their assigned workload.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Engineer
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 text-sm text-[#94A3B8]">
            Loading engineers...
          </div>
        ) : engineers.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {engineers.map((engineer) => (
              <EngineerCard key={engineer._id} engineer={engineer} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#1E293B] p-8 text-center text-sm text-[#94A3B8]">
            No engineers found. Add an engineer account to assign complaints.
          </div>
        )}

        {isModalOpen && (
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
                  onClick={() => setIsModalOpen(false)}
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
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    minLength={field === "password" ? 8 : undefined}
                    className="w-full rounded-2xl border border-white/[0.08] bg-[#0F172A] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                    placeholder={
                      field.slice(0, 1).toUpperCase() + field.slice(1)
                    }
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-5 w-full rounded-2xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-[#F97316]/50"
              >
                {isSaving ? "Adding..." : "Add Engineer"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default Engineers;
