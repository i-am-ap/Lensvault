import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import { api, getErrorMessage } from "../services/api";


export default function Upload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [file]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("image", file);

    try {
      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (event) => {
          if (!event.total) {
            return;
          }

          const nextProgress = Math.round((event.loaded * 100) / event.total);
          setProgress(nextProgress);
        }
      });

      toast.success("Image uploaded and share link generated.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to upload image."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell min-h-screen pb-12">
      <div className="ambient-grid" />
      <Navbar />

      <main className="relative mx-auto mt-8 max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Upload workflow</p>
            <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl">
              Publish a new image
            </h1>
          </div>

          <Link
            className="button-secondary"
            to="/dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <form className="glass-panel rounded-[36px] p-6 sm:p-8" onSubmit={handleSubmit}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-400/10">
                <UploadCloud className="h-7 w-7 text-cyan-200" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">New release</p>
                <h2 className="font-display text-3xl text-white">
                  Create a public share page
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <UploadBox
                disabled={isSubmitting}
                file={file}
                onClearFile={() => setFile(null)}
                onFileChange={setFile}
                previewUrl={previewUrl}
              />

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-200">Title</span>
                <input
                  className="input-shell"
                  disabled={isSubmitting}
                  maxLength={150}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Midnight skyline study"
                  required
                  type="text"
                  value={title}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-200">Description</span>
                <textarea
                  className="input-shell min-h-[140px] resize-none"
                  disabled={isSubmitting}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Add a caption or short context for the public viewer."
                  value={description}
                />
              </label>

              {isSubmitting && (
                <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-400/10 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-cyan-100">Uploading to Cloudinary</span>
                    <span className="text-cyan-100">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-900/70">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#f59e0b)] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                className="button-primary w-full justify-center py-3"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Publishing..." : "Publish image"}
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="glass-panel rounded-[36px] p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-cyan-300" />
                <h2 className="font-display text-2xl text-white">
                  Upload guardrails
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  "Each upload receives its own unique page, ready to send in one click.",
                  "Titles and descriptions travel with the image so every post has context.",
                  "Cloudinary hosts the asset while LensVault keeps the metadata organized."
                ].map((item) => (
                  <div
                    className="flex gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4"
                    key={item}
                  >
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[36px] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Presentation</p>
              <h2 className="mt-3 font-display text-2xl text-white">
                Premium public viewer included
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Shared pages feature a blurred image backdrop, strong typography, smooth motion, and a responsive layout that feels intentional on both mobile and desktop.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
