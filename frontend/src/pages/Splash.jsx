import { useNavigate } from "react-router-dom";

export default function Splash() {
  const nav = useNavigate();

  return (
    <div className="h-screen relative text-white overflow-hidden">

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">

        {/* Top */}
        <div>
          <h1 className="text-3xl font-bold tracking-widest">TERRASIP</h1>
          <p className="text-green-300 text-sm">Know your water. Explore freely.</p>
        </div>

        {/* Center logo */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">💧</div>
          <p className="text-lg font-light">
            Safe water. <br />
            Better adventures.
          </p>
        </div>

        {/* Bottom button */}
        <button
          onClick={() => nav("/onboarding")}
          className="bg-green-500 text-black py-3 rounded-xl font-semibold"
        >
          Get Started
        </button>

      </div>
    </div>
  );
}
