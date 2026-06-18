import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ImageUp } from "lucide-react";
import api from "../../services/api.js";
import ResolutionImagePreview from "./ResolutionImagePreview.jsx";

function ResolutionForm({ complaintId, onResolved }) {
  const [resolutionImage, setResolutionImage] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewUrl = useMemo(
    () => (resolutionImage ? URL.createObjectURL(resolutionImage) : ""),
    [resolutionImage],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
      className="rounded-2xl border border-white/[0.08] bg-[#1E293B] p-5 shadow-lg shadow-slate-950/10"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
          <ImageUp className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            Upload Resolution Image
          </h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Upload repair proof and notes to mark this complaint as resolved.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <ResolutionImagePreview src={previewUrl} />

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setResolutionImage(event.target.files?.[0] || null)}
          className="w-full rounded-2xl border border-white/[0.08] bg-[#0F172A] px-3 py-2.5 text-sm text-[#CBD5E1] outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-[#F97316] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
        />

        <textarea
          value={resolutionNotes}
          onChange={(event) => setResolutionNotes(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-white/[0.08] bg-[#0F172A] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
          placeholder="Resolution notes"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-[#F97316]/50"
      >
        {isSubmitting ? "Submitting..." : "Submit Resolution"}
      </button>
    </form>
  );
}

export default ResolutionForm;
