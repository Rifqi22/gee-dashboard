import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Helper component to update TileLayer dynamically
function TileLayerUpdater({ url }) {
  const map = useMap();

  useEffect(() => {
    if (!url) return;

    // Remove existing TileLayer if exists
    map.eachLayer((layer) => {
      if (layer.options && layer.options.attribution === "MODIS LST") {
        map.removeLayer(layer);
      }
    });

    // Add new TileLayer
    const tileLayer = new TileLayer(url, { attribution: "MODIS LST", maxZoom: 16 });
    tileLayer.addTo(map);
  }, [url, map]);

  return null;
}

function App() {
  const [date, setDate] = useState("2025-01"); // default date
  const [tileUrl, setTileUrl] = useState("");

  const fetchTile = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/tiles_lst/${date}`);
      setTileUrl(res.data.tile_url);
    } catch (err) {
      console.error("Failed to fetch tile:", err);
      alert("Error fetching tile from backend");
    }
  };

  useEffect(() => {
    fetchTile();
  }, [date]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* Date selector */}
      <div style={{ position: "absolute", zIndex: 1000, padding: 10 }}>
        <label>
          Select Month (YYYY-MM):
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginLeft: 10 }}
          />
        </label>
        <button onClick={fetchTile} style={{ marginLeft: 10 }}>Update</button>
      </div>

      {/* Leaflet map */}
      <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        {/* Base layers */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="OpenStreetMap"
        />
        {/* MODIS tile layer from backend */}
        {tileUrl && <TileLayerUpdater url={tileUrl} />}
      </MapContainer>
    </div>
  );
}

export default App;
