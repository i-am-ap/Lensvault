import { Copy, Download, Link2, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import Loader from "../components/Loader";
import { api, getErrorMessage } from "../services/api";
import { copyText, formatUploadDate } from "../utils/formatters";


export default function ViewImage() {
  const { imageId } = useParams();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);

      try {
        const response = await api.get(`/image/${imageId}`);
        setImage(response.data.image);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Image not found."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

  const handleCopy = async () => {
    if (!image?.share_url) {
      return;
    }

    try {
      await copyText(image.share_url);
      toast.success("Share link copied.");
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-6">
        <Loader label="Loading image..." />
      </div>
    );
  }

  if (errorMessage || !image) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-6">
        <div className="glass-panel max-w-xl rounded-[36px] p-8 text-center">
          <LoaderCircle className="mx-auto h-10 w-10 text-amber-300" />
          <h1 className="mt-5 font-display text-3xl text-white">Link unavailable</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {errorMessage || "The requested image could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-35 blur-3xl"
        style={{ backgroundImage: `url(${image.image_url})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,rgba(5,8,22,0.2),rgba(5,8,22,0.92))]" />

      <main className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/50 shadow-panel backdrop-blur-xl">
          <img
            alt={image.title}
            className="h-full max-h-[78vh] w-full object-cover"
            src={image.image_url}
          />
        </section>

        <section className="glass-panel rounded-[36px] p-8 sm:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            <Link2 className="h-3.5 w-3.5" />
            LensVault viewer
          </div>

          <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            {image.title}
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-300">
            {image.description || "No description was added for this image."}
          </p>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Published</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {formatUploadDate(image.uploaded_at)}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="button-primary"
              onClick={handleCopy}
              type="button"
            >
              <Copy className="h-4 w-4" />
              Copy share link
            </button>

            <a
              className="button-secondary"
              href={image.image_url}
              rel="noreferrer"
              target="_blank"
            >
              <Download className="h-4 w-4" />
              Open original
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
