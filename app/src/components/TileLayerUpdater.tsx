import { TileLayer } from "react-leaflet";

interface Props {
  url: string;
}

export const TileLayerUpdater: React.FC<Props> = ({ url }) => {
  if (!url) return null;

  return <TileLayer url={url} attribution="MODIS LST" maxZoom={16} />;
};
