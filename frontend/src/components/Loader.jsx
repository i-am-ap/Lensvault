export default function Loader({ label = "Loading experience..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <div className="loader-ring" />
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
    </div>
  );
}

