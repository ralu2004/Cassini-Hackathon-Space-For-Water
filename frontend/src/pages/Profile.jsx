import { useNavigate } from "react-router-dom";

export default function Profile() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-[#061211] text-white p-6">
      <div className="mx-auto w-full max-w-lg">
        <button onClick={() => nav("/map")} className="mb-4 text-sm text-white/60">
          Back to map
        </button>

        <div className="rounded-3xl border border-white/10 bg-[#0d1c19] p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-500/20 text-2xl">👤</div>
            <div>
              <h1 className="text-xl font-bold">Explorer Profile</h1>
              <p className="text-sm text-white/55">MVP offline demo account</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <ProfileRow label="Preferred mode" value="Satellite + bottle scan" />
            <ProfileRow label="Saved water sources" value="4" />
            <ProfileRow label="Recent scans" value="12 this week" />
          </div>

          <button onClick={() => nav("/scan")} className="mt-6 w-full rounded-xl bg-white/10 py-3 font-semibold">
            Open bottle scan
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
