import { describe, it, expect } from "vitest";
import { formatINR } from "../utils/format";

describe("formatINR", () => {
  it("formats a whole number as Indian Rupees with grouping", () => {
    expect(formatINR(127400)).toBe("₹1,27,400");
  });

  it("formats small amounts correctly", () => {
    expect(formatINR(500)).toBe("₹500");
  });

  it("rounds to whole rupees (no decimals)", () => {
    expect(formatINR(1999.99)).toBe("₹2,000");
  });
});
