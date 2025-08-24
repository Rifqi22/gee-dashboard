import React from "react";
import DateSelector from "../Map/DateSelector";

import Layer from "../Map/Toggle/Layer";

import Panel from "../Core/Panel";
import Control from "../Map/Drawer/Control";

import ReportTrigger from "../Map/Reports/ReportTrigger";
import Copyright from "../Map/Copyright";

interface Props {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  applyDateFilter: () => void;
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
  isDrawing: boolean;
  toggleDrawing: () => void;
  applyAOI: () => void;
  hasAOI: boolean;
  sameAOI: boolean;
  summary: any[];
}
const Sidebar: React.FC<Props> = ({
  startDate, // Date Selector
  endDate, // Date Selector
  setStartDate, // Date Selector
  setEndDate, // Date Selector
  applyDateFilter, // Date Selector
  layers, // Layer Toogle
  opacity, // Layer Toogle
  toggleLayer, // Layer Toogle
  setOpacity, // Layer Toogle
  isDrawing, // Draw Control
  toggleDrawing, // Draw Control
  applyAOI, // Draw Control
  hasAOI, // Draw Control
  sameAOI, // Draw Control
  summary,
}) => {
  return (
    <Panel>
      <DateSelector
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        applyDateFilter={applyDateFilter}
      />
      <Layer
        layers={layers}
        opacity={opacity}
        toggleLayer={toggleLayer}
        setOpacity={setOpacity}
      />
      <Control
        isDrawing={isDrawing}
        toggleDrawing={toggleDrawing}
        applyAOI={applyAOI}
        hasAOI={hasAOI}
        sameAOI={sameAOI}
      />
      <ReportTrigger summary={summary} />
      <Copyright />
    </Panel>
  );
};

export default Sidebar;
