import React from "react";

const Legend = () => {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-3 text-sm text-white z-50">
      <strong>LST (°C)</strong>
      <div
        style={{
          background: "linear-gradient(to right, blue, green, yellow, red)",
          height: 10,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>0</span>
        <span>40</span>
      </div>
    </div>
  );
};

export default Legend;
