import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="text-[48px] font-extrabold text-brand mb-2">404</p>
      <p className="text-[16px] font-bold text-ink mb-1">Page not found</p>
      <p className="text-[13.5px] text-muted mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2.5 rounded-pill bg-brand text-white text-[13.5px] font-semibold hover:bg-brand-dark"
      >
        Back to Store
      </Link>
    </main>
  );
}
