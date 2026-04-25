import { useNavigate } from "react-router-dom";

const stats = [
  { value: "2.2B", label: "people without safely managed drinking water" },
  { value: "50%", label: "global population water-stressed by 2030" },
  { value: "0", label: "consumer tools using satellite water safety intelligence" },
];

const sections = [
  {
    title: "The Problem",
    body:
      "Safe water information is inaccessible to people who need it most. Copernicus sees contamination, drought stress, and flooding patterns, but current tools are built for institutions, not for a person deciding if a nearby source is drinkable.",
  },
  {
    title: "The Solution",
    body:
      "TerraSip combines a smart bottle and mobile app to turn satellite data into one plain answer: Excellent, Good, Poor, or Unsafe. The app uses Galileo positioning and a WQI score driven by chlorophyll-a, turbidity, organic matter, pollution deposition, and precipitation anomalies.",
  },
  {
    title: "Offline-First Advantage",
    body:
      "Users pre-download regional risk maps before travel. In the field, water checks run locally with Galileo coordinates and BLE bottle events, with no internet required. Sync happens automatically when connectivity returns.",
  },
  {
    title: "Copernicus + Galileo Stack",
    body:
      "Sentinel-2 MSI provides core quality indicators, Sentinel-3 OLCI adds large-water-body context and temperature, Sentinel-5P contributes atmospheric deposition risk, C3S adds climate anomaly baselines, and CEMS flags emergency contamination. Galileo enables precise source-level matching.",
  },
  {
    title: "Challenge #1 Fit",
    body:
      "TerraSip directly supports equitable access to water through a permanent free tier, offline functionality, and explainable risk scoring that works for hikers, rural communities, and disaster-response teams alike.",
  },
  {
    title: "Impact Vision",
    body:
      "By year three, the goal is 1M users across 20 countries, tens of thousands of early warnings each year, and faster contamination detection via a feedback loop of satellite signals and community-level observations.",
  },
];

export default function Project() {
  const nav = useNavigate();

  return (
    <div className="app-shell min-h-screen text-white p-5 pb-24">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => nav("/map")} className="text-sm text-white/60">
          Back to map
        </button>

        <header className="glass-card mt-4 rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <img src="/terrasip-logo.png" alt="TerraSip logo" className="h-11 w-11 rounded-full bg-white/10 p-1" />
            <div>
              <h1 className="text-2xl font-bold tracking-[0.2em]">TERRASIP</h1>
              <p className="text-sm text-green-200">Know Your Water. Explore Freely.</p>
            </div>
          </div>
          <p className="mt-4 text-white/80">
            The smart bottle and app that finds drinkable water sources anywhere, powered by European space data and designed
            for offline use.
          </p>
          <p className="mt-2 text-xs text-white/55">
            Cassini Hackathon 2026 | Challenge #1: Equitable Access to Water
          </p>
        </header>

        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="glass-card rounded-2xl p-4">
              <p className="text-2xl font-bold text-green-300">{item.value}</p>
              <p className="mt-2 text-xs text-white/70">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 space-y-3">
          {sections.map((section) => (
            <article key={section.title} className="glass-card rounded-2xl p-4">
              <h2 className="text-lg font-semibold text-green-200">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{section.body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
