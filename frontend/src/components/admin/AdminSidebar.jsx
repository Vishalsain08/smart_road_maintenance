import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Manage Complaints", path: "/admin/complaints" },
  { label: "Engineers", path: "/admin/engineers" },
  { label: "Analytics", path: "/admin/analytics" },
  { label: "Map Overview", path: "/admin/map" },
];

function AdminSidebar({ user, onClose, onLogout }) {
  const getClass = ({ isActive }) =>
    `block rounded-md px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-emerald-100 text-emerald-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <>
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
            AD
          </span>
          <div>
            <p className="text-sm font-bold text-slate-950">Admin Console</p>
            <p className="text-xs text-slate-500">{user?.name || "Admin"}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={getClass}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          className="w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default AdminSidebar;
