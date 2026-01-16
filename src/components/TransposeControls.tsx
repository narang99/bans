interface TransposeControlsProps {
  value: number;
  onChange: (value: number) => void;
}

export function TransposeControls({ value, onChange }: TransposeControlsProps) {
  const handleDecrease = () => onChange(value - 1);
  const handleIncrease = () => onChange(value + 1);
  const handleReset = () => onChange(0);

  const valueClass = value > 0 ? 'positive' : value < 0 ? 'negative' : '';
  const displayValue = value > 0 ? `+${value}` : value.toString();

  return (
    <div className="controls-container">
      <div className="transpose-controls">
        <button className="transpose-btn" onClick={handleDecrease} title="Decrease by 1 semitone">
          −
        </button>
        
        <div className="transpose-value">
          <span className={`transpose-number ${valueClass}`}>
            {displayValue}
          </span>
          <span className="transpose-label">semitones</span>
        </div>
        
        <button className="transpose-btn" onClick={handleIncrease} title="Increase by 1 semitone">
          +
        </button>
      </div>
      
      {value !== 0 && (
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      )}
    </div>
  );
}
