import { ArrowRight, Images, Link2, RefreshCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import ImageCard from "../components/ImageCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { api, getErrorMessage } from "../services/api";
import { copyText, formatUploadDate } from "../utils/formatters";


export default function Dashboard() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadImages = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await api.get("/images");
      setImages(response.data.images || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load uploaded images."));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleCopy = async (shareUrl) => {
    try {
      await copyText(shareUrl);
      toast.success("Share link copied to clipboard.");
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  const latestUpload = images[0]?.uploaded_at
    ? formatUploadDate(images[0].uploaded_at)
    : "No uploads yet";

  return (
    <div className="page-shell min-h-screen pb-10">
      <div className="ambient-grid" />
      <Navbar />

      <main className="relative mx-auto mt-8 max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
          <div className="glass-panel rounded-[36px] p-8 sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              LensVault studio
            </div>
            <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
              Curate image drops and share them with a single clean link.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Your library stays organized while each upload becomes a refined public presentation with title, description, and a ready-to-share destination.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="button-primary" to="/upload">
                Upload new image
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                className="button-secondary"
                disabled={isRefreshing}
                onClick={() => loadImages(false)}
                type="button"
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="glass-panel rounded-[30px] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total uploads</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <span className="font-display text-5xl text-white">{images.length}</span>
                <Images className="h-10 w-10 text-cyan-300" />
              </div>
            </div>

            <div className="glass-panel rounded-[30px] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Latest publish</p>
              <div className="mt-4 flex items-start justify-between gap-4">
                <p className="max-w-[13rem] text-lg font-semibold leading-7 text-white">
                  {latestUpload}
                </p>
                <Link2 className="h-10 w-10 text-amber-300" />
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[36px] p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Library</p>
              <h2 className="mt-2 font-display text-3xl text-white">
                Uploaded images
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Review the final presentation, copy links instantly, and keep every visual piece ready for clients, collaborators, or launches.
            </p>
          </div>

          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <Loader label="Loading dashboard..." />
            </div>
          ) : images.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center">
              <h3 className="font-display text-2xl text-white">No uploads yet</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-300">
                Start by uploading your first image. As soon as it is published, the dashboard will show a live share card here.
              </p>
              <Link className="button-primary mt-6 inline-flex" to="/upload">
                Upload first image
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {images.map((image) => (
                <ImageCard
                  image={image}
                  key={image.image_id}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
