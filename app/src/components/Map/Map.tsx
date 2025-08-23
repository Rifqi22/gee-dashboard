import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TileLayerUpdater } from "./TileLayerUpdater";

import MapPopup from "./MapPopup";
import Sidebar from "../Layout/Sidebar";
import Basemap from "./Toggle/Basemap";
import Wrapper from "../Core/Wrapper";
import MapControl from "./Control/MapControl";
import Drawer from "./Drawer/Drawer";
import { AMAZON_BRAZIL_JSON } from "../../utils/constant";
import Legend from "./Legend";

const Map: React.FC = () => {
  const [tileUrls, setTileUrls] = useState({
    lst: "",
    ndvi: "",
  });
  const [startDate, setStartDate] = useState("2025-01"); // default start date
  const [endDate, setEndDate] = useState("2025-02"); // default end date
  const [layers, setLayers] = useState({
    lst: true,
    ndvi: false,
  });
  const [AOI, setAOI] = useState<any>(AMAZON_BRAZIL_JSON);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sameAOI, setSameAOI] = useState(true);
  const mapRef = useRef<any>(null);

  const [opacity, setOpacityState] = useState({ lst: 1, ndvi: 1 });

  const setOpacity = (layer: "lst" | "ndvi", value: number) => {
    setOpacityState((prev) => ({ ...prev, [layer]: value }));
  };

  const [legendStats, setLegendStats] = useState({
    lst: { min: 0, max: 40 },
    ndvi: { min: -1, max: 1 },
  });

  const toggleDrawing = () => {
    setIsDrawing((prev) => !prev);
    setSameAOI(false);
    if (isDrawing) {
      setAOI(null);
    }
  };

  const applyAOI = () => {
    fetchTile();
    fetchLegendStats();
    setIsDrawing(false);
    setSameAOI(true);
  };

  const applyDateFilter = () => {
    fetchTile();
    fetchLegendStats();
  };

  const toggleLayer = (layerName: "lst" | "ndvi") => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  const fetchLegendStats = async () => {
    try {
      const query = new URLSearchParams();
      query.append("start_date", startDate);
      query.append("end_date", endDate);
      if (AOI) {
        query.append("aoi", JSON.stringify(AOI));
      }

      const stats: {
        lst?: { min: number; max: number };
        ndvi?: { min: number; max: number };
      } = {};

      const requests = [];

      if (layers.lst) {
        requests.push(
          fetch(`http://127.0.0.1:8000/legend_stats_lst?${query}`).then((res) =>
            res.json()
          )
        );
      }

      if (layers.ndvi) {
        requests.push(
          fetch(`http://127.0.0.1:8000/legend_stats_ndvi?${query}`).then(
            (res) => res.json()
          )
        );
      }

      const results = await Promise.all(requests);

      if (layers.lst && results[0]) {
        stats.lst = { min: results[0].min, max: results[0].max };
      }

      if (layers.ndvi && results.length === 2) {
        stats.ndvi = { min: results[1].min, max: results[1].max };
      } else if (layers.ndvi && results.length === 1 && !layers.lst) {
        stats.ndvi = { min: results[0].min, max: results[0].max };
      }

      setLegendStats((prev) => ({
        ...prev,
        ...stats,
      }));
    } catch (err) {
      console.error("Failed to fetch legend stats:", err);
    }
  };

  const fetchTile = async () => {
    try {
      const urls: { lst?: string; ndvi?: string } = {};

      const query = new URLSearchParams();
      query.append("start_date", startDate);
      query.append("end_date", endDate);
      if (AOI) {
        query.append("aoi", JSON.stringify(AOI));
      }

      if (layers.lst) {
        const resLST = await fetch(`http://127.0.0.1:8000/tiles_lst?${query}`);
        const jsonLST = await resLST.json();
        if (jsonLST.tile_url) {
          urls.lst = jsonLST.tile_url;
        }
      }

      if (layers.ndvi) {
        const resNDVI = await fetch(
          `http://127.0.0.1:8000/tiles_ndvi?${query}`
        );
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
    fetchLegendStats();
  }, [layers]);

  return (
    <div className="flex w-screen">
      {/* Sidebar*/}
      <Sidebar
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        applyDateFilter={applyDateFilter}
        layers={layers}
        opacity={opacity}
        toggleLayer={toggleLayer}
        setOpacity={setOpacity}
        isDrawing={isDrawing}
        toggleDrawing={toggleDrawing}
        applyAOI={applyAOI}
        hasAOI={!!AOI}
        sameAOI={sameAOI}
      />
      <div className="flex-1 h-[calc(100vh-4rem)]">
        {/* Leaflet map */}
        <MapContainer
          center={[-4, -60]} //BRAZIL CENTER
          zoom={6}
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
          {/* Basemap */}
          <Wrapper className="absolute bottom-5 left-5 z-[500] rounded-md min-w-[20rem]">
            <Basemap />
          </Wrapper>
          {/* Legend */}
          <Wrapper className="absolute bottom-5 right-5 z-[500] space-y-2 rounded-md min-w-[20rem]">
            {layers.lst && legendStats.lst && (
              <Legend type="lst" legendStats={legendStats.lst} />
            )}

            {layers.ndvi && legendStats.ndvi && (
              <Legend type="ndvi" legendStats={legendStats.ndvi} />
            )}
          </Wrapper>
          {/* <Wrapper className="absolute top-4 right-4 z-[500] rounded-md">
            <MapControl
              onResetView={handleResetView}
              onToggleFullscreen={handleToggleFullscreen}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          </Wrapper> */}
          {/* MAP FUNCTION */}
          {!isDrawing && <MapPopup startDate={startDate} endDate={endDate} />}
          {isDrawing && <Drawer setAOI={setAOI} />}
          {/* MODIS LST tile layer */}
          {layers.lst && tileUrls.lst && (
            <TileLayerUpdater
              url={tileUrls.lst}
              attribution="MODIS LST"
              opacity={opacity.lst}
            />
          )}

          {/* NDVI SENTINEL 2  tile layer */}
          {layers.ndvi && tileUrls.ndvi && (
            <TileLayer
              url={tileUrls.ndvi}
              attribution="MODIS NDVI"
              opacity={opacity.ndvi}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
