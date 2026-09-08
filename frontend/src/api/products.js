const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function fetchProducts({ category, brand, search } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (search) params.set("search", search);
  const query = params.toString();

  const res = await fetch(`${BASE_URL}/products${query ? `?${query}` : ""}`);
  return handleResponse(res);
}

export async function fetchBrands() {
  const res = await fetch(`${BASE_URL}/brands`);
  return handleResponse(res);
}

export async function fetchProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(res);
}
