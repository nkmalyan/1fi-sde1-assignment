const STORAGE_KEY = "1fi-recently-viewed";
const MAX_ITEMS = 5;

export function addToRecentlyViewed(product) {
  try {
    const existing = getRecentlyViewed().filter((p) => p.id !== product.id);
    const updated = [
      { id: product.id, name: product.name, image: product.image, brand: product.brand },
      ...existing,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {

  }
}

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  
  }
}
