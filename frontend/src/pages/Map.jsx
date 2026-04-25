import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaterMap from "../components/WaterMap";
import { getWaterQuality } from "../lib/api";

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
    <div className="h-screen bg-[#061211] text-white flex flex-col overflow-hidden">
      <header className="p-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.25em]">TERRASIP</h1>
          <p className="text-sm text-green-300">Nearby water intelligence</p>
        </div>
        <button
          onClick={() => nav("/profile")}
          className="h-11 w-11 rounded-2xl bg-white/10"
        >
          👤
        </button>
      </header>

      <section className="px-5">
        <div className="rounded-[2rem] border border-white/10 bg-[#0d1c19] p-4 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/45 text-sm">Current source</p>
              <h2 className="text-xl font-semibold">
                {quality?.nearest_water_body?.name || "Finding water..."}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-300">{wqi}</p>
              <p className="text-xs text-white/45">WQI / 100</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-green-500/15 px-3 py-1 text-green-300 text-sm">
              {status}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/60 text-sm">
              Galileo-like GPS
            </span>
          </div>
          {error && <p className="mt-3 text-xs text-orange-300">{error}</p>}
        </div>
      </section>

      <section className="flex-1 p-5">
        <div className="h-full overflow-hidden rounded-[2rem] border border-white/10">
          <WaterMap coords={coords} quality={quality} />
        </div>
      </section>

      <section className="px-5 pb-5 space-y-3">
        <button
          onClick={scan}
          disabled={isLoading}
          className="w-full rounded-2xl bg-green-500 py-4 font-bold text-black disabled:cursor-not-allowed disabled:bg-green-700"
        >
          {isLoading ? "Scanning..." : "Scan my location"}
        </button>

        <button
          disabled={!quality}
          onClick={() => nav("/details")}
          className="w-full rounded-2xl bg-white/10 py-4 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          View water details
        </button>
      </section>

      <nav className="bg-[#0d1c19] border-t border-white/10 p-4 flex justify-around text-sm">
        <button className="text-green-300">Map</button>
        <button onClick={() => nav("/scan")} className="text-white/50">Scan</button>
        <button onClick={() => nav("/profile")} className="text-white/50">Profile</button>
      </nav>
    </div>
  );
}
