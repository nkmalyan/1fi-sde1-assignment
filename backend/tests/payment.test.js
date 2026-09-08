const request = require("supertest");
const app = require("../server");

describe("POST /api/payment/create-order", ()=>{
  it("returns 503 with a clear message when Razorpay isn't configured", async () => {
    const res = await request(app)
      .post("/api/payment/create-order")
      .send({ amount: 1000, productId: "iphone-17-pro", planId: "p1" });

    expect(res.status).toBe(503);
    expect(res.body.error).toMatch(/not configured/i);
  });
});

describe("POST /api/payment/verify", ()=>{
  it("returns 503 when Razorpay isn't configured", async()=>{
    const res = await request(app).post("/api/payment/verify").send({
      razorpay_order_id: "order_test",
      razorpay_payment_id: "pay_test",
      razorpay_signature: "sig_test",
    });

    expect(res.status).toBe(503);
  });
});
