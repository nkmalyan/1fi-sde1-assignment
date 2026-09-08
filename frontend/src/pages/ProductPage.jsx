import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../api/products";
import { createPaymentOrder, verifyPayment } from "../api/payment";
import VariantSelector from "../components/VariantSelector";
import EMIPlanCard from "../components/EMIPlanCard";
import { ProductDetailSkeleton, ErrorState } from "../components/StatusStates";
import { formatINR } from "../utils/format";
import { addToRecentlyViewed } from "../utils/recentlyViewed";

export default function ProductPage() {
  const { productId } = useParams();
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle | processing | error
  const [paymentError, setPaymentError] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  const loadProduct = useCallback(async () => {
    setStatus("loading");
    setConfirmed(false);
    try {
      const data = await fetchProductById(productId);
      setProduct(data);
      if (data?.variants?.length > 0) setSelectedVariant(data.variants[0]);
      if (data?.emiPlans?.length > 0) setSelectedPlan(data.emiPlans[0]);
      setStatus("success");

      if (data) {
        addToRecentlyViewed({
          id: data.id,
          name: data.name,
          brand: data.brand,
          image: data.variants?.[0]?.image,
        });
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to load product");
      setStatus("error");
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  async function handleProceed() {
    setPaymentStatus("processing");
    setPaymentError("");

    try {
      const order = await createPaymentOrder({
        amount: selectedPlan.monthlyAmount,
        productId: product.id,
        planId: selectedPlan.id,
      });

      if (!window.Razorpay) {
        throw new Error("Payment SDK failed to load. Check your connection and retry.");
      }

      const razorpayCheckout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "1Fi Store",
        description: `${product.name} — ${selectedPlan.tenureMonths} month EMI`,
        theme: { color: "#6C28D9" },
        handler: async (response) => {
          try {
            await verifyPayment(response);
            setPaymentNote("Payment verified via Razorpay");
            setConfirmed(true);
            setPaymentStatus("idle");
          } catch (err) {
            setPaymentError(err.message || "Payment verification failed");
            setPaymentStatus("error");
          }
        },
        modal: {
          ondismiss: () => setPaymentStatus("idle"),
        },
      });

      razorpayCheckout.open();
      setPaymentStatus("idle");
    } catch (err) {
      // Graceful fallback: if payments aren't configured on the backend
      // (no Razorpay keys set), don't block the demo — confirm the plan
      // locally and say so explicitly, rather than pretending it's a real
      // transaction.
      if (err.status === 503) {
        setConfirmed(true);
        setPaymentNote("Demo confirmation — payment gateway not configured");
        setPaymentStatus("idle");
        return;
      }
      setPaymentError(err.message || "Something went wrong. Please try again.");
      setPaymentStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <ProductDetailSkeleton />
      </main>
    );
  }

  if (status === "error" || !product) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <ErrorState message={errorMessage || "Product not found"} onRetry={loadProduct} />
      </main>
    );
  }

  const variant = selectedVariant || product.variants[0];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[12.5px] text-muted mb-4">
        <Link to="/" className="hover:text-brand">Home</Link>
        <span>/</span>
        <span className="text-muted">{product.category}</span>
        <span>/</span>
        <span className="text-ink font-semibold">{product.name}</span>
      </nav>

      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-brand mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Store
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div
          className="w-full aspect-square rounded-card border border-line overflow-hidden flex items-center justify-center transition-colors duration-300"
          style={{
            background: `radial-gradient(circle at 50% 42%, ${variant.colorHex}33, #FFFFFF 68%)`,
          }}
        >
          <img
            src={variant.image}
            alt={`${product.name} in ${variant.color}`}
            className="w-3/4 h-3/4 object-contain"
          />
        </div>

        {/* Details */}
        <div>
          <p className="text-[13px] font-semibold text-brand mb-1">{product.brand}</p>
          <h1 className="text-[24px] sm:text-[28px] font-extrabold text-ink leading-tight mb-2">
            {product.name} &middot; {variant.storage}
          </h1>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-[24px] font-extrabold text-ink">
              {formatINR(variant.price)}
            </span>
            {variant.mrp > variant.price && (
              <span className="text-[15px] text-muted line-through">
                {formatINR(variant.mrp)}
              </span>
            )}
          </div>

          <VariantSelector
            variants={product.variants}
            selectedVariant={variant}
            onSelect={setSelectedVariant}
          />

          {variant.specs && (
            <div className="bg-white rounded-card border border-line p-4 mt-6">
              <p className="text-[13px] font-bold text-ink mb-3">Key Specifications</p>
              <div className="grid grid-cols-2 gap-2">
                <SpecItem label="Processor" value={variant.specs.processor} />
                <SpecItem label="RAM" value={variant.specs.ram} />
                <SpecItem label="Camera" value={variant.specs.camera} wide />
                <SpecItem label="Display" value={variant.specs.display} wide />
                <SpecItem label="Battery" value={variant.specs.battery} />
                <SpecItem label="Warranty" value={variant.specs.warranty} />
              </div>
            </div>
          )}

          <p className="text-[13.5px] text-muted leading-relaxed mt-6 mb-6">
            {product.description}
          </p>

          <div>
            <p className="text-[15px] font-bold text-ink mb-1">
              EMI plans backed by mutual funds
            </p>
            <p className="text-[13px] text-muted mb-3">
              Choose a tenure. No CIBIL check, no downpayment.
            </p>
            <div className="space-y-2.5">
              {product.emiPlans.map((plan) => (
                <EMIPlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan?.id === plan.id}
                  onSelect={setSelectedPlan}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            {confirmed ? (
              <div className="flex flex-col items-center gap-1 py-3.5 rounded-pill bg-brand-light">
                <span className="text-[14px] font-semibold text-brand">
                  Plan confirmed &middot; {selectedPlan.tenureMonths} months at{" "}
                  {formatINR(selectedPlan.monthlyAmount)}/mo
                </span>
                {paymentNote && (
                  <span className="text-[11px] text-brand-dark">{paymentNote}</span>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={handleProceed}
                  disabled={paymentStatus === "processing"}
                  className="w-full py-4 rounded-pill bg-brand text-white text-[15px] font-bold hover:bg-brand-dark transition-colors disabled:opacity-60"
                >
                  {paymentStatus === "processing"
                    ? "Opening secure checkout..."
                    : `Proceed with ${formatINR(selectedPlan?.monthlyAmount || 0)}/mo plan`}
                </button>
                {paymentStatus === "error" && (
                  <p className="text-[12px] text-red-600 mt-2 text-center">{paymentError}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SpecItem({ label, value, wide }) {
  if (!value) return null;
  return (
    <div className={`bg-surface p-2.5 rounded-xl ${wide ? "col-span-2" : ""}`}>
      <p className="text-[10.5px] font-medium text-muted">{label}</p>
      <p className="text-[12.5px] font-bold text-ink mt-0.5">{value}</p>
    </div>
  );
}
