import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface LayerControlProps {
  label: string;
  active: boolean;
  opacity: number;
  onToggle: () => void;
  onOpacityChange: (value: number) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({
  label,
  active,
  opacity,
  onToggle,
  onOpacityChange,
}) => {
  const Icon = active ? EyeIcon : EyeSlashIcon;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <button
          onClick={onToggle}
          className="text-white hover:text-blue-400 transition"
          aria-label={`Toggle ${label}`}
        >
          <Icon className="w-5 h-5" />
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={opacity}
        onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500"
        disabled={!active}
      />
      <div className="text-right text-neutral-400 text-[10px]">
        Opacity: {(opacity * 100).toFixed(0)}%
      </div>
    </div>
  );
};

export default LayerControl;
