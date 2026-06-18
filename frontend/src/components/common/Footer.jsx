import { Link } from "react-router-dom";
import { Road } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0B1120]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F97316] text-white">
              <Road className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-base font-semibold text-[#F8FAFC]">Road Fix</p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#94A3B8]">
            A civic platform for reporting, reviewing, assigning, and resolving
            road maintenance complaints through a centralized workflow.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#F8FAFC]">Quick Links</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link className="text-[#94A3B8] transition-all duration-200 hover:text-[#F97316]" to="/">
              Home
            </Link>
            <Link className="text-[#94A3B8] transition-all duration-200 hover:text-[#F97316]" to="/login">
              Login
            </Link>
            <Link className="text-[#94A3B8] transition-all duration-200 hover:text-[#F97316]" to="/register">
              Register
            </Link>
          </div>
        </div>
        <div className="md:text-right">
          <p className="text-sm text-[#94A3B8]">
            &copy; {new Date().getFullYear()} Road Fix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
