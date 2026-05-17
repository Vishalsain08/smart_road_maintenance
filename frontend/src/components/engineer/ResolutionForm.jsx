import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import ResolutionImagePreview from "./ResolutionImagePreview.jsx";

function ResolutionForm({ complaintId, onResolved }) {
  const [resolutionImage, setResolutionImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!resolutionImage) {
      setPreviewUrl("");
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(resolutionImage);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [resolutionImage]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resolutionImage) {
      toast.error("Please upload a resolution image.");
      return;
    }

    const payload = new FormData();
    payload.append("image", resolutionImage);
    payload.append("resolutionNotes", resolutionNotes);

    setIsSubmitting(true);

    try {
      const { data } = await api.patch(
        `/engineer/complaints/${complaintId}/upload`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success(data.message || "Complaint resolved successfully");
      setResolutionImage(null);
      setResolutionNotes("");
      onResolved?.(data.complaint);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to submit resolution.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-950">
        Submit Resolution
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Upload repair proof and notes to mark this complaint as resolved.
      </p>

      <div className="mt-5 space-y-4">
        <ResolutionImagePreview src={previewUrl} />

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setResolutionImage(event.target.files?.[0] || null)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />

        <textarea
          value={resolutionNotes}
          onChange={(event) => setResolutionNotes(event.target.value)}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          placeholder="Resolution notes"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
      >
        {isSubmitting ? "Submitting..." : "Submit Resolution"}
      </button>
    </form>
  );
}

export default ResolutionForm;
