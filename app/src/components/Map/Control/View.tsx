import React from "react";

interface Props {
  onResetView?: () => void;
  onToggleFullscreen?: () => void;
}

const View: React.FC<Props> = ({ onResetView, onToggleFullscreen }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 flex flex-col gap-2 mt-2">
      <button
        onClick={onResetView}
        className="size-5 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded"
      >
        <span className="text-white text-lg font-bold">+</span>
      </button>
      <button
        onClick={onToggleFullscreen}
        className="size-5 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded"
      >
        <span className="text-white text-lg font-bold">-</span>
      </button>
    </div>
  );
};

export default View;
