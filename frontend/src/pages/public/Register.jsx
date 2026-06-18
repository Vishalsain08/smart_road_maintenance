import { useState } from "react";
import { LockKeyhole, Mail, Road, ShieldCheck, User } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      const { confirmPassword, ...registrationData } = formData;

      if (registrationData.password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      await register({ ...registrationData, role: "citizen" });
      toast.success("Registration successful");
      navigate("/citizen", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to register. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#1E293B] p-8 shadow-lg shadow-slate-950/20">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316] lg:hidden">
            <Road className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Register
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Create an account to report and track road issues.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#E2E8F0]">
              Name
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 transition-all duration-200 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20">
              <User className="h-5 w-5 text-[#94A3B8]" aria-hidden="true" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full bg-transparent text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                placeholder="Your full name"
              />
            </div>
          </div>

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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
                className="block w-full bg-transparent text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                placeholder="Create a password"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#E2E8F0]"
            >
              Confirm Password
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0F172A] px-4 py-3 transition-all duration-200 focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20">
              <LockKeyhole className="h-5 w-5 text-[#94A3B8]" aria-hidden="true" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
                required
                className="block w-full bg-transparent text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#94A3B8]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#F97316] transition-all duration-200 hover:text-orange-300"
          >
            Login
          </Link>
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1E293B] p-10 shadow-lg shadow-slate-950/20 lg:block">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F97316] text-white shadow-sm">
          <Road className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-[#FDBA74]">
          Citizen access
        </p>
        <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-tight text-[#F8FAFC]">
          Create one account for reporting and tracking road issues.
        </h1>
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-5">
            <p className="font-semibold text-[#F8FAFC]">Submit complaints</p>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
              Share road damage details with clear location information.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#38BDF8]/10 text-[#38BDF8]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-[#F8FAFC]">Verified civic workflow</p>
                <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                  Your account connects directly to the existing Road Fix complaint process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
