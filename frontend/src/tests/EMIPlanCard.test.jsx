import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EMIPlanCard from "../components/EMIPlanCard";

const samplePlan = {
  id: "p1",
  tenureMonths: 12,
  monthlyAmount: 11242,
  interestRate: 0,
  cashback: 7500,
};

describe("EMIPlanCard", () => {
  it("renders monthly amount, tenure, and cashback", () => {
    render(<EMIPlanCard plan={samplePlan} selected={false} onSelect={() => {}} />);
    expect(screen.getByText(/12 months/)).toBeInTheDocument();
    expect(screen.getByText(/Additional cashback/)).toBeInTheDocument();
    expect(screen.getByText("0% interest")).toBeInTheDocument();
  });

  it("shows interest rate instead of '0% interest' when non-zero", () => {
    const plan = { ...samplePlan, interestRate: 10.5 };
    render(<EMIPlanCard plan={plan} selected={false} onSelect={() => {}} />);
    expect(screen.getByText("10.5% interest")).toBeInTheDocument();
  });

  it("calls onSelect with the plan when clicked", () => {
    const onSelect = vi.fn();
    render(<EMIPlanCard plan={samplePlan} selected={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(samplePlan);
  });

  it("does not render a cashback line when cashback is zero", () => {
    const plan = { ...samplePlan, cashback: 0 };
    render(<EMIPlanCard plan={plan} selected={false} onSelect={() => {}} />);
    expect(screen.queryByText(/Additional cashback/)).not.toBeInTheDocument();
  });
});
