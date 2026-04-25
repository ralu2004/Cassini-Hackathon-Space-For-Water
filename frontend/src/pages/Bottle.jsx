import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bluetooth, FlaskConical, Thermometer, Waves } from "lucide-react";

const STORAGE_KEY = "terrasip-bottle-linked";

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

export default function Bottle() {
  const nav = useNavigate();
  const [linked, setLinked] = useState(false);
  const [stats, setStats] = useState({
    fillLevel: 67,
    waterTempC: 15.2,
    conductivity: 0.4,
    battery: 84,
    lastSync: "just now",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setLinked(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(linked));
  }, [linked]);

  useEffect(() => {
    if (!linked) return undefined;

    const timer = setInterval(() => {
      setStats((prev) => ({
        fillLevel: Math.max(12, Math.min(100, prev.fillLevel + randomBetween(-3, 2))),
        waterTempC: Math.max(3, Math.min(24, prev.waterTempC + randomBetween(-0.5, 0.6))),
        conductivity: Math.max(0.1, Math.min(1.5, prev.conductivity + randomBetween(-0.08, 0.09))),
        battery: Math.max(10, Math.min(100, prev.battery - randomBetween(0, 0.2))),
        lastSync: "just now",
      }));
    }, 2200);

    return () => clearInterval(timer);
  }, [linked]);

  return (
    <div className="app-shell min-h-screen text-white p-5 pb-24">
      <div className="mx-auto max-w-xl">
        <button onClick={() => nav("/map")} className="rounded-xl border border-white/15 bg-white/5 p-2">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="glass-card mt-4 rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bottle Live</h1>
              <p className="text-sm text-white/65">From space to your next sip.</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${linked ? "bg-green-400/20 text-green-200" : "bg-white/10 text-white/70"}`}>
              {linked ? "Linked" : "Not linked"}
            </span>
          </div>

          <button
            onClick={() => setLinked((v) => !v)}
            className={`mt-4 w-full rounded-xl py-3 font-semibold ${linked ? "bg-white/10" : "btn-primary"}`}
          >
            <span className="inline-flex items-center gap-2">
              <Bluetooth className="h-4 w-4" />
              {linked ? "Unlink bottle" : "Link bottle"}
            </span>
          </button>
        </div>

        {!linked && (
          <div className="glass-card mt-4 rounded-2xl p-5 text-center">
            <FlaskConical className="mx-auto h-8 w-8 text-white/70" />
            <p className="mt-3 font-semibold">No bottle connected</p>
            <p className="mt-1 text-sm text-white/65">
              Link your TerraSip bottle to see live fill level, water temperature, and telemetry updates.
            </p>
          </div>
        )}

        {linked && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatCard icon={<Waves className="h-4 w-4 text-cyan-300" />} label="Fill level" value={`${stats.fillLevel.toFixed(0)}%`} />
            <StatCard icon={<Thermometer className="h-4 w-4 text-orange-300" />} label="Water temp" value={`${stats.waterTempC.toFixed(1)} C`} />
            <StatCard icon={<Bluetooth className="h-4 w-4 text-green-300" />} label="Conductivity" value={`${stats.conductivity.toFixed(2)} mS/cm`} />
            <StatCard icon={<FlaskConical className="h-4 w-4 text-violet-300" />} label="Battery" value={`${stats.battery.toFixed(0)}%`} />
            <div className="glass-card rounded-2xl p-4 sm:col-span-2">
              <p className="text-xs text-white/55">Last sync</p>
              <p className="mt-1 text-sm font-semibold">{stats.lastSync}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-white/65">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-xl font-bold text-green-200">{value}</p>
    </div>
  );
}
