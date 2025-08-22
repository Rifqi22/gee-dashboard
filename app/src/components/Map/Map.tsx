import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TileLayerUpdater } from "./TileLayerUpdater";

import MapPopup from "./MapPopup";
import Sidebar from "../Layout/Sidebar";
import Basemap from "./Toggle/Basemap";
import Wrapper from "../Core/Wrapper";
import MapControl from "./Control/MapControl";

const Map: React.FC = () => {
  const [tileUrls, setTileUrls] = useState({
    lst: "",
    ndvi: "",
  });
  const [date, setDate] = useState("2025-01"); // default date
  const [layers, setLayers] = useState({
    lst: true,
    ndvi: false,
  });

  const toggleLayer = (layerName: "lst" | "ndvi") => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  const mapRef = useRef<any>(null);

  const fetchTile = async () => {
    try {
      const urls: { lst?: string; ndvi?: string } = {};

      if (layers.lst) {
        const resLST = await fetch(`http://127.0.0.1:8000/tiles_lst/${date}`);
        const jsonLST = await resLST.json();
        if (jsonLST.tile_url) {
          urls.lst = jsonLST.tile_url;
        }
      }

      if (layers.ndvi) {
        const resNDVI = await fetch(`http://127.0.0.1:8000/tiles_ndvi/${date}`);
        const jsonNDVI = await resNDVI.json();
        if (jsonNDVI.tile_url) {
          urls.ndvi = jsonNDVI.tile_url;
        }
      }

      setTileUrls((prev) => ({
        ...prev,
        ...urls,
      }));
    } catch (err) {
      console.error("Failed to fetch tile:", err);
      alert("Error fetching tile from backend");
    }
  };

  useEffect(() => {
    fetchTile();
  }, [date, layers]);

  return (
    <div className="flex w-screen">
      <Sidebar
        date={date}
        setDate={setDate}
        fetchTile={fetchTile}
        layers={layers}
        toggleLayer={toggleLayer}
      />
      <div className="flex-1 h-[calc(100vh-4rem)]">
        {/* Sidebar*/}

        {/* Leaflet map */}
        <MapContainer
          center={[0, 0]}
          zoom={2}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Base layers */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="OpenStreetMap"
          />
          <Wrapper className="absolute bottom-10 left-10 z-[500] rounded-md">
            <Basemap />
          </Wrapper>
          {/* <Wrapper className="absolute top-4 right-4 z-[500] rounded-md">
            <MapControl
              onResetView={handleResetView}
              onToggleFullscreen={handleToggleFullscreen}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          </Wrapper> */}
          <MapPopup date={date} />
          {/* MODIS tile layer from backend */}
          {layers.lst && tileUrls.lst && (
            <TileLayerUpdater url={tileUrls.lst} attribution="MODIS LST" />
          )}
          {layers.ndvi && tileUrls.ndvi && (
            <TileLayer url={tileUrls.ndvi} attribution="MODIS NDVI" />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
