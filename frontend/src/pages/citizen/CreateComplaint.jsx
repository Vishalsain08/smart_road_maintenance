import { useEffect, useState } from "react";
import { ImagePlus, Send, TextCursorInput } from "lucide-react";
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
    payload.append("address", formData.location.address || "");

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
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/25 bg-[#F97316]/10 px-3 py-1 text-xs font-semibold text-[#FDBA74]">
          <TextCursorInput className="h-4 w-4" aria-hidden="true" />
          New complaint
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#F8FAFC]">
          Report Complaint
        </h1>
        <p className="mt-2 text-sm text-[#94A3B8]">
          Submit a road maintenance issue with a clear image and description.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-sm sm:p-6"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-[#E2E8F0]"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
              placeholder="Large pothole near main road"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-[#E2E8F0]"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
            >
              <option value="">Select category</option>
              {COMPLAINT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-[#E2E8F0]"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="mt-2 block w-full resize-y rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
              placeholder="Describe the issue, nearby landmark, and urgency."
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-[#E2E8F0]"
            >
              Image Upload
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="mt-2 block w-full rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 text-sm text-[#94A3B8] file:mr-4 file:rounded-xl file:border-0 file:bg-[#F97316] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-500"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Complaint preview"
                className="mt-4 h-64 w-full rounded-2xl border border-white/[0.08] object-cover"
              />
            )}
            {!previewUrl && (
              <div className="mt-4 flex h-36 items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-[#0F172A] text-sm text-[#94A3B8]">
                <ImagePlus className="mr-2 h-5 w-5 text-[#F97316]" />
                Image preview will appear here
              </div>
            )}
          </div>

          <LocationPicker
            value={formData.location}
            onChange={(location) =>
              setFormData((current) => ({ ...current, location }))
            }
          />

          {formData.location?.address && (
            <div className="rounded-2xl border border-[#F97316]/20 bg-[#F97316]/10 px-4 py-3 text-sm text-[#FDBA74] lg:col-span-2">
              <span className="font-semibold">Detected address: </span>
              {formData.location.address}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-300 disabled:hover:translate-y-0"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {isLoading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateComplaint;
