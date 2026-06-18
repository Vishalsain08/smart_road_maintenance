function ResolutionImagePreview({ src }) {
  if (!src) {
    return (
      <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-[#0F172A] text-sm text-[#94A3B8]">
        Resolution image preview
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Resolution preview"
      className="h-44 w-full rounded-2xl object-cover"
    />
  );
}

export default ResolutionImagePreview;
