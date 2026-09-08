const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return json.data;
}

export async function createPaymentOrder({ amount, productId, planId }) {
  const res = await fetch(`${BASE_URL}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, productId, planId }),
  });
  return handleResponse(res);
}

export async function verifyPayment(paymentResponse) {
  const res = await fetch(`${BASE_URL}/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentResponse),
  });
  return handleResponse(res);
}
