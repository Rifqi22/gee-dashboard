import React, { useState, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import {
  MapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface Props {
  initial?: "osm" | "topo" | "satellite" | "dark";
}

const Basemap: React.FC<Props> = ({ initial = "osm" }) => {
  const [active, setActive] = useState(initial);
  const [isExtended, setIsExtended] = useState(false);
  const map = useMap();
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const basemaps = [
    {
      label: "osm",
      name: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      thumbnail: "https://a.tile.openstreetmap.org/12/2220/1470.png",
      attribution: "© OpenStreetMap contributors",
    },
    {
      label: "topo",
      name: "Topo Map",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      thumbnail: "https://a.tile.opentopomap.org/12/2220/1470.png",
      attribution: "© OpenTopoMap contributors",
    },
    {
      label: "satellite",
      name: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      thumbnail:
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/1470/2220",
      attribution: "© Esri & contributors",
    },
    {
      label: "dark",
      name: "Dark Mode",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      thumbnail: "https://a.basemaps.cartocdn.com/dark_all/12/2220/1470.png",
      attribution: "© CartoDB",
    },
  ];

  useEffect(() => {
    const selected = basemaps.find((b) => b.label === active);
    if (!selected) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(selected.url, {
      attribution: selected.attribution,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [active, map]);

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-semibold text-sm flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-white" />
          Basemap
        </h2>
        <button
          onClick={() => setIsExtended((prev) => !prev)}
          className="text-white hover:text-blue-400 transition"
        >
          {isExtended ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExtended ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex gap-2 mt-2">
          {basemaps.map((bm) => (
            <button
              key={bm.label}
              onClick={(e) => {
                e.stopPropagation();
                setActive(bm.label);
              }}
              className={`rounded overflow-hidden border ${
                active === bm.label ? "border-blue-500" : "border-neutral-700"
              }`}
            >
              <img
                src={bm.thumbnail}
                alt={bm.name}
                className="min-w-[7rem] h-20 object-cover"
              />
              <div className="bg-neutral-800 text-white text-xs text-center py-1 font-medium">
                {bm.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Basemap;
