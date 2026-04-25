import { useNavigate } from "react-router-dom";
import { Satellite, Droplets, ShieldCheck } from "lucide-react";

export default function Splash() {
  const nav = useNavigate();

  return (
    <div className="app-shell relative min-h-screen text-white overflow-y-auto">
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#05110f]/45 via-[#05110f]/70 to-[#05110f]" />

      <div className="relative min-h-screen flex flex-col justify-between gap-6 p-6">
        <div className="flex items-center gap-3">
          <img src="/terrasip-logo.png" alt="TerraSip logo" className="h-11 w-11 rounded-full bg-white/10 p-1" />
          <div>
            <h1 className="text-2xl font-bold tracking-[0.22em]">TERRASIP</h1>
            <p className="text-green-200 text-sm">From space to your next sip.</p>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6 text-center soft-pulse">
          <div className="mx-auto h-28 w-28 rounded-full border border-green-200/40 bg-white/5 p-2">
            <img src="/terrasip-logo.png" alt="TerraSip symbol" className="h-full w-full rounded-full object-cover" />
          </div>
          <p className="mt-5 text-xl font-semibold leading-snug">
            Safe water,
            <br />
            better decisions.
          </p>
          <p className="mt-2 text-sm text-white/65">See your world from above - decide what is safe below.</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
            <div className="chip rounded-xl p-2">
              <Satellite className="mx-auto mb-1 h-4 w-4 text-cyan-300" />
              Copernicus
            </div>
            <div className="chip rounded-xl p-2">
              <Droplets className="mx-auto mb-1 h-4 w-4 text-blue-300" />
              WQI Scoring
            </div>
            <div className="chip rounded-xl p-2">
              <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-green-300" />
              Offline Ready
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => nav("/onboarding")} className="btn-primary w-full rounded-xl py-3.5 font-semibold">
            Get started
          </button>
          <button onClick={() => nav("/map")} className="btn-secondary w-full rounded-xl py-3.5 font-medium">
            Preview live map
          </button>
          <button onClick={() => nav("/project")} className="w-full rounded-xl border border-green-300/35 bg-green-500/10 py-3.5 font-medium text-green-200">
            View hackathon story
          </button>
        </div>
      </div>
    </div>
  );
}
