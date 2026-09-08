require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const db = require("./db/database");

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

function getVariantsForProduct(productId) {
  return db
    .prepare(`SELECT * FROM variants WHERE product_id = ? ORDER BY rowid`)
    .all(productId)
    .map((v) => ({
      id: v.id,
      storage: v.storage,
      color: v.color,
      colorHex: v.color_hex,
      mrp: v.mrp,
      price: v.price,
      image: v.image_url,
      specs: {
        processor: v.processor,
        ram: v.ram,
        camera: v.camera,
        display: v.display,
        battery: v.battery,
        warranty: v.warranty,
      },
    }));
}

function getEmiPlansForProduct(productId) {
  return db
    .prepare(`SELECT * FROM emi_plans WHERE product_id = ? ORDER BY tenure_months`)
    .all(productId)
    .map((p) => ({
      id: p.id,
      tenureMonths: p.tenure_months,
      monthlyAmount: p.monthly_amount,
      interestRate: p.interest_rate,
      cashback: p.cashback,
    }));
}

app.get("/api/products", (req, res) => {
  try {
    const { category, brand, search } = req.query;

    let query = "SELECT * FROM products";
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }
    if (brand) {
      conditions.push("brand = ?");
      params.push(brand);
    }
    if (search) {
      conditions.push("(name LIKE ? OR brand LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const products = db.prepare(query).all(...params);

    const summaries = products.map((p) => {
      const variants = getVariantsForProduct(p.id);
      const emiPlans = getEmiPlansForProduct(p.id);
      const cheapestVariant = variants.reduce((min, v) =>
        v.price < min.price ? v : min
      );
      const lowestEmi = emiPlans.reduce((min, plan) =>
        plan.monthlyAmount < min.monthlyAmount ? plan : min
      );

      return {
        id: p.id,
        brand: p.brand,
        name: p.name,
        category: p.category,
        image: cheapestVariant.image,
        mrp: cheapestVariant.mrp,
        price: cheapestVariant.price,
        variantCount: variants.length,
        startingEmi: lowestEmi.monthlyAmount,
        maxTenure: Math.max(...emiPlans.map((pl) => pl.tenureMonths)),
      };
    });

    res.json({ data: summaries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

app.get("/api/products/:id", (req, res) => {
  try {
    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      data: {
        id: product.id,
        brand: product.brand,
        name: product.name,
        category: product.category,
        description: product.description,
        variants: getVariantsForProduct(product.id),
        emiPlans: getEmiPlansForProduct(product.id),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load product" });
  }
});

app.get("/api/brands", (req, res) => {
  try {
    const rows = db
      .prepare("SELECT DISTINCT brand FROM products ORDER BY brand")
      .all();
    res.json({ data: rows.map((r) => r.brand) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load brands" });
  }
});

app.post("/api/payment/create-order", async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({
      error:
        "Payments are not configured on this server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable checkout.",
    });
  }

  try {
    const { amount, productId, planId } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "A valid amount (in rupees) is required" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `${productId || "order"}-${planId || "plan"}-${Date.now()}`,
      notes: { productId: productId || "", planId: planId || "" },
    });

    res.json({
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});


app.post("/api/payment/verify", (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ error: "Payments are not configured on this server." });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    res.json({ data: { verified: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "1Fi SDE1 API — backed by SQLite" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`1Fi SDE1 API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
