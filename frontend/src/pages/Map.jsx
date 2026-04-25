import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaterMap from "../components/WaterMap";
import { getWaterQuality } from "../lib/api";

const fallback = { lat: 46.7712, lon: 23.6236 };

export default function Map() {
  const nav = useNavigate();
  const [coords, setCoords] = useState(fallback);
  const [quality, setQuality] = useState(null);

  async function scan() {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const next = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(next);
        setQuality(await getWaterQuality(next.lat, next.lon));
      },
      async () => {
        setQuality(await getWaterQuality(fallback.lat, fallback.lon));
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  }

  useEffect(() => {
    scan();
  }, []);

  const wqi = quality?.wqi ?? "--";
  const status = quality?.status ?? "SCANNING";

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
          className="w-full rounded-2xl bg-green-500 py-4 font-bold text-black"
        >
          Scan my location
        </button>

        <button
          onClick={() => nav("/details")}
          className="w-full rounded-2xl bg-white/10 py-4 font-semibold"
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
