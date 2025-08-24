import { TileLayer } from "react-leaflet";

interface Props {
  url: string;
  attribution: string;
  opacity?: number;
}

export const TileLayerUpdater: React.FC<Props> = ({
  url,
  attribution,
  opacity,
}) => {
  if (!url) return null;

  return (
    <TileLayer
      url={url}
      attribution={attribution}
      opacity={opacity}
      maxZoom={16}
    />
  );
};
