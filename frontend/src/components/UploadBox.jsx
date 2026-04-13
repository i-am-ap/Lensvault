import { ImagePlus, RefreshCcw, Sparkles, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";


function isImageFile(file) {
  return file?.type?.startsWith("image/");
}


export default function UploadBox({
  file,
  previewUrl,
  disabled,
  onClearFile,
  onFileChange
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile || !isImageFile(selectedFile)) {
      return;
    }

    onFileChange(selectedFile);
  };

  const onInputChange = (event) => {
    handleFileSelection(event.target.files?.[0]);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[32px] border border-dashed px-6 py-6 transition duration-300",
        isDragging
          ? "border-cyan-300 bg-cyan-400/10 shadow-glow"
          : "border-white/10 bg-white/5"
      ].join(" ")}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFileSelection(event.dataTransfer.files?.[0]);
      }}
    >
      <input
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={onInputChange}
        ref={inputRef}
        type="file"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.16),transparent_32%)]" />

      <div className="relative z-10 space-y-5">
        {!file ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/60 text-cyan-300 shadow-glow">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-white">
                Drag, drop, and publish a polished visual story.
              </h3>
              <p className="max-w-xl text-sm leading-7 text-slate-300">
                Build a premium post page around each image with elegant presentation and a shareable destination link.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="button-primary"
                disabled={disabled}
                onClick={openPicker}
                type="button"
              >
                <ImagePlus className="h-4 w-4" />
                Select image
              </button>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                <Sparkles className="h-4 w-4 text-amber-300" />
                PNG, JPG, GIF, WEBP
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/60">
              <img
                alt={file.name}
                className="h-full w-full object-cover"
                src={previewUrl}
              />
            </div>

            <div className="flex flex-col justify-between gap-5">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Preview Ready
                </div>
                <h3 className="font-display text-2xl text-white">{file.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Add the title and description, then publish. A unique public link will be generated automatically.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="button-secondary"
                  disabled={disabled}
                  onClick={openPicker}
                  type="button"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Replace
                </button>
                <button
                  className="button-secondary"
                  disabled={disabled}
                  onClick={onClearFile}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
