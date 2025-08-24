import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import type { Geometry } from "geojson";
// import type { DrawEvents } from "leaflet-draw";

interface Props {
  setAOI: (geojson: Geometry) => void;
}
const Drawer: React.FC<Props> = ({ setAOI }) => {
  const onCreated = (e: { layer: unknown }) => {
    const layer = e.layer as L.Layer & {
      toGeoJSON: () => { geometry: Geometry };
    };
    const geojson = layer.toGeoJSON().geometry;
    setAOI(geojson); // store AOI in state
  };

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={onCreated}
        draw={{
          rectangle: true,
          polygon: true,
          circle: false,
          marker: false,
          polyline: false,
        }}
      />
    </FeatureGroup>
  );
};

export default Drawer;
