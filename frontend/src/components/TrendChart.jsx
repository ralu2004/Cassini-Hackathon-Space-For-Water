export default function TrendChart({ data }) {
  return (
    <div className="text-white/50 text-sm">
      Trend data points: {data?.length || 0}
    </div>
  );
}
