export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-card bg-white border border-line p-4">
          <div className="w-full aspect-square rounded-2xl bg-line animate-pulse mb-4" />
          <div className="h-3 w-2/3 rounded bg-line animate-pulse mb-2" />
          <div className="h-4 w-1/2 rounded bg-line animate-pulse mb-3" />
          <div className="h-6 w-3/4 rounded-pill bg-line animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-pulse">
      <div className="w-full aspect-square rounded-card bg-line" />
      <div className="space-y-4">
        <div className="h-4 w-1/3 rounded bg-line" />
        <div className="h-7 w-2/3 rounded bg-line" />
        <div className="h-6 w-1/3 rounded bg-line" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-line" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-20">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 003.5 20.5h17a1.5 1.5 0 001.39-2.46L13.71 3.86a1.5 1.5 0 00-2.42 0z"
            stroke="#DC2626"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-[16px] font-bold text-ink mb-1">
        Couldn't load this right now
      </p>
      <p className="text-[13.5px] text-muted mb-5">
        {message || "Check your connection and try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-pill bg-brand text-white text-[13.5px] font-semibold hover:bg-brand-dark"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-24">
      <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7h16l-1.5 12.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 7z"
            stroke="#6C28D9"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M8 7V5a4 4 0 018 0v2" stroke="#6C28D9" strokeWidth="1.6" />
        </svg>
      </div>
      <p className="text-[15px] font-bold text-ink mb-1">{title}</p>
      {subtitle && <p className="text-[13.5px] text-muted">{subtitle}</p>}
    </div>
  );
}
