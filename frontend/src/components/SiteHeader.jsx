import { Link } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-white font-extrabold text-[13px]">1Fi</span>
          </div>
          <span className="font-extrabold text-[15px] text-ink hidden sm:inline">
            Store
          </span>
        </Link>
        <p className="text-[12px] sm:text-[13px] font-semibold text-muted">
          Shop now, pay later &middot; No-cost EMIs backed by mutual funds
        </p>
      </div>
    </header>
  );
}
