const db = require("./database");

const products = [
  {
    id: "iphone-17-pro",
    brand: "Apple",
    name: "iPhone 17 Pro",
    category: "Smartphones",
    description:
      "A17 Pro chip, titanium design, and the most advanced Pro camera system yet.",
    variants: [
      {
        id: "iphone-17-pro-256-silver",
        storage: "256GB",
        color: "Silver",
        colorHex: "#dcdcc8",
        mrp: 134900,
        price: 127400,
        imageUrl: "https://1fi.in/iphone_pro_home.webp",
        processor: "A17 Pro Chip",
        ram: "8 GB",
        camera: "48MP + 12MP + 12MP Pro System",
        display: "6.3-inch Super Retina XDR OLED",
        battery: "Up to 27 hrs video playback",
        warranty: "1 Year Manufacturer Warranty",
      },
      {
        id: "iphone-17-pro-256-orange",
        storage: "256GB",
        color: "Cosmic Orange",
        colorHex: "#C96A3E",
        mrp: 134900,
        price: 127400,
        imageUrl: "https://1fi.in/iphone_pro_home.webp",
        processor: "A17 Pro Chip",
        ram: "8 GB",
        camera: "48MP + 12MP + 12MP Pro System",
        display: "6.3-inch Super Retina XDR OLED",
        battery: "Up to 27 hrs video playback",
        warranty: "1 Year Manufacturer Warranty",
      },
      {
        id: "iphone-17-pro-512-blue",
        storage: "512GB",
        color: "Deep Blue",
        colorHex: "#1F3A5F",
        mrp: 154900,
        price: 146900,
        imageUrl: "https://1fi.in/iphone_pro_home.webp",
        processor: "A17 Pro Chip",
        ram: "12 GB",
        camera: "48MP + 12MP + 12MP (5x Optical Zoom)",
        display: "6.3-inch Super Retina XDR OLED",
        battery: "Up to 29 hrs video playback",
        warranty: "1 Year Manufacturer Warranty",
      },
    ],
    emiPlans: [
      { tenureMonths: 3, monthlyAmount: 44967, interestRate: 0, cashback: 7500 },
      { tenureMonths: 6, monthlyAmount: 22483, interestRate: 0, cashback: 7500 },
      { tenureMonths: 12, monthlyAmount: 11242, interestRate: 0, cashback: 7500 },
      { tenureMonths: 24, monthlyAmount: 5621, interestRate: 0, cashback: 7500 },
      { tenureMonths: 36, monthlyAmount: 4297, interestRate: 10.5, cashback: 7500 },
      { tenureMonths: 48, monthlyAmount: 3385, interestRate: 10.5, cashback: 7500 },
      { tenureMonths: 60, monthlyAmount: 2842, interestRate: 10.5, cashback: 7500 },
    ],
  },
  {
    id: "samsung-s25-ultra",
    brand: "Samsung",
    name: "Galaxy S25 Ultra",
    category: "Smartphones",
    description:
      "Snapdragon 8 Elite, 200MP camera, and a built-in S Pen for the ultimate flagship experience.",
    variants: [
      {
        id: "s25-ultra-256-black",
        storage: "256GB",
        color: "Titanium Black",
        colorHex: "#1C1C1E",
        mrp: 129999,
        price: 119999,
        imageUrl: "https://1fi.in/samsungs25_home.webp",
        processor: "Snapdragon 8 Elite",
        ram: "12 GB",
        camera: "200MP + 50MP + 10MP + 12MP with S Pen",
        display: "6.9-inch Dynamic AMOLED 2X",
        battery: "5000 mAh, 45W fast charging",
        warranty: "1 Year Manufacturer Warranty",
      },
      {
        id: "s25-ultra-512-gray",
        storage: "512GB",
        color: "Titanium Gray",
        colorHex: "#8A8D8F",
        mrp: 144999,
        price: 133999,
        imageUrl: "https://1fi.in/samsungs25_home.webp",
        processor: "Snapdragon 8 Elite",
        ram: "16 GB",
        camera: "200MP + 50MP + 10MP + 12MP with S Pen",
        display: "6.9-inch Dynamic AMOLED 2X",
        battery: "5000 mAh, 45W fast charging",
        warranty: "1 Year Manufacturer Warranty",
      },
    ],
    emiPlans: [
      { tenureMonths: 3, monthlyAmount: 40000, interestRate: 0, cashback: 5000 },
      { tenureMonths: 6, monthlyAmount: 20500, interestRate: 0, cashback: 5000 },
      { tenureMonths: 12, monthlyAmount: 10500, interestRate: 0, cashback: 5000 },
      { tenureMonths: 24, monthlyAmount: 5400, interestRate: 0, cashback: 5000 },
      { tenureMonths: 36, monthlyAmount: 4050, interestRate: 10.5, cashback: 5000 },
    ],
  },
  {
    id: "oneplus-15",
    brand: "OnePlus",
    name: "OnePlus 15",
    category: "Smartphones",
    description:
      "Snapdragon flagship performance with Hasselblad-tuned cameras and 100W fast charging.",
    variants: [
      {
        id: "oneplus-15-256-emerald",
        storage: "256GB",
        color: "Emerald Dusk",
        colorHex: "#2F4B3C",
        mrp: 69999,
        price: 64999,
        imageUrl: "https://1fi.in/oneplus15_home.webp",
        processor: "Snapdragon 8 Gen 4",
        ram: "12 GB",
        camera: "50MP Hasselblad Triple Camera",
        display: "6.8-inch LTPO AMOLED, 120Hz",
        battery: "5400 mAh, 100W SUPERVOOC",
        warranty: "1 Year Manufacturer Warranty",
      },
      {
        id: "oneplus-15-512-black",
        storage: "512GB",
        color: "Infinite Black",
        colorHex: "#101010",
        mrp: 76999,
        price: 71999,
        imageUrl: "https://1fi.in/oneplus15_home.webp",
        processor: "Snapdragon 8 Gen 4",
        ram: "16 GB",
        camera: "50MP Hasselblad Triple Camera",
        display: "6.8-inch LTPO AMOLED, 120Hz",
        battery: "5400 mAh, 100W SUPERVOOC",
        warranty: "1 Year Manufacturer Warranty",
      },
    ],
    emiPlans: [
      { tenureMonths: 3, monthlyAmount: 21667, interestRate: 0, cashback: 3000 },
      { tenureMonths: 6, monthlyAmount: 10834, interestRate: 0, cashback: 3000 },
      { tenureMonths: 12, monthlyAmount: 5417, interestRate: 0, cashback: 3000 },
      { tenureMonths: 24, monthlyAmount: 2917, interestRate: 10.5, cashback: 3000 },
    ],
  },
  {
    id: "xiaomi-15",
    brand: "Xiaomi",
    name: "Xiaomi 15",
    category: "Smartphones",
    description:
      "Leica-tuned cameras, Snapdragon flagship power, and HyperOS in a compact flagship body.",
    variants: [
      {
        id: "xiaomi-15-256-black",
        storage: "256GB",
        color: "Black",
        colorHex: "#0F0F0F",
        mrp: 64999,
        price: 59999,
        imageUrl: "https://1fi.in/oneplus15_home.webp",
        processor: "Snapdragon 8 Elite",
        ram: "12 GB",
        camera: "50MP Leica Triple Camera",
        display: "6.36-inch AMOLED, 120Hz",
        battery: "5400 mAh, 90W fast charging",
        warranty: "1 Year Manufacturer Warranty",
      },
      {
        id: "xiaomi-15-512-white",
        storage: "512GB",
        color: "White",
        colorHex: "#F2F2F2",
        mrp: 69999,
        price: 64999,
        imageUrl: "https://1fi.in/oneplus15_home.webp",
        processor: "Snapdragon 8 Elite",
        ram: "16 GB",
        camera: "50MP Leica Triple Camera",
        display: "6.36-inch AMOLED, 120Hz",
        battery: "5400 mAh, 90W fast charging",
        warranty: "1 Year Manufacturer Warranty",
      },
    ],
    emiPlans: [
      { tenureMonths: 3, monthlyAmount: 20000, interestRate: 0, cashback: 2500 },
      { tenureMonths: 6, monthlyAmount: 10167, interestRate: 0, cashback: 2500 },
      { tenureMonths: 12, monthlyAmount: 5083, interestRate: 0, cashback: 2500 },
      { tenureMonths: 24, monthlyAmount: 2708, interestRate: 10.5, cashback: 2500 },
    ],
  },
  {
    id: "pixel-10",
    brand: "Google",
    name: "Google Pixel 10",
    category: "Smartphones",
    description:
      "Google Tensor G5, the best-in-class computational camera, and 7 years of guaranteed updates.",
    variants: [
      {
        id: "pixel-10-128-obsidian",
        storage: "128GB",
        color: "Obsidian",
        colorHex: "#1B1B1D",
        mrp: 79999,
        price: 74999,
        imageUrl: "https://1fi.in/samsungs25_home.webp",
        processor: "Google Tensor G5",
        ram: "12 GB",
        camera: "50MP + 48MP + 10.8MP",
        display: "6.3-inch Actua OLED, 120Hz",
        battery: "4700 mAh, 30W fast charging",
        warranty: "1 Year Manufacturer Warranty",
      },
      {
        id: "pixel-10-256-porcelain",
        storage: "256GB",
        color: "Porcelain",
        colorHex: "#E8E1D8",
        mrp: 89999,
        price: 84999,
        imageUrl: "https://1fi.in/samsungs25_home.webp",
        processor: "Google Tensor G5",
        ram: "16 GB",
        camera: "50MP + 48MP + 10.8MP",
        display: "6.3-inch Actua OLED, 120Hz",
        battery: "4700 mAh, 30W fast charging",
        warranty: "1 Year Manufacturer Warranty",
      },
    ],
    emiPlans: [
      { tenureMonths: 3, monthlyAmount: 25000, interestRate: 0, cashback: 3500 },
      { tenureMonths: 6, monthlyAmount: 12667, interestRate: 0, cashback: 3500 },
      { tenureMonths: 12, monthlyAmount: 6333, interestRate: 0, cashback: 3500 },
      { tenureMonths: 24, monthlyAmount: 3396, interestRate: 10.5, cashback: 3500 },
    ],
  },
  {
    id: "nothing-phone-3",
    brand: "Nothing",
    name: "Nothing Phone (3)",
    category: "Smartphones",
    description:
      "Glyph Interface, a distinctive transparent design, and clean Nothing OS software.",
    variants: [
      {
        id: "nothing-phone-3-256-white",
        storage: "256GB",
        color: "White",
        colorHex: "#EDEDED",
        mrp: 54999,
        price: 49999,
        imageUrl: "https://1fi.in/oneplus15_home.webp",
        processor: "Snapdragon 8s Gen 4",
        ram: "12 GB",
        camera: "50MP + 50MP Dual Camera",
        display: "6.7-inch LTPO AMOLED, 120Hz",
        battery: "5150 mAh, 65W fast charging",
        warranty: "1 Year Manufacturer Warranty",
      },
      {
        id: "nothing-phone-3-256-black",
        storage: "256GB",
        color: "Black",
        colorHex: "#161616",
        mrp: 54999,
        price: 49999,
        imageUrl: "https://1fi.in/oneplus15_home.webp",
        processor: "Snapdragon 8s Gen 4",
        ram: "12 GB",
        camera: "50MP + 50MP Dual Camera",
        display: "6.7-inch LTPO AMOLED, 120Hz",
        battery: "5150 mAh, 65W fast charging",
        warranty: "1 Year Manufacturer Warranty",
      },
    ],
    emiPlans: [
      { tenureMonths: 3, monthlyAmount: 16667, interestRate: 0, cashback: 2000 },
      { tenureMonths: 6, monthlyAmount: 8500, interestRate: 0, cashback: 2000 },
      { tenureMonths: 12, monthlyAmount: 4250, interestRate: 0, cashback: 2000 },
      { tenureMonths: 24, monthlyAmount: 2292, interestRate: 10.5, cashback: 2000 },
    ],
  },
];

function seed() {
  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (id, brand, name, category, description)
    VALUES (@id, @brand, @name, @category, @description)
  `);

  const insertVariant = db.prepare(`
    INSERT OR REPLACE INTO variants
      (id, product_id, storage, color, color_hex, mrp, price, image_url,
       processor, ram, camera, display, battery, warranty)
    VALUES
      (@id, @productId, @storage, @color, @colorHex, @mrp, @price, @imageUrl,
       @processor, @ram, @camera, @display, @battery, @warranty)
  `);

  const insertPlan = db.prepare(`
    INSERT OR REPLACE INTO emi_plans
      (id, product_id, tenure_months, monthly_amount, interest_rate, cashback)
    VALUES
      (@id, @productId, @tenureMonths, @monthlyAmount, @interestRate, @cashback)
  `);

  const seedAll = db.transaction((products) => {
    for (const product of products) {
      insertProduct.run(product);

      for (const variant of product.variants) {
        insertVariant.run({ ...variant, productId: product.id });
      }

      product.emiPlans.forEach((plan, index) => {
        insertPlan.run({
          ...plan,
          id: `${product.id}-p${index + 1}`,
          productId: product.id,
        });
      });
    }
  });

  seedAll(products);
  console.log(
    `Seeded ${products.length} products, ${products.reduce(
      (sum, p) => sum + p.variants.length,
      0
    )} variants, ${products.reduce((sum, p) => sum + p.emiPlans.length, 0)} EMI plans.`
  );
}

seed();
