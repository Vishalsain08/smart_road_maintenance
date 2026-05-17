function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-base font-semibold text-slate-950">
            Smart Road Maintenance System
          </p>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
            A civic platform for reporting, tracking, and resolving road
            maintenance issues with better visibility.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Smart Road Maintenance System. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
