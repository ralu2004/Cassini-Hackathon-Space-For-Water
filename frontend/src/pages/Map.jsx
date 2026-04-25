import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaterMap from "../components/WaterMap";
import { getWaterQuality } from "../lib/api";
import { User, MapPinned, ScanSearch, Waves } from "lucide-react";

const fallback = { lat: 46.7712, lon: 23.6236 };

export default function Map() {
  const nav = useNavigate();
  const [coords, setCoords] = useState(fallback);
  const [quality, setQuality] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function scan() {
    setError("");
    setIsLoading(true);

    const loadWaterQuality = async (nextCoords) => {
      setCoords(nextCoords);
      const payload = await getWaterQuality(nextCoords.lat, nextCoords.lon);
      setQuality(payload);
    };

    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const next = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          await loadWaterQuality(next);
        } catch {
          setError("Could not load water quality right now.");
        } finally {
          setIsLoading(false);
        }
      },
      async () => {
        try {
          await loadWaterQuality(fallback);
          setError("Using fallback location. Enable GPS for better results.");
        } catch {
          setError("Could not load water quality right now.");
        } finally {
          setIsLoading(false);
        }
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );

    if (!navigator.geolocation) {
      try {
        await loadWaterQuality(fallback);
        setError("Geolocation is not available in this browser.");
      } catch {
        setError("Could not load water quality right now.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    scan();
  }, []);

  const wqi = quality?.wqi ?? "--";
  const status = quality?.class_name ?? (isLoading ? "SCANNING" : "UNKNOWN");

  return (
    <div className="app-shell h-screen text-white flex flex-col overflow-hidden">
      <header className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/terrasip-logo.png" alt="TerraSip logo" className="h-10 w-10 rounded-full bg-white/10 p-1" />
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em]">TERRASIP</h1>
            <p className="text-xs text-green-200">Nearby water intelligence</p>
          </div>
        </div>
        <button
          onClick={() => nav("/profile")}
          className="h-11 w-11 rounded-2xl glass-card grid place-items-center"
        >
          <User className="h-5 w-5 text-white/80" />
        </button>
      </header>

      <section className="flex-1 min-h-0 p-5 pt-2">
        <div className="grid h-full min-h-0 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="h-[56vh] min-h-0 overflow-hidden rounded-[2rem] border border-white/10 md:h-full">
            <WaterMap coords={coords} quality={quality} />
          </div>

          <aside className="glass-card rounded-[1.5rem] p-3.5 space-y-3 h-fit">
            <div>
              <p className="text-white/45 text-xs">Current source</p>
              <h2 className="text-base font-semibold leading-tight">
                {quality?.nearest_water_body?.name || "Finding water..."}
              </h2>
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-2xl font-bold text-green-300">{wqi}</p>
                <p className="text-[11px] text-white/45">WQI / 100</p>
              </div>
              <span className="rounded-full bg-green-400/20 px-2.5 py-1 text-[11px] text-green-200 font-medium">
                {status}
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/65 inline-flex items-center gap-1">
              <Waves className="h-3 w-3" /> Copernicus + GPS
            </span>

            <button
              onClick={scan}
              disabled={isLoading}
              className="btn-primary w-full rounded-xl py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:bg-green-700"
            >
              <span className="inline-flex items-center gap-2">
                <ScanSearch className="h-4 w-4" />
                {isLoading ? "Scanning..." : "Rescan"}
              </span>
            </button>

            <button
              disabled={!quality}
              onClick={() => nav("/details")}
              className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              View details
            </button>
            {error && <p className="text-xs text-orange-300">{error}</p>}
          </aside>
        </div>
      </section>

      <nav className="glass-card rounded-t-3xl border-x-0 border-b-0 p-4 flex justify-around text-sm">
        <button className="text-green-300 inline-flex items-center gap-1"><MapPinned className="h-4 w-4" />Map</button>
        <button onClick={() => nav("/scan")} className="text-white/50 inline-flex items-center gap-1"><ScanSearch className="h-4 w-4" />Scan</button>
        <button onClick={() => nav("/profile")} className="text-white/50 inline-flex items-center gap-1"><User className="h-4 w-4" />Profile</button>
      </nav>
    </div>
  );
}
