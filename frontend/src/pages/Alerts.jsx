import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Droplets, MapPin, Bell } from "lucide-react";
import { getRiskAnalysis, getTrends, getWaterQuality } from "../lib/api";
import { getLastCoords } from "../lib/location";

export default function Alerts() {
  const nav = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAlerts() {
      setIsLoading(true);
      setError("");
      try {
        const coords = getLastCoords();
        const [quality, risk, trends] = await Promise.all([
          getWaterQuality(coords.lat, coords.lon),
          getRiskAnalysis(coords.lat, coords.lon),
          getTrends(coords.lat, coords.lon),
        ]);

        const generatedAlerts = [];

        if (quality.wqi < 50) {
          generatedAlerts.push({
            icon: AlertTriangle,
            title: "High-risk source nearby",
            message: `${quality.nearest_water_body.name} is currently ${quality.class_name.toLowerCase()} (${quality.wqi}/100).`,
            time: "Just now",
            accent: "bg-red-500/15 text-red-200 border-red-400/30",
            iconColor: "text-red-300",
          });
        }

        (risk.warnings || []).slice(0, 2).forEach((warning, index) => {
          generatedAlerts.push({
            icon: AlertTriangle,
            title: index === 0 ? "Risk warning" : "Additional warning",
            message: warning,
            time: "Just now",
            accent: "bg-amber-500/15 text-amber-200 border-amber-400/30",
            iconColor: "text-amber-300",
          });
        });

        if (trends?.points?.length > 1) {
          const last = trends.points.at(-1)?.wqi ?? quality.wqi;
          const prev = trends.points.at(-2)?.wqi ?? quality.wqi;
          const delta = last - prev;
          generatedAlerts.push({
            icon: Droplets,
            title: delta < 0 ? "Water quality changed" : "Water quality update",
            message:
              delta < 0
                ? `WQI decreased by ${Math.abs(delta)} points in the latest pass.`
                : `WQI improved by ${delta} points in the latest pass.`,
            time: "Latest satellite pass",
            accent:
              delta < 0
                ? "bg-amber-500/15 text-amber-200 border-amber-400/30"
                : "bg-green-500/15 text-green-200 border-green-400/30",
            iconColor: delta < 0 ? "text-amber-300" : "text-green-300",
          });
        }

        generatedAlerts.push({
          icon: MapPin,
          title: "Nearest source tracked",
          message: `${quality.nearest_water_body.name} is ${quality.nearest_water_body.distance_km.toFixed(1)} km away.`,
          time: "Location sync",
          accent: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
          iconColor: "text-cyan-300",
        });

        if (!generatedAlerts.length) {
          generatedAlerts.push({
            icon: Bell,
            title: "No active alerts",
            message: "No critical warnings detected for your last scanned location.",
            time: "Just now",
            accent: "bg-green-500/15 text-green-200 border-green-400/30",
            iconColor: "text-green-300",
          });
        }

        setAlerts(generatedAlerts);
      } catch {
        setError("Could not load live alerts right now.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAlerts();
  }, []);

  return (
    <div className="app-shell min-h-screen text-white p-5 pb-24">
      <div className="mx-auto max-w-xl">
        <button onClick={() => nav("/map")} className="rounded-xl border border-white/15 bg-white/5 p-2">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl glass-card">
            <Bell className="h-5 w-5 text-green-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Alerts</h1>
            <p className="text-sm text-white/60">Real-time water risk notifications.</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {isLoading && <div className="glass-card rounded-2xl p-4 text-sm text-white/65">Loading alerts...</div>}
          {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/15 p-4 text-sm text-red-100">{error}</div>}
          {alerts.map((a, i) => {
            const Icon = a.icon;
            return (
              <article
                key={i}
                className={`glass-card rounded-2xl p-4 border ${a.accent}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 ${a.iconColor}`} />
                  <div className="flex-1">
                    <h2 className="font-semibold">{a.title}</h2>
                    <p className="mt-1 text-sm text-white/75">{a.message}</p>
                    <p className="mt-2 text-[11px] text-white/45">{a.time}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button
          onClick={() => nav("/map")}
          className="btn-primary mt-6 w-full rounded-2xl py-3.5 font-semibold"
        >
          Open map
        </button>
      </div>
    </div>
  );
}
