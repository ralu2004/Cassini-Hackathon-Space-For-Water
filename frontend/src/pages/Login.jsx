import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-[#061211] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1c19] p-6 shadow-2xl">
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

        <button onClick={() => nav("/map")} className="mt-5 w-full rounded-xl bg-green-500 py-3 font-semibold text-black">
          Continue to map
        </button>
      </div>
    </div>
  );
}
