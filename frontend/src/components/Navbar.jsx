import { LayoutDashboard, LogOut, ShieldCheck, UploadCloud } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    to: "/upload",
    label: "Upload",
    icon: UploadCloud
  }
];


export default function Navbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-4 z-30 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="glass-panel flex flex-col gap-4 rounded-[28px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-glow">
            <ShieldCheck className="h-6 w-6 text-cyan-300" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
              LensVault
            </p>
            <h1 className="font-display text-lg text-white">Publishing studio</h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-wrap gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-300",
                    isActive
                      ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100 shadow-glow"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/30 hover:text-white"
                  ].join(" ")
                }
                to={to}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Logged in
              </p>
              <p className="text-sm font-semibold text-white">
                {admin?.username || "admin"}
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-300/30 hover:text-white"
              onClick={handleLogout}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
