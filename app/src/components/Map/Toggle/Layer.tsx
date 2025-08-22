import React from "react";

interface Props {
  layers: {
    lst: boolean;
    ndvi: boolean;
  };
  toggleLayer: (layerName: keyof typeof layers) => void;
}

const Layer: React.FC<Props> = ({ layers, toggleLayer }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-semibold text-sm flex items-center gap-2">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        Map Layers
      </h2>
      <div className="space-y-2 text-xs text-neutral-300">
        <label className="flex items-center justify-between">
          Land Surface Temperature
          <input
            type="checkbox"
            checked={layers.lst}
            onChange={() => toggleLayer("lst")}
            className="form-checkbox accent-blue-500"
          />
        </label>
        <label className="flex items-center justify-between">
          Normalized Difference Vegetation Index
          <input
            type="checkbox"
            checked={layers.ndvi}
            onChange={() => toggleLayer("ndvi")}
            className="form-checkbox accent-blue-500"
          />
        </label>
      </div>
    </div>
  );
};

export default Layer;
