import { TileLayer } from "react-leaflet";

interface Props {
  url: string;
  attribution: string;
}

export const TileLayerUpdater: React.FC<Props> = ({ url, attribution }) => {
  if (!url) return null;

  return <TileLayer url={url} attribution={attribution} maxZoom={16} />;
};
