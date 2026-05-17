import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES,
} from "../../utils/complaintConstants.js";

function ComplaintFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
}) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto]">
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        placeholder="Search complaints, citizens, engineers"
      />
      <select
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="all">All statuses</option>
        {COMPLAINT_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <select
        value={categoryFilter}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="all">All categories</option>
        {COMPLAINT_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ComplaintFilters;
