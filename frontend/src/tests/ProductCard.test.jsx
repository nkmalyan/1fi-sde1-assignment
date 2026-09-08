import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const sampleProduct = {
  id: "iphone-17-pro",
  brand: "Apple",
  name: "iPhone 17 Pro",
  image: "https://example.com/iphone.webp",
  mrp: 134900,
  price: 127400,
  variantCount: 3,
  startingEmi: 2842,
  maxTenure: 60,
};

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("ProductCard", () => {
  it("renders product name, brand, and pricing", () => {
    renderWithRouter(<ProductCard product={sampleProduct} />);
    expect(screen.getByText("iPhone 17 Pro")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("₹1,27,400")).toBeInTheDocument();
  });

  it("shows the struck-through MRP when it differs from price", () => {
    renderWithRouter(<ProductCard product={sampleProduct} />);
    expect(screen.getByText("₹1,34,900")).toBeInTheDocument();
  });

  it("links to the correct unique product URL", () => {
    renderWithRouter(<ProductCard product={sampleProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/iphone-17-pro");
  });

  it("does not show a struck-through MRP when price equals MRP", () => {
    const product = { ...sampleProduct, mrp: sampleProduct.price };
    renderWithRouter(<ProductCard product={product} />);
    expect(screen.queryByText("₹1,34,900")).not.toBeInTheDocument();
  });
});
