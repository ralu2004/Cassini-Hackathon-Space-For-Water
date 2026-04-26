import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Download, MapPinned } from "lucide-react";
import { getHealth, getLocation, getOfflineMaps, toggleOfflineMapRegion } from "../lib/api";
import { getLastCoords } from "../lib/location";

export default function OfflineMaps() {
  const nav = useNavigate();
  const [maps, setMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [locationLabel, setLocationLabel] = useState("");

  const loadRegions = useCallback(async () => {
    setError("");
    try {
      const data = await getOfflineMaps();
      setMaps(data.regions || []);
    } catch {
      setError("Could not load offline regions. Is the API running?");
      setMaps([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  useEffect(() => {
    async function loadSyncStatus() {
      const coords = getLastCoords();
      try {
        const [health, location] = await Promise.all([getHealth(), getLocation(coords.lat, coords.lon)]);
        setBackendStatus(health.status === "ok" ? "Connected" : "Unavailable");
        setLocationLabel(location.location_label || "Region");
      } catch {
        setBackendStatus("Unavailable");
        setLocationLabel("Location unavailable");
      }
    }
    loadSyncStatus();
  }, []);

  const totalDownloaded = maps.filter((m) => m.downloaded).length;
  const totalSize = maps.filter((m) => m.downloaded).reduce((sum, m) => sum + m.size_mb, 0);

  async function toggle(id) {
    setError("");
    try {
      const data = await toggleOfflineMapRegion(id);
      setMaps(data.regions || []);
    } catch {
      setError("Could not update download. Try again.");
    }
  }

  return (
    <div className="app-shell min-h-screen text-white p-5 pb-24">
      <div className="mx-auto max-w-xl">
        <button onClick={() => nav("/map")} className="rounded-xl border border-white/15 bg-white/5 p-2">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl glass-card">
            <MapPinned className="h-5 w-5 text-green-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Offline Maps</h1>
            <p className="text-sm text-white/60">Cached risk layers for your route (from API).</p>
          </div>
        </div>

        <div className="glass-card mt-5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/55">Downloaded</p>
            <p className="text-lg font-semibold">{totalDownloaded} regions</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/55">Storage used</p>
            <p className="text-lg font-semibold">{totalSize} MB</p>
          </div>
        </div>

        <div className="glass-card mt-3 rounded-2xl p-4 flex items-center justify-between text-sm">
          <p className="text-white/70">{locationLabel || "…"}</p>
          <span className={backendStatus === "Connected" ? "text-green-300" : "text-red-300"}>API: {backendStatus}</span>
        </div>

        {isLoading && <p className="mt-4 text-sm text-white/55">Loading regions…</p>}
        {error && <p className="mt-3 text-sm text-amber-300">{error}</p>}

        <div className="mt-4 space-y-3">
          {maps.map((m) => (
            <article key={m.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{m.name}</h2>
                <p className="text-xs text-white/55">{m.size_mb} MB</p>
              </div>
              <button
                onClick={() => toggle(m.id)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold inline-flex items-center gap-2 ${
                  m.downloaded ? "bg-green-400/20 text-green-200" : "btn-primary"
                }`}
              >
                {m.downloaded ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Downloaded
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Download
                  </>
                )}
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
