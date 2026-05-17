function EngineerTopbar({ user, onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 md:hidden"
          onClick={onOpenSidebar}
        >
          Menu
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-950">
            Field Work Console
          </p>
          <p className="text-xs text-slate-500">
            Review assigned issues and close completed repairs.
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-950">
            {user?.name || "Engineer"}
          </p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
    </header>
  );
}

export default EngineerTopbar;
