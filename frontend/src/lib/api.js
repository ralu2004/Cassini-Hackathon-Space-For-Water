const BASE = "http://127.0.0.1:8000";

export async function getWaterQuality(lat, lon) {
  const res = await fetch(`${BASE}/water-quality?lat=${lat}&lon=${lon}`);
  return res.json();
}

export async function getRiskAnalysis(lat, lon) {
  const res = await fetch(`${BASE}/risk-analysis?lat=${lat}&lon=${lon}`);
  return res.json();
}

export async function getTrends(lat, lon) {
  const res = await fetch(`${BASE}/historical-trends?lat=${lat}&lon=${lon}`);
  return res.json();
}
