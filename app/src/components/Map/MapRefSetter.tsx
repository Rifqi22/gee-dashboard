import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";

export const MapRefSetter: React.FC<{
  mapRef: React.RefObject<LeafletMap | null>;
}> = ({ mapRef }) => {
  const map = useMap();
  useEffect(() => {
    if (mapRef?.current === null) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  return null;
};
