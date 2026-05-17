import { useEffect, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredEngineers = engineers.filter((engineer) => {
    const value = searchTerm.trim().toLowerCase();
    return (
      !value ||
      engineer.name?.toLowerCase().includes(value) ||
      engineer.email?.toLowerCase().includes(value)
    );
  });

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

  const handleDelete = async (engineer) => {
    const confirmed = window.confirm(`Delete engineer "${engineer.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      const { data } = await api.delete(`/admin/engineers/${engineer._id}`);
      toast.success(data.message || "Engineer deleted successfully");
      setEngineers((current) =>
        current.filter((item) => item._id !== engineer._id),
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Engineer deletion requires a backend /admin/engineers/:id endpoint.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Engineers
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage engineer accounts and review workload.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          onClick={() => setIsModalOpen(true)}
        >
          Create Engineer
        </button>
      </div>

      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:max-w-md"
        placeholder="Search engineers"
      />

      {isLoading ? (
        <div className="text-sm text-slate-600">Loading engineers...</div>
      ) : filteredEngineers.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEngineers.map((engineer) => (
            <EngineerCard
              key={engineer._id}
              engineer={engineer}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          No engineers found. Create an engineer account to assign complaints.
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
          <form
            onSubmit={handleCreateEngineer}
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Create Engineer
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  New engineers can log in with this email and password.
                </p>
              </div>
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
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
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  minLength={field === "password" ? 8 : undefined}
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  placeholder={field.slice(0, 1).toUpperCase() + field.slice(1)}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-5 w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-400"
            >
              {isSaving ? "Creating..." : "Create Engineer"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Engineers;
