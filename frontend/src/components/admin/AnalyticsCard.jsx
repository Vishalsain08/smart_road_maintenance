function AnalyticsCard({ title, value, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-slate-950">{title}</h2>
        {value !== undefined && (
          <span className="text-sm font-bold text-emerald-700">{value}</span>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default AnalyticsCard;
