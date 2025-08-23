interface LegendProps {
  type: "lst" | "ndvi";
  legendStats: {
    min: number;
    max: number;
  };
}

const Legend: React.FC<LegendProps> = ({ type, legendStats }) => {
  const gradient =
    type === "lst"
      ? "linear-gradient(to right, blue, green, yellow, red)"
      : "linear-gradient(to right, brown, yellowgreen, green)";

  const label = type === "lst" ? "LST (°C)" : "NDVI";

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-3 text-sm text-white z-50">
      <strong>{label}</strong>
      <div style={{ background: gradient, height: 10 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{legendStats.min?.toFixed(2)}</span>
        <span>{legendStats.max?.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Legend;
