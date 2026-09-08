CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY ,
  brand         TEXT NOT NULL,
  name           TEXT NOT NULL,
  category       TEXT NOT NULL,
  description   TEXT NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS variants (
  id            TEXT PRIMARY KEY ,
  product_id    TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage       TEXT NOT NULL,
  color         TEXT NOT NULL,
  color_hex     TEXT NOT NULL,
  mrp           INTEGER NOT NULL,
  price         INTEGER NOT NULL,
  image_url     TEXT NOT NULL,
  processor     TEXT,
  ram           TEXT,
  camera        TEXT,
  display       TEXT,
  battery       TEXT,
  warranty      TEXT
);

CREATE TABLE IF NOT EXISTS emi_plans (
  id              TEXT PRIMARY KEY,
  product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tenure_months   INTEGER NOT NULL,
  monthly_amount  INTEGER NOT NULL,
  interest_rate   REAL NOT NULL DEFAULT 0,
  cashback        INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON variants(product_id);
CREATE INDEX IF NOT EXISTS idx_emi_plans_product_id ON emi_plans(product_id);

