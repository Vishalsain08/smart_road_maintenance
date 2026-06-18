import { useState } from "react";
import { LockKeyhole, Mail, Road, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const roleRedirects = {
  admin: "/admin",
  citizen: "/citizen",
  engineer: "/engineer",
};

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { user } = await login(formData);
      const redirectTo =
        location.state?.from?.pathname || roleRedirects[user.role] || "/";

      toast.success("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(
        !error.response
          ? "Backend server is not reachable. Start the server and check MongoDB connection."
          : error.response?.data?.message ||
              error.message ||
              "Unable to login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
      <div className="hidden overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] p-10 shadow-lg shadow-slate-950/20 lg:block">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F97316] text-white shadow-sm">
          <Road className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-[#FDBA74]">
          Welcome back
        </p>
        <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-tight text-[#F8FAFC]">
          Sign in to manage civic road maintenance.
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-[#CBD5E1]">
          Access your Road Fix account to submit complaints, review assignments,
          and keep road repair workflows moving.
        </p>
        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-[#0F172A] p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#38BDF8]/10 text-[#38BDF8]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-[#F8FAFC]">Secure role access</p>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Citizens, admins, and engineers continue through their existing dashboards.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#1E293B] p-8 shadow-lg shadow-slate-950/20">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316] lg:hidden">
            <Road className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Login
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Access your Road Fix account.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#E2E8F0]">
              Email
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 transition-all duration-200 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20">
              <Mail className="h-5 w-5 text-[#94A3B8]" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full bg-transparent text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#E2E8F0]">
              Password
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 transition-all duration-200 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20">
              <LockKeyhole className="h-5 w-5 text-[#94A3B8]" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full bg-transparent text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#94A3B8]">
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#F97316] transition-all duration-200 hover:text-orange-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
