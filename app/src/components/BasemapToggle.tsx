import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface BasemapToggleProps {
  initial?: "osm" | "topo";
}

const BasemapToggle: React.FC<BasemapToggleProps> = ({ initial = "osm" }) => {
  const [active, setActive] = useState(initial);
  const map = useMap();

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
    <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-md flex space-x-2 z-[999]">
      <button
        className={`px-3 py-1 rounded ${
          active === "osm" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => setActive("osm")}
      >
        OSM
      </button>
      <button
        className={`px-3 py-1 rounded ${
          active === "topo" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => setActive("topo")}
      >
        Topo
      </button>
    </div>
  );
};

export default BasemapToggle;
