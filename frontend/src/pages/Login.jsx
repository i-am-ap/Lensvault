import {
  ArrowRight,
  Camera,
  Link2,
  LockKeyhole,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { api, getErrorMessage } from "../services/api";


const highlights = [
  "Cinematic public pages for every shared image",
  "Cloudinary-backed media with clean metadata storage",
  "Fast publishing workflow built for curated visual drops"
];


export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    hasAdmin: false
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [setupData, setSetupData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingSetup, setIsSubmittingSetup] = useState(false);

  const redirectTarget = location.state?.from || "/dashboard";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/auth/status");
        const hasAdmin = Boolean(response.data?.has_admin);
        const existingUsername = response.data?.admin?.username || "";

        setAuthStatus({
          isLoading: false,
          hasAdmin
        });

        if (existingUsername) {
          setLoginData((current) => ({
            ...current,
            username: current.username || existingUsername
          }));
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Unable to load authentication state."));
        setAuthStatus({
          isLoading: false,
          hasAdmin: true
        });
      }
    };

    fetchStatus();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmittingLogin(true);

    try {
      await login(loginData);
      toast.success("Welcome back. Admin session is live.");
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign in."));
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleSetup = async (event) => {
    event.preventDefault();

    if (setupData.password !== setupData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmittingSetup(true);

    try {
      await api.post("/setup-admin", {
        username: setupData.username.trim(),
        password: setupData.password
      });

      setAuthStatus({
        isLoading: false,
        hasAdmin: true
      });
      setLoginData({
        username: setupData.username.trim(),
        password: ""
      });
      setSetupData({
        username: "",
        password: "",
        confirmPassword: ""
      });
      toast.success("Admin account created. Sign in to continue.");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to create admin account.");
      toast.error(message);

      if (error?.response?.status === 409) {
        setAuthStatus({
          isLoading: false,
          hasAdmin: true
        });
      }
    } finally {
      setIsSubmittingSetup(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  if (authStatus.isLoading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-6">
        <Loader label="Preparing LensVault..." />
      </div>
    );
  }

  return (
    <div className="page-shell relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="ambient-grid" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="animate-fade-up space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            LensVault
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Turn every image link into a polished showcase.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              LensVault gives your uploads a premium stage: elegant viewing pages, fast sharing, and a dashboard that keeps your visual library organized.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="glass-panel rounded-[28px] px-5 py-5 animate-fade-up"
              >
                <Sparkles className="mb-3 h-5 w-5 text-amber-300" />
                <p className="text-sm leading-6 text-slate-200">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-[32px] p-6 lg:max-w-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Camera className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Visual-first workflow
                </p>
                <h2 className="font-display text-xl text-white">
                  Designed for curated releases
                </h2>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-300">
              From campaign stills to design previews, each post gets a clean destination page with atmospheric presentation, smooth motion, and a link that is easy to pass around.
            </p>
          </div>
        </section>

        <section className="animate-fade-up">
          <div className="glass-panel rounded-[36px] p-8 shadow-glow sm:p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-400/10">
                {authStatus.hasAdmin ? (
                  <LockKeyhole className="h-7 w-7 text-cyan-200" />
                ) : (
                  <Link2 className="h-7 w-7 text-cyan-200" />
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
                  {authStatus.hasAdmin ? "Admin sign-in" : "First-time setup"}
                </p>
                <h2 className="font-display text-3xl text-white">
                  {authStatus.hasAdmin ? "Secure access" : "Create your admin account"}
                </h2>
              </div>
            </div>

            {authStatus.hasAdmin ? (
              <form className="space-y-5" onSubmit={handleLogin}>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-200">Username</span>
                  <input
                    autoComplete="username"
                    className="input-shell"
                    onChange={(event) =>
                      setLoginData((current) => ({
                        ...current,
                        username: event.target.value
                      }))
                    }
                    placeholder="Enter your username"
                    required
                    type="text"
                    value={loginData.username}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-200">Password</span>
                  <input
                    autoComplete="current-password"
                    className="input-shell"
                    onChange={(event) =>
                      setLoginData((current) => ({
                        ...current,
                        password: event.target.value
                      }))
                    }
                    placeholder="Enter your password"
                    required
                    type="password"
                    value={loginData.password}
                  />
                </label>

                <button
                  className="button-primary w-full justify-center py-3"
                  disabled={isSubmittingLogin}
                  type="submit"
                >
                  {isSubmittingLogin ? "Signing in..." : "Unlock dashboard"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSetup}>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-200">Admin username</span>
                  <input
                    autoComplete="username"
                    className="input-shell"
                    minLength={3}
                    onChange={(event) =>
                      setSetupData((current) => ({
                        ...current,
                        username: event.target.value
                      }))
                    }
                    placeholder="Choose a username"
                    required
                    type="text"
                    value={setupData.username}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-200">Password</span>
                  <input
                    autoComplete="new-password"
                    className="input-shell"
                    minLength={8}
                    onChange={(event) =>
                      setSetupData((current) => ({
                        ...current,
                        password: event.target.value
                      }))
                    }
                    placeholder="Use at least 8 characters"
                    required
                    type="password"
                    value={setupData.password}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-200">Confirm password</span>
                  <input
                    autoComplete="new-password"
                    className="input-shell"
                    minLength={8}
                    onChange={(event) =>
                      setSetupData((current) => ({
                        ...current,
                        confirmPassword: event.target.value
                      }))
                    }
                    placeholder="Re-enter your password"
                    required
                    type="password"
                    value={setupData.confirmPassword}
                  />
                </label>

                <button
                  className="button-primary w-full justify-center py-3"
                  disabled={isSubmittingSetup}
                  type="submit"
                >
                  {isSubmittingSetup ? "Creating account..." : "Create admin account"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
