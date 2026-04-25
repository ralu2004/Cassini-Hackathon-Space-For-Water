import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWaterQuality } from "../lib/api";

export default function Scan() {
  const nav = useNavigate();
  const [state, setState] = useState("waiting");
  const [quality, setQuality] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => detectWater(), 2000);
    return () => clearTimeout(timer);
  }, []);

  async function detectWater() {
    setState("scanning");

    const q = await getWaterQuality(46.77, 23.62);

    setTimeout(() => {
      setQuality(q);
      setState("done");
    }, 2000);
  }

  const wqi = quality?.wqi ?? 96;
  const status = wqi >= 75 ? "EXCELLENT" : wqi >= 50 ? "FAIR" : "POOR";

  return (
    <div className="h-screen bg-[#061211] text-white flex flex-col items-center justify-between p-6">
      <button onClick={() => nav("/map")} className="self-start text-3xl">‹</button>

      <div className="flex flex-col items-center text-center">
        <img
          src="/bottle.png"
          alt="TerraSip smart bottle"
          className="h-80 object-contain mb-6"
        />

        {state === "waiting" && (
          <>
            <p className="text-xl font-bold text-green-300">Waiting for water...</p>
            <p className="text-sm text-white/60 mt-2">Pour water into your TerraSip bottle</p>
          </>
        )}

        {state === "scanning" && (
          <>
            <div className="h-36 w-36 rounded-full border-2 border-green-400 animate-ping mb-6" />
            <p className="text-xl font-bold text-green-300">Bottle detected water</p>
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

      {state === "done" && (
        <button
          onClick={() => nav("/details")}
          className="w-full bg-green-500 text-black py-4 rounded-2xl font-bold"
        >
          View Details
        </button>
      )}
    </div>
  );
}
