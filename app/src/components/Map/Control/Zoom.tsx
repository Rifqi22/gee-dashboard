import React from "react";

interface Props {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

const Zoom: React.FC<Props> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 flex flex-col gap-2">
      <button
        onClick={onZoomIn}
        className="size-5 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded"
      >
        <span className="text-white text-lg font-bold">+</span>
      </button>
      <button
        onClick={onZoomOut}
        className="size-5 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded"
      >
        <span className="text-white text-lg font-bold">−</span>
      </button>
    </div>
  );
};

export default Zoom;
