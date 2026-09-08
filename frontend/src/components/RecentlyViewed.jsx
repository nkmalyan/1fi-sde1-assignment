import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentlyViewed, clearRecentlyViewed } from "../utils/recentlyViewed";

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  if (items.length === 0) return null;

  function handleClear() {
    clearRecentlyViewed();
    setItems([]);
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-bold text-muted">Recently Viewed</p>
        <button
          onClick={handleClear}
          className="text-[12px] font-semibold text-brand hover:text-brand-dark"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.id}`}
            className="flex items-center gap-2.5 shrink-0 bg-white border border-line rounded-xl px-3 py-2 hover:border-brand/40 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-surface overflow-hidden flex items-center justify-center shrink-0">
              <img src={item.image} alt={item.name} className="w-7 h-7 object-contain" />
            </div>
            <div>
              <p className="text-[10px] text-muted leading-none mb-0.5">{item.brand}</p>
              <p className="text-[12px] font-semibold text-ink leading-none whitespace-nowrap">
                {item.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
