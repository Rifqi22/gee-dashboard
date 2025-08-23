import React from "react";
import LayerControl from "./LayerControl";
import { Square2StackIcon } from "@heroicons/react/24/outline";

interface Props {
  layers: {
    lst: boolean;
    ndvi: boolean;
  };
  opacity: {
    lst: number;
    ndvi: number;
  };
  toggleLayer: (layerName: keyof typeof layers) => void;
  setOpacity: (layerName: keyof typeof layers, value: number) => void;
}
const Layer: React.FC<Props> = ({
  layers,
  opacity,
  toggleLayer,
  setOpacity,
}) => {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-semibold text-sm flex items-center gap-2">
        <Square2StackIcon className="w-4 h-4 text-white" />
        Map Layers
      </h2>
      <hr className="text-neutral-500" />

      <div className="space-y-4 text-xs text-neutral-300">
        <LayerControl
          label="Land Surface Temperature"
          active={layers.lst}
          opacity={opacity.lst}
          onToggle={() => toggleLayer("lst")}
          onOpacityChange={(val) => setOpacity("lst", val)}
        />
        <LayerControl
          label="Normalized Difference Vegetation Index"
          active={layers.ndvi}
          opacity={opacity.ndvi}
          onToggle={() => toggleLayer("ndvi")}
          onOpacityChange={(val) => setOpacity("ndvi", val)}
        />
      </div>
    </div>
  );
};

export default Layer;
