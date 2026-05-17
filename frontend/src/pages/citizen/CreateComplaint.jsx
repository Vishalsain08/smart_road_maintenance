import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../../components/citizen/LocationPicker.jsx";
import api from "../../services/api.js";
import { COMPLAINT_CATEGORIES } from "../../utils/complaintConstants.js";

const initialForm = {
  title: "",
  description: "",
  category: "",
  image: null,
  location: null,
};

function CreateComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormData((current) => ({ ...current, image: null }));
      setPreviewUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFormData((current) => ({ ...current, image: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Title is required.";
    }

    if (!formData.description.trim()) {
      return "Description is required.";
    }

    if (!formData.category) {
      return "Please select a category.";
    }

    if (!formData.image) {
      return "Please upload a complaint image.";
    }

    if (
      !Number.isFinite(formData.location?.lat) ||
      !Number.isFinite(formData.location?.lng)
    ) {
      return "Please select the complaint location on the map.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("category", formData.category);
    payload.append("image", formData.image);
    payload.append("location", JSON.stringify(formData.location));
    payload.append("lat", String(formData.location.lat));
    payload.append("lng", String(formData.location.lng));

    setIsLoading(true);

    try {
      const { data } = await api.post("/complaints", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(data.message || "Complaint submitted successfully");
      navigate("/citizen/complaints", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to submit complaint. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Report Complaint
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Submit a road maintenance issue with a clear image and description.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="grid gap-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-slate-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="Large pothole near main road"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="mt-2 block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="Describe the issue, nearby landmark, and urgency."
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-slate-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select category</option>
              {COMPLAINT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-slate-700"
            >
              Image Upload
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Complaint preview"
                className="mt-4 h-56 w-full rounded-lg border border-slate-200 object-cover"
              />
            )}
          </div>

          <LocationPicker
            value={formData.location}
            onChange={(location) =>
              setFormData((current) => ({ ...current, location }))
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {isLoading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateComplaint;
