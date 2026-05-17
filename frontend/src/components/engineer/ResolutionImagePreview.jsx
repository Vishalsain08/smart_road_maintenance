function ResolutionImagePreview({ src }) {
  if (!src) {
    return (
      <div className="flex h-44 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        Resolution image preview
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Resolution preview"
      className="h-44 w-full rounded-md object-cover"
    />
  );
}

export default ResolutionImagePreview;
