function AdminTopbar({ user, onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 rounded bg-current" />
            <span className="block h-0.5 w-5 rounded bg-current" />
            <span className="block h-0.5 w-5 rounded bg-current" />
          </span>
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-950">
            Smart Road Maintenance
          </p>
          <p className="text-xs text-slate-500">Municipal admin workspace</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {user?.name?.slice(0, 1)?.toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
