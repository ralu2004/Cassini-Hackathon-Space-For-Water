import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  return (
    <div className="app-shell min-h-screen text-white flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md rounded-3xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <img src="/terrasip-logo.png" alt="TerraSip logo" className="h-10 w-10 rounded-full bg-white/10 p-1" />
          <span className="text-sm tracking-[0.24em] text-green-200">TERRASIP</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-white/60">Demo mode login for the MVP experience.</p>

        <div className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none ring-green-400/40 placeholder:text-white/35 focus:ring"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none ring-green-400/40 placeholder:text-white/35 focus:ring"
          />
        </div>

        <button onClick={() => nav("/map")} className="mt-5 w-full rounded-xl bg-green-400 py-3 font-semibold text-[#052015]">
          Continue to map
        </button>
      </div>
    </div>
  );
}
