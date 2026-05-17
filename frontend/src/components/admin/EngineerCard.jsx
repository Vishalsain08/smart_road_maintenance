function EngineerCard({ engineer, onDelete }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-950">{engineer.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{engineer.email}</p>
        </div>
        <button
          type="button"
          className="rounded-md px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          onClick={() => onDelete(engineer)}
        >
          Delete
        </button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Active</p>
          <p className="mt-1 text-xl font-bold text-slate-950">
            {engineer.assignedComplaintsCount || 0}
          </p>
        </div>
        <div className="rounded-md bg-green-50 p-3">
          <p className="text-xs font-semibold text-green-700">Resolved</p>
          <p className="mt-1 text-xl font-bold text-green-800">
            {engineer.resolvedComplaintsCount || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EngineerCard;
