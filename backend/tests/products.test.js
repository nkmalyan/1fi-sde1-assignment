const request = require("supertest");
const app = require("../server");

describe("GET /api/products", () => {
  it("returns a list of products with the expected summary shape", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);

    const product = res.body.data[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("brand");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("mrp");
    expect(product).toHaveProperty("startingEmi");
    expect(product).toHaveProperty("variantCount");
  });

  it("filters by brand", async ()=>{
    const res = await request(app).get("/api/products?brand=Apple");
    expect(res.status).toBe(200);
    expect(res.body.data.every((p) => p.brand === "Apple")).toBe(true);
  });

  it("filters by search term (case-insensitive substring match)", async ()=>{
    const res = await request(app).get("/api/products?search=pixel");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(
      res.body.data.every((p) => p.name.toLowerCase().includes("pixel"))
    ).toBe(true);
  });

  it("returns an empty array for a search term that matches nothing", async()=>{
    const res = await request(app).get("/api/products?search=doesnotexist123");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe("GET /api/products/:id", ()=>{
  it("returns full detail for a valid product id", async()=>{
    const res = await request(app).get("/api/products/iphone-17-pro");
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("iphone-17-pro");
    expect(Array.isArray(res.body.data.variants)).toBe(true);
    expect(res.body.data.variants.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(res.body.data.emiPlans)).toBe(true);
    expect(res.body.data.emiPlans.length).toBeGreaterThan(0);
  });

  it("includes specs on every variant", async ()=>{
    const res = await request(app).get("/api/products/iphone-17-pro");
    for (const variant of res.body.data.variants) {
      expect(variant.specs).toBeTruthy();
      expect(variant.specs.processor).toBeTruthy();
    }
  });

  it("returns 404 for an unknown product id", async () => {
    const res = await request(app).get("/api/products/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /api/brands", () => {
  it("returns a sorted, deduplicated list of brand names", async () => {
    const res = await request(app).get("/api/brands");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    const sorted = [...res.body.data].sort();
    expect(res.body.data).toEqual(sorted);
    expect(new Set(res.body.data).size).toBe(res.body.data.length);
  });
});
