import { standConfigs } from "../../data/stands";
import "./StandPicker.css";

interface Props {
  standIndex: number;
  onChangeStand: (index: number) => void;
}

export function StandPicker({ standIndex, onChangeStand }: Props) {
  return (
    <div className="stand-picker-bar">
      <span className="stand-picker-label">Stand:</span>
      <div className="stand-picker-options">
        {standConfigs.map((sc, i) => (
          <button
            key={sc.id}
            className={`stand-pick ${standIndex === i ? "active" : ""}`}
            onClick={() => onChangeStand(i)}
            title={sc.name}
          >
            <img src={`/stands/${sc.id}.png`} alt={sc.name} />
            <span className="stand-pick-name">{sc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
