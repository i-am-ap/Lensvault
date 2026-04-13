import { CalendarDays, Copy, ExternalLink, Link2 } from "lucide-react";

import { formatUploadDate } from "../utils/formatters";


export default function ImageCard({ image, onCopy }) {
  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/40 shadow-panel transition duration-500 hover:-translate-y-1 hover:border-cyan-300/20">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          alt={image.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
          src={image.image_url}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="glass-panel rounded-[24px] border-white/10 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            <Link2 className="h-3.5 w-3.5" />
            Public Link Ready
          </div>

          <div className="mb-3">
            <h3 className="font-display text-xl text-white">{image.title}</h3>
            <p className="mt-2 max-h-12 overflow-hidden text-sm leading-6 text-slate-300">
              {image.description || "No description provided."}
            </p>
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays className="h-4 w-4" />
            {formatUploadDate(image.uploaded_at)}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="button-primary"
              onClick={() => onCopy(image.share_url)}
              type="button"
            >
              <Copy className="h-4 w-4" />
              Copy link
            </button>
            <a
              className="button-secondary"
              href={`/view/${image.image_id}`}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
