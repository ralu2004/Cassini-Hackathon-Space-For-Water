import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWaterQuality } from "../lib/api";
import { Activity, ArrowLeft, Smartphone } from "lucide-react";

export default function Scan() {
  const nav = useNavigate();
  const [state, setState] = useState("waiting");
  const [quality, setQuality] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => detectWater(), 2000);
    return () => clearTimeout(timer);
  }, []);

  async function detectWater() {
    setState("scanning");
    setError("");

    try {
      const q = await getWaterQuality(46.77, 23.62);
      setTimeout(() => {
        setQuality(q);
        setState("done");
      }, 2000);
    } catch {
      setError("Could not complete scan. Please try again.");
      setState("waiting");
    }
  }

  const wqi = quality?.wqi ?? 96;
  const status = wqi >= 75 ? "EXCELLENT" : wqi >= 50 ? "FAIR" : "POOR";

  return (
    <div className="app-shell h-screen text-white flex flex-col items-center justify-between p-6">
      <button onClick={() => nav("/map")} className="self-start rounded-xl border border-white/15 bg-white/5 p-2 text-white/80">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="glass-card w-full max-w-md rounded-[2rem] p-5 flex flex-col items-center text-center">
        <div className="mb-2 flex items-center gap-2 text-xs tracking-[0.2em] text-green-200">
          <img src="/terrasip-logo.png" alt="TerraSip logo" className="h-6 w-6 rounded-full bg-white/10 p-1" />
          TERRASIP SCAN
        </div>

        <div className="relative mb-5 mt-1 grid h-48 w-48 place-items-center">
          <div className={`wave-ring ${state === "scanning" ? "wave-ring-active" : ""}`} />
          <div className={`wave-ring wave-ring-delay ${state === "scanning" ? "wave-ring-active" : ""}`} />
          <div className={`device-shell ${state === "scanning" ? "vibrate" : ""}`}>
            <Smartphone className="h-12 w-12 text-green-200" />
          </div>
        </div>

        {state === "waiting" && (
          <>
            <p className="text-xl font-bold text-green-300">Ready to detect water</p>
            <p className="text-sm text-white/60 mt-2">Tap start to simulate bottle sync and vibration feedback</p>
          </>
        )}

        {state === "scanning" && (
          <>
            <p className="text-xl font-bold text-green-300">Scanning in progress</p>
            <p className="text-sm text-white/60 mt-2">Analyzing satellite + sensor risk...</p>
          </>
        )}

        {state === "done" && (
          <>
            <div className="h-44 w-44 rounded-full border-[8px] border-green-400 flex items-center justify-center mb-4">
              <div>
                <p className="text-4xl font-bold">{wqi}</p>
                <p className="text-green-300 text-sm">{status}</p>
              </div>
            </div>
            <p className="text-white/60">Safe to drink based on satellite + bottle detection</p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      {state === "done" && (
        <button
          onClick={() => nav("/details")}
          className="btn-primary w-full py-4 rounded-2xl font-bold"
        >
          <span className="inline-flex items-center gap-2">
            <Activity className="h-4 w-4" />
            View Details
          </span>
        </button>
      )}

      {state === "waiting" && (
        <button onClick={detectWater} className="w-full rounded-2xl bg-white/10 py-4 font-semibold">
          Start scan
        </button>
      )}
    </div>
  );
}
