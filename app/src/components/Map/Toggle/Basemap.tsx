import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface Props {
  initial?: "osm" | "topo";
}

const Basemap: React.FC<Props> = ({ initial = "osm" }) => {
  const [active, setActive] = useState(initial);
  const map = useMap();

  const basemaps = [
    {
      label: "osm",
      icon: "",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      label: "topo",
      icon: "",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    },
  ];
  const urls = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  };

  useEffect(() => {
    // Remove existing base layers
    map.eachLayer((layer: any) => {
      if (layer.options && layer.options.baseLayer) {
        map.removeLayer(layer);
      }
    });

    // Add selected base layer using Leaflet directly
    const tile = L.tileLayer(urls[active], {
      attribution: active === "osm" ? "OpenStreetMap" : "Topography",
      baseLayer: true,
    }).addTo(map);

    return () => {
      map.removeLayer(tile); // cleanup on unmount
    };
  }, [active, map]);

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
            d="M3 5h18M3 12h18M3 19h18"
          />
        </svg>
        Basemap
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {basemaps.map((map) => (
          <button
            key={map.label}
            className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
            onClick={() => setActive(map.label)}
          >
            {map.icon} {map.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Basemap;
