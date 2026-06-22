"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, clearError } from "@/store/slices/auth.slice";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router    = useRouter();
  const dispatch  = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      toast.success("Welcome back!");
      router.push("/dashboard");
    } else {
      toast.error(String((result as any).error?.message ?? "Invalid credentials"));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* grid pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#d4d4d4 1px, transparent 1px), linear-gradient(90deg, #d4d4d4 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,#f5f5f5,transparent)]" />

      {/* card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* logo */}
        <div className="mb-8 text-center">
          <span className="text-sm font-black tracking-widest uppercase text-neutral-900">
            Viklance
          </span>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mt-1">
            Admin Panel
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-black text-neutral-900 tracking-tight mb-1">
            Sign in
          </h1>
          <p className="text-sm text-neutral-500 mb-7">
            Enter your credentials to continue.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@viklance.dev"
                className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-neutral-300 bg-white rounded-xl px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M3 3l10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-neutral-900 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-neutral-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9.5 9.5L12 7l-2.5-2.5M12 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-neutral-400 mt-6">
          Viklance Admin · Internal use only
        </p>
      </div>
    </div>
  );
}
