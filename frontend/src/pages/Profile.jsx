import { useNavigate } from "react-router-dom";
import { Award, Bell, Download, FlaskConical, MapPinned, Telescope } from "lucide-react";

export default function Profile() {
  const nav = useNavigate();

  return (
    <div className="app-shell min-h-screen text-white p-6 pb-24">
      <div className="mx-auto w-full max-w-lg">
        <button onClick={() => nav("/map")} className="mb-4 text-sm text-white/60">
          Back to map
        </button>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <img src="/terrasip-logo.png" alt="TerraSip profile" className="h-14 w-14 rounded-2xl bg-white/10 p-1.5" />
            <div>
              <h1 className="text-xl font-bold">Alex Explorer</h1>
              <p className="text-sm text-white/55">Member since May 2026</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <Stat label="Sources saved" value="23" />
            <Stat label="Scans" value="146" />
            <Stat label="Regions" value="8" />
          </div>

          <div className="mt-5 space-y-2">
            <MenuItem onClick={() => nav("/map")} icon={<MapPinned className="h-4 w-4 text-green-300" />} label="My sources" />
            <MenuItem onClick={() => nav("/scan")} icon={<Telescope className="h-4 w-4 text-cyan-300" />} label="My scans" />
            <MenuItem onClick={() => nav("/project")} icon={<Award className="h-4 w-4 text-amber-300" />} label="Achievements" />
          </div>

          <div className="mt-5 grid gap-2">
            <button onClick={() => nav("/bottle")} className="btn-primary w-full rounded-xl py-3 font-semibold inline-flex items-center justify-center gap-2">
              <FlaskConical className="h-4 w-4" /> Bottle tab
            </button>
            <button onClick={() => nav("/alerts")} className="w-full rounded-xl border border-white/20 bg-white/5 py-3 font-semibold inline-flex items-center justify-center gap-2">
              <Bell className="h-4 w-4" /> Alerts
            </button>
            <button onClick={() => nav("/offline-maps")} className="w-full rounded-xl border border-white/20 bg-white/5 py-3 font-semibold inline-flex items-center justify-center gap-2">
              <Download className="h-4 w-4" /> Offline maps
            </button>
            <button onClick={() => nav("/project")} className="w-full rounded-xl border border-white/20 bg-white/5 py-3 font-semibold">
              Project story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 py-3">
      <p className="text-xl font-bold text-green-200">{value}</p>
      <p className="mt-1 text-[11px] text-white/55">{label}</p>
    </div>
  );
}

function MenuItem({ onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm"
    >
      <span className="inline-flex items-center gap-3 text-white/80">
        {icon}
        {label}
      </span>
      <span className="text-white/35">›</span>
    </button>
  );
}
