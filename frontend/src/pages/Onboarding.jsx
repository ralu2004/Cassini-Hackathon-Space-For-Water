import { useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    icon: "🛰",
    title: "Satellite-powered water checks",
    text: "Fuse Copernicus signals with terrain and weather context to score local water risk.",
  },
  {
    icon: "📍",
    title: "Smart map recommendations",
    text: "Locate nearby sources, compare confidence, and pick safer refill points in seconds.",
  },
  {
    icon: "🧪",
    title: "Bottle + AI validation",
    text: "Combine satellite prediction with bottle observations for clearer drink / avoid guidance.",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const nav = useNavigate();
  const slide = slides[index];

  function next() {
    if (index < slides.length - 1) setIndex(index + 1);
    else nav("/map");
  }

  return (
    <div className="app-shell min-h-screen text-white flex flex-col justify-between p-6">
      <button
        onClick={() => nav("/map")}
        className="self-end text-sm text-white/50"
      >
        Skip
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="glass-card h-56 w-56 rounded-[2rem] flex items-center justify-center text-7xl shadow-[0_0_60px_rgba(74,222,128,.18)]">
          {slide.icon}
        </div>

        <h1 className="mt-10 text-3xl font-bold leading-tight max-w-sm">
          {slide.title}
        </h1>

        <p className="mt-4 text-white/65 leading-relaxed max-w-xs">
          {slide.text}
        </p>

        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-green-400" : "w-2 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="bg-green-400 text-[#052015] py-4 rounded-2xl font-bold"
      >
        {index === slides.length - 1 ? "Open TerraSip" : "Next"}
      </button>
    </div>
  );
}
