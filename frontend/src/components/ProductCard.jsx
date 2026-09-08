import { Link } from "react-router-dom";
import { formatINR } from "../utils/format";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group rounded-card bg-white border border-line p-4 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="w-full aspect-square rounded-2xl bg-surface mb-4 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-3/4 h-3/4 object-contain group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>
      <p className="text-[12px] font-medium text-muted mb-0.5">{product.brand}</p>
      <p className="text-[15px] font-bold text-ink leading-snug mb-2 line-clamp-2">
        {product.name}
      </p>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[17px] font-extrabold text-ink">
          {formatINR(product.price)}
        </span>
        {product.mrp > product.price && (
          <span className="text-[12.5px] text-muted line-through">
            {formatINR(product.mrp)}
          </span>
        )}
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-pill bg-brand-light px-2.5 py-1.5">
        <span className="text-[11.5px] font-bold text-brand">
          {formatINR(product.startingEmi)}/mo
        </span>
        <span className="text-[11.5px] text-brand-dark">
          &middot; up to {product.maxTenure} months
        </span>
      </div>
    </Link>
  );
}
