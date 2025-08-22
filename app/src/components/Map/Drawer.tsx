import { FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

interface Props {
  setAOI: (geojson: any) => void;
}

const Drawer: React.FC<Props> = ({ setAOI }) => {
  const map = useMap();

  const onCreated = (e: any) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON().geometry;
    setAOI(geojson); // store AOI in state
  };

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={onCreated}
        draw={{ rectangle: true, polygon: true }}
      />
    </FeatureGroup>
  );
};

export default Drawer;
