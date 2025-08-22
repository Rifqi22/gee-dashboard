import React from "react";
import DateSelector from "../Map/DateSelector";
import Basemap from "../Map/Toggle/Basemap";
import Layer from "../Map/Toggle/Layer";
import Legend from "../Map/Legend";
import Panel from "../Core/Panel";

interface Props {
  date: string;
  setDate: (date: string) => void;
  fetchTile: () => void;
  layers: { lst: boolean; ndvi: boolean };
  toggleLayer: () => void;
}
const Sidebar: React.FC<Props> = ({
  date,
  setDate,
  fetchTile,
  layers,
  toggleLayer,
}) => {
  return (
    <Panel>
      <DateSelector date={date} setDate={setDate} fetchTile={fetchTile} />
      <Layer layers={layers} toggleLayer={toggleLayer} />
      <Legend />
    </Panel>
  );
};

export default Sidebar;
