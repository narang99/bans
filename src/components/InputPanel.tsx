interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
}

const PLACEHOLDER = `Paste your notation here...

Example:
Ye li hai meri aankhon ne
S..G..m..D..P..P…M..P…

Kasam ae yaar
M..P..M..P…n…R…`;

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span>Input Notation</span>
      </div>
      <div className="panel-content">
        <textarea
          className="input-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
