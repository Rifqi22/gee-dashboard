import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TileLayerUpdater } from "./TileLayerUpdater";
import DateSelector from "./dateSelector";

const Map: React.FC = () => {
  const [tileUrl, setTileUrl] = useState("");
  const [date, setDate] = useState("2025-01"); // default date

  const fetchTile = async () => {
    try {
      console.log("FETCHING");
      const req = await fetch(`http://127.0.0.1:8000/tiles/${date}`);
      const res = await req.json();
      if (res.tile_url) {
        console.log("SETTING TILE URL", res.tile_url);
        setTileUrl(res.tile_url);
      }
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
      <DateSelector date={date} setDate={setDate} fetchTile={fetchTile} />

      {/* Leaflet map */}
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
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
};

export default Map;
