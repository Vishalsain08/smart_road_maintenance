import { useState } from "react";
import { Menu, Road, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const dashboardPaths = {
  admin: "/admin",
  citizen: "/citizen",
  engineer: "/engineer",
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const navLinks = isAuthenticated
    ? [
        { label: "Home", path: "/" },
        { label: "Dashboard", path: dashboardPaths[user?.role] || "/" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];

  const getLinkClass = (link) => ({ isActive }) => {
    const buttonStyle =
      link.label === "Login"
        ? "border border-[#F97316]/70 text-[#F8FAFC] hover:border-[#F97316] hover:bg-[#F97316]/10"
        : link.label === "Register"
          ? "bg-[#F97316] text-white shadow-lg shadow-orange-950/20 hover:bg-orange-500"
          : "";

    if (buttonStyle) {
      return `rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${buttonStyle} ${
        isActive ? "ring-2 ring-[#F97316]/30" : ""
      }`;
    }

    return `rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-white/10 text-[#F97316]"
        : "text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0F172A]/85 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F97316] text-white shadow-lg shadow-orange-950/30">
            <Road className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight text-[#F8FAFC] sm:text-lg">
            Road Fix
          </span>
        </NavLink>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={getLinkClass(link)}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <button
              type="button"
              className="rounded-2xl px-3 py-2 text-sm font-medium text-[#94A3B8] transition-all duration-200 hover:bg-white/5 hover:text-[#F8FAFC]"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] text-[#F8FAFC] transition-all duration-200 hover:border-[#F97316]/60 hover:bg-white/5 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/[0.08] bg-[#0F172A]/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={getLinkClass(link)}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <button
                type="button"
                className="rounded-2xl px-3 py-2 text-left text-sm font-medium text-[#94A3B8] transition-all duration-200 hover:bg-white/5 hover:text-[#F8FAFC]"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
