import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchProducts, fetchBrands } from "../api/products";
import ProductCard from "../components/ProductCard";
import RecentlyViewed from "../components/RecentlyViewed";
import { ProductGridSkeleton, ErrorState, EmptyState } from "../components/StatusStates";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function HomePage() {
  const [status, setStatus] = useState("loading");
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [brands, setBrands] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchBrands()
      .then(setBrands)
      .catch(() => setBrands([]));
  }, []);

  const loadProducts = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await fetchProducts({
        brand: selectedBrand || undefined,
        search: debouncedSearch || undefined,
      });
      setProducts(data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  }, [selectedBrand, debouncedSearch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sortBy === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [products, sortBy]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[34px] font-extrabold text-ink leading-tight mb-2">
          Shop now, pay later
        </h1>
        <p className="text-[14.5px] text-muted">
          No-cost EMIs backed by your mutual funds. No CIBIL check, no downpayment.
        </p>
      </div>

      <RecentlyViewed />

      {/* Search + Filter + Sort controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="11" cy="11" r="7" stroke="#6F6B7A" strokeWidth="1.8" />
            <path d="M21 21l-4.3-4.3" stroke="#6F6B7A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products or brands..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-line bg-white text-[14px] focus:outline-none focus:border-brand"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-line hover:bg-muted/30 flex items-center justify-center"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#6F6B7A" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-line bg-white text-[13.5px] font-medium focus:outline-none focus:border-brand"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {brands.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setSelectedBrand(null)}
            className={`px-3.5 py-1.5 rounded-pill text-[12.5px] font-semibold border transition-colors ${
              !selectedBrand
                ? "border-brand bg-brand-light text-brand"
                : "border-line bg-white text-muted hover:border-brand/40"
            }`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1.5 rounded-pill text-[12.5px] font-semibold border transition-colors ${
                selectedBrand === brand
                  ? "border-brand bg-brand-light text-brand"
                  : "border-line bg-white text-muted hover:border-brand/40"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      )}

      {status === "loading" && <ProductGridSkeleton />}

      {status === "error" && (
        <ErrorState message={errorMessage} onRetry={loadProducts} />
      )}

      {status === "success" && sortedProducts.length === 0 && (
        <EmptyState
          title="No products found"
          subtitle="Try a different search term or clear the brand filter."
        />
      )}

      {status === "success" && sortedProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
