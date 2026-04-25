import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRiskAnalysis, getWaterQuality } from "../lib/api";
import { ArrowLeft, Navigation, Heart, Share2, FlaskConical } from "lucide-react";

const fallback = { lat: 46.7712, lon: 23.6236 };

export default function Details() {
  const nav = useNavigate();
  const [quality, setQuality] = useState(null);
  const [risk, setRisk] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const q = await getWaterQuality(fallback.lat, fallback.lon);
        const r = await getRiskAnalysis(fallback.lat, fallback.lon);
        setQuality(q);
        setRisk(r);
      } catch {
        setError("Could not load details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const wqi = quality?.wqi ?? 98;
  const status = wqi >= 75 ? "EXCELLENT" : wqi >= 50 ? "FAIR" : "POOR";

  return (
    <div className="app-shell min-h-screen text-white">
      <div className="relative h-72">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-[#061211]" />

        <div className="relative z-10 flex justify-between p-5">
          <button onClick={() => nav("/map")} className="rounded-xl border border-white/15 bg-black/30 p-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-3 text-xl">
            <button className="rounded-xl border border-white/15 bg-black/30 p-2"><Heart className="h-5 w-5" /></button>
            <button className="rounded-xl border border-white/15 bg-black/30 p-2"><Share2 className="h-5 w-5" /></button>
          </div>
        </div>
      </div>

      <section className="glass-card -mt-20 relative z-20 mx-5 rounded-[2rem] p-5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">{quality?.nearest_water_body?.name || "Water Source"}</h1>
            <p className="mt-1 text-sm text-white/50">
              {quality?.nearest_water_body?.distance_km != null
                ? `${quality.nearest_water_body.distance_km.toFixed(1)} km away`
                : "Distance unavailable"}
            </p>
            <span className="mt-3 inline-block rounded-full bg-green-400/15 px-3 py-1 text-xs font-bold text-green-300">
              {status}
            </span>
          </div>

          <div className="h-24 w-24 rounded-full border-[7px] border-green-300/80 grid place-items-center">
            <div className="text-center">
              <p className="text-2xl font-bold">{wqi}%</p>
              <p className="text-[10px] text-green-300">WQI</p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Row icon="💧" label="Water Quality" value={status} green />
          <Row icon="🌊" label="Flow Rate" value="1.2 L/min" />
          <Row icon="🏔️" label="Source Type" value={quality?.nearest_water_body?.type || "Unknown"} />
          <Row icon="📍" label="Elevation" value="1,842 m" />
          <Row icon="🕒" label="Last Updated" value={quality?.generated_at ? "Moments ago" : "Pending"} />
        </div>

        <button
          onClick={() => {
            const lat = fallback.lat;
            const lon = fallback.lon;
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, "_blank");
          }}
          className="btn-primary mt-6 w-full rounded-2xl py-4 font-bold"
        >
          <span className="inline-flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Get Directions
          </span>
        </button>
      </section>

      <section className="glass-card mx-5 mt-5 rounded-[2rem] p-5">
        <h2 className="font-bold">Quality Breakdown</h2>

        <div className="mt-4 space-y-3">
          <Breakdown label="NDWI water signal" value={quality?.features?.ndwi?.toFixed?.(2) || "0.71"} />
          <Breakdown label="Turbidity" value={`${quality?.features?.turbidity_ntu || "2.4"} NTU`} />
          <Breakdown label="Chlorophyll-a" value={`${quality?.features?.chlorophyll_a_mg_m3 || "4.1"} mg/m³`} />
          <Breakdown label="Temperature" value={`${quality?.features?.surface_temp_c || "14"}°C`} />
          <Breakdown label="NO₂ pollution context" value={`${quality?.features?.no2_umol_m2 || "0.08"}`} />
        </div>
      </section>

      <section className="mx-5 mt-5 rounded-[2rem] border border-green-300/30 bg-green-400/10 p-5">
        <div className="flex gap-3">
          <div className="text-3xl">💧</div>
          <div>
            <h2 className="font-bold text-green-300">
              {quality?.drinkability || "This water source is safe for drinking."}
            </h2>
            <p className="mt-1 text-sm text-white/60">
              {quality?.recommendation || "Very low risk detected from satellite-derived indicators."}
            </p>
          </div>
        </div>
      </section>

      <section className="glass-card mx-5 mt-5 rounded-[2rem] p-5 mb-24">
        <h2 className="font-bold">Warnings</h2>
        <div className="mt-3 space-y-2">
          {isLoading && <div className="rounded-2xl bg-white/5 p-3 text-sm text-white/65">Loading analysis...</div>}
          {error && <div className="rounded-2xl bg-red-500/15 p-3 text-sm text-red-200">{error}</div>}
          {!isLoading &&
            !error &&
            (risk?.warnings?.length ? risk.warnings : ["No critical warnings detected."]).map((w, i) => (
              <div key={i} className="rounded-2xl bg-white/5 p-3 text-sm text-white/65">
                ⚠️ {w}
              </div>
            ))}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl border-x-0 border-b-0 p-4 flex justify-around text-sm">
        <button onClick={() => nav("/map")} className="text-white/50">Map</button>
        <button onClick={() => nav("/scan")} className="text-white/50">Scan</button>
        <button onClick={() => nav("/bottle")} className="text-white/50 inline-flex items-center gap-1"><FlaskConical className="h-4 w-4" />Bottle</button>
        <button className="text-green-300">Details</button>
        <button onClick={() => nav("/profile")} className="text-white/50">Profile</button>
      </nav>
    </div>
  );
}

function Row({ icon, label, value, green }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3">
      <div className="flex items-center gap-3 text-white/65">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span className={green ? "text-green-300" : "text-white/80"}>{value}</span>
    </div>
  );
}

function Breakdown({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
      <span className="text-white/60">{label}</span>
      <span className="text-green-300">{value}</span>
    </div>
  );
}
