const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const REQUEST_TIMEOUT_MS = 10000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseJsonResponse(res) {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API request failed (${res.status}): ${body || res.statusText}`);
  }
  return res.json();
}

export async function getWaterQuality(lat, lon) {
  const res = await fetchWithTimeout(`${BASE}/water-quality?lat=${lat}&lon=${lon}`);
  return parseJsonResponse(res);
}

export async function getRiskAnalysis(lat, lon) {
  const res = await fetchWithTimeout(`${BASE}/risk-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon }),
  });
  return parseJsonResponse(res);
}

export async function getTrends(lat, lon) {
  const res = await fetchWithTimeout(`${BASE}/historical-trends?lat=${lat}&lon=${lon}`);
  return parseJsonResponse(res);
}
