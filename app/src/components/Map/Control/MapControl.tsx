import React from "react";
import Zoom from "./Zoom";
import View from "./View";

interface Props {
  onResetView?: () => void;
  onToggleFullscreen?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

const MapControl: React.FC<Props> = ({
  onResetView,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="flex flex-col items-center space-y-2 ">
      <Zoom onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
      <View onResetView={onResetView} onToggleFullscreen={onToggleFullscreen} />
    </div>
  );
};

export default MapControl;
