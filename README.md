# 1Fi SDE1 Assignment — Products with EMI Plans

A full-stack web application displaying products with multiple EMI plans
backed by mutual funds — dynamic data end-to-end from a real SQL database,
through a REST API, into a responsive React frontend. Includes search,
filtering, automated tests, CI, and optional Razorpay checkout.

## 🎥 Demo

📹 **Video walkthrough:** [https://drive.google.com/file/d/1JGgBKFSmhwfaScZA4ALukjyjWW-Y_DDp/view?usp=sharing]

🌐 **Live demo:** [ https://frontend-sigma-eight-79.vercel.app ]

## ✨ Features

**Core (assignment requirements)**
- Product listing homepage — pulled live from the database via API
- Unique URL per product: `/products/iphone-17-pro`, `/products/samsung-s25-ultra`, etc.
- 6 products, each with 2–3 variants (storage + color)
- Per-variant details: name, MRP, price, image, key specifications
- Selectable EMI plans: monthly amount, tenure, interest rate, cashback
- CTA to proceed with the selected plan
- Loading skeletons, error states with retry, empty states
- Fully responsive (mobile, tablet, desktop)

**Beyond the brief**
- 🔍 **Search, brand filter, and price sort** on the homepage
- 🕐 **Recently Viewed** products strip (localStorage-backed)
- 🍞 **Breadcrumb navigation** on the product page
- 💳 **Razorpay checkout** (optional — see [Payments](#-payments-optional) below)
- ✅ **21 automated tests** — 10 backend (Jest + Supertest), 11 frontend (Vitest + Testing Library)
- ⚙️ **GitHub Actions CI** — runs the full test suite and a production build on every push

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Tailwind CSS |
| Backend | Node.js, Express |
| Database | SQLite (via `better-sqlite3`) — relational, file-based |
| Payments | Razorpay (test mode, optional) |
| Testing | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |
| CI | GitHub Actions |

**Why SQLite:** it's a genuine SQL database with real schema, foreign keys,
and indexes (not a JSON file pretending to be one), while staying zero-config
for local development and easy to seed/inspect. The schema uses only
standard SQL, so migrating to PostgreSQL later is a connection-string change,
not a rewrite.

## 🏗️ Architecture

```
┌──────────────────┐   HTTP/JSON   ┌───────────────────┐   SQL   ┌──────────────────┐
│  React Frontend   │ ────────────▶ │  Express Backend   │ ──────▶ │  SQLite Database  │
│  (Vite + Tailwind)│ ◀──────────── │  (REST API)         │ ◀────── │  (1fi.sqlite)     │
└──────────────────┘                └───────────────────┘         └──────────────────┘
      :5174                               :4001                          │
                                            │                             │
                                            ▼                             │
                                   ┌─────────────────┐                    │
                                   │  Razorpay API     │ (optional)       │
                                   │  (order + verify) │                  │
                                   └─────────────────┘                    │
```

## 📁 Project Structure

```
1fi-sde1/
├── .github/workflows/ci.yml   # GitHub Actions: tests + build on every push
├── backend/
│   ├── db/
│   │   ├── schema.sql        # table definitions (products, variants, emi_plans)
│   │   ├── database.js       # SQLite connection, applies schema on boot
│   │   ├── seed.js           # populates the database with seed data
│   │   └── 1fi.sqlite        # generated on first `npm run seed` (gitignored)
│   ├── tests/
│   │   ├── products.test.js  # API tests: listing, filtering, search, 404s
│   │   └── payment.test.js   # payment endpoint graceful-degradation tests
│   ├── server.js              # Express API (products + payments)
│   ├── .env.example           # Razorpay key placeholders
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── products.js         # fetch layer — no hardcoded data
    │   │   └── payment.js          # Razorpay order + verification calls
    │   ├── components/
    │   │   ├── SiteHeader.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── VariantSelector.jsx
    │   │   ├── EMIPlanCard.jsx
    │   │   ├── RecentlyViewed.jsx
    │   │   └── StatusStates.jsx    # loading / error / empty states
    │   ├── pages/
    │   │   ├── HomePage.jsx        # product grid + search/filter/sort
    │   │   ├── ProductPage.jsx     # unique-URL detail + EMI + checkout
    │   │   └── NotFoundPage.jsx
    │   ├── utils/
    │   │   ├── format.js
    │   │   └── recentlyViewed.js
    │   └── tests/                  # Vitest component/unit tests
    └── package.json
```

## 🚀 Setup & Run Instructions

Requires **Node.js 18+**.

```bash
# 1. Backend
cd backend
npm install
npm run seed     # creates and populates backend/db/1fi.sqlite
npm start
# → API running on http://localhost:4001

# 2. Frontend (in a second terminal)
cd frontend
npm install
npm run dev
# → running on http://localhost:5174, proxies /api/* to :4001
```

Open **http://localhost:5174**.

**Production build:** `npm run build` inside `frontend/` outputs static files
to `frontend/dist` — deployable to Vercel/Netlify. Deploy `backend/` to
Render/Railway (a platform with persistent disk, since SQLite is file-based);
run `npm run seed` once after deploying, then `npm start`. Set
`VITE_API_URL` on the frontend to point at the deployed backend (see
`frontend/.env.example`).

## 🧪 Running Tests

```bash
# Backend (Jest + Supertest) — 10 tests
cd backend
npm test

# Frontend (Vitest + React Testing Library) — 11 tests
cd frontend
npm test
```

Both suites also run automatically via GitHub Actions on every push/PR to
`main` (see `.github/workflows/ci.yml`).

## 💳 Payments (optional)

The "Proceed" button opens a real Razorpay checkout **if** the backend has
API keys configured. Without them, it degrades gracefully to a clear "demo
confirmation" state — the app never crashes or blocks the demo.

**To enable real checkout:**
1. Sign up free at [dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Go to **Settings → API Keys → Generate Test Key**
3. Copy `backend/.env.example` to `backend/.env` and paste in your `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
4. Restart the backend

Payment flow: frontend requests an order (`POST /api/payment/create-order`)
→ backend creates it via the Razorpay SDK → Razorpay's checkout modal opens
→ on success, the frontend sends the payment response to
`POST /api/payment/verify`, which recomputes the HMAC-SHA256 signature
server-side to confirm the payment genuinely came from Razorpay before
marking the plan as confirmed.

## 📡 API Endpoints & Example Responses

### `GET /api/products`

Returns a summary of every product, for the homepage grid. Supports optional
`?category=`, `?brand=`, and `?search=` query filters.

```json
{
  "data": [
    {
      "id": "iphone-17-pro",
      "brand": "Apple",
      "name": "iPhone 17 Pro",
      "category": "Smartphones",
      "image": "https://1fi.in/iphone_pro_home.webp",
      "mrp": 134900,
      "price": 127400,
      "variantCount": 3,
      "startingEmi": 2842,
      "maxTenure": 60
    }
  ]
}
```

### `GET /api/products/:id`

Full product detail: every variant with specs, plus every EMI plan.

```json
{
  "data": {
    "id": "iphone-17-pro",
    "brand": "Apple",
    "name": "iPhone 17 Pro",
    "category": "Smartphones",
    "description": "A17 Pro chip, titanium design, and the most advanced Pro camera system yet.",
    "variants": [
      {
        "id": "iphone-17-pro-256-silver",
        "storage": "256GB",
        "color": "Silver",
        "colorHex": "#E3E3E0",
        "mrp": 134900,
        "price": 127400,
        "image": "https://1fi.in/iphone_pro_home.webp",
        "specs": {
          "processor": "A17 Pro Chip",
          "ram": "8 GB",
          "camera": "48MP + 12MP + 12MP Pro System",
          "display": "6.3-inch Super Retina XDR OLED",
          "battery": "Up to 27 hrs video playback",
          "warranty": "1 Year Manufacturer Warranty"
        }
      }
    ],
    "emiPlans": [
      {
        "id": "iphone-17-pro-p1",
        "tenureMonths": 3,
        "monthlyAmount": 44967,
        "interestRate": 0,
        "cashback": 7500
      }
    ]
  }
}
```

`404` with `{ "error": "Product not found" }` for an unknown id.

### `GET /api/brands`

```json
{ "data": ["Apple", "Google", "Nothing", "OnePlus", "Samsung", "Xiaomi"] }
```

### `POST /api/payment/create-order`

Request: `{ "amount": 44967, "productId": "iphone-17-pro", "planId": "p1" }`

Response (200, when Razorpay is configured):
```json
{
  "data": {
    "orderId": "order_XXXXXXXXXXXX",
    "amount": 4496700,
    "currency": "INR",
    "keyId": "rzp_test_XXXXXXXXXX"
  }
}
```

Response (503, when not configured):
```json
{ "error": "Payments are not configured on this server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable checkout." }
```

### `POST /api/payment/verify`

Request: `{ "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }`

Response: `{ "data": { "verified": true } }` or `400` if the signature doesn't match.

## 🗄️ Database Schema

Three relational tables (see `backend/db/schema.sql` for the full DDL):

**`products`**
| Column | Type | Notes |
|---|---|---|
| id | TEXT (PK) | slug, used as the URL segment |
| brand | TEXT | |
| name | TEXT | |
| category | TEXT | |
| description | TEXT | |
| created_at | TEXT | default timestamp |

**`variants`**
| Column | Type | Notes |
|---|---|---|
| id | TEXT (PK) | |
| product_id | TEXT (FK → products.id) | `ON DELETE CASCADE` |
| storage | TEXT | |
| color | TEXT | |
| color_hex | TEXT | |
| mrp | INTEGER | |
| price | INTEGER | |
| image_url | TEXT | |
| processor, ram, camera, display, battery, warranty | TEXT | flattened spec fields |

**`emi_plans`**
| Column | Type | Notes |
|---|---|---|
| id | TEXT (PK) | |
| product_id | TEXT (FK → products.id) | `ON DELETE CASCADE` |
| tenure_months | INTEGER | |
| monthly_amount | INTEGER | |
| interest_rate | REAL | |
| cashback | INTEGER | |

Indexes on `variants.product_id` and `emi_plans.product_id` for fast lookups
on the product detail page.

## ⚠️ Notes

- Razorpay checkout runs in **test mode only** — no real money moves, even
  when configured. That's standard practice for an assignment/demo.
- Product photography is one image per product line (not per color), since
  per-variant photography wasn't available; color selection is reflected via
  a tinted background instead.
- The `N+1`-style query pattern in `GET /api/products` (a variants/EMI query
  per product) is fine at this scale (6 products) but would be worth
  collapsing into a JOIN at a larger catalog size.
