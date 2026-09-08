import{ formatINR } from "../utils/format";

export default function EMIPlanCard({ plan, selected, onSelect }){
  return(
    <button
      onClick={() => onSelect(plan)}
      className={`w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
        selected ? "border-brand bg-brand-light" : "border-line bg-white hover:border-brand/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            selected ? "border-brand" : "border-line"
          }`}
        >
          {selected && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}
        </span>
        <div>
          <p className="text-[14.5px] font-bold text-ink">
            {formatINR(plan.monthlyAmount)}{" "}
            <span className="font-medium text-muted">
              &times; {plan.tenureMonths} months
            </span>
          </p>
          {plan.cashback > 0 && (
            <p className="text-[12px] font-semibold text-success mt-0.5">
              Additional cashback of {formatINR(plan.cashback)}
            </p>
          )}
        </div>
      </div>
      <span
        className={`text-[12px] font-semibold shrink-0 ${
          plan.interestRate === 0 ? "text-success" : "text-muted"
        }`}
      >
        {plan.interestRate === 0 ? "0% interest" : `${plan.interestRate}% interest`}
      </span>
    </button>
  );
}
