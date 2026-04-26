/** Last map/scan coordinates — shared by Map, Details, Scan, Alerts, OfflineMaps. */
export const LAST_COORDS_KEY = "terrasip-last-coords";

export const fallbackCoords = { lat: 46.7712, lon: 23.6236 };

export function getLastCoords() {
  try {
    const raw = localStorage.getItem(LAST_COORDS_KEY);
    if (!raw) return { ...fallbackCoords };
    const p = JSON.parse(raw);
    if (typeof p.lat === "number" && typeof p.lon === "number") {
      return { lat: p.lat, lon: p.lon };
    }
  } catch {
    // ignore
  }
  return { ...fallbackCoords };
}

export function setLastCoords(coords) {
  if (typeof coords?.lat === "number" && typeof coords?.lon === "number") {
    localStorage.setItem(LAST_COORDS_KEY, JSON.stringify({ lat: coords.lat, lon: coords.lon }));
  }
}
