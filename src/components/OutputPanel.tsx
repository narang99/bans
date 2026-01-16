import { type ValidationError } from '../core';
import { type ParsedLine } from '../parsers';

interface OutputPanelProps {
  output: string;
  parsedLines: ParsedLine[];
  errors: ValidationError[];
}

export function OutputPanel({ output, parsedLines, errors }: OutputPanelProps) {
  const outputLines = output.split('\n');
  
  // Build a map of line numbers with errors
  const errorLineNumbers = new Set(errors.map(e => e.lineNumber));
  
  return (
    <div className="panel">
      <div className="panel-header">
        <span>Transposed Output</span>
        {errors.length > 0 && (
          <span style={{ color: 'var(--red-dim)', fontSize: '0.8rem' }}>
            ⚠ {errors.length} issue{errors.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="panel-content">
        <div className="output-display">
          {output ? (
            <>
              {outputLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isNotation = parsedLines[idx]?.type === 'notation';
                const hasError = errorLineNumbers.has(lineNum);
                
                return (
                  <div
                    key={idx}
                    className={`output-line ${isNotation ? 'notation' : 'lyrics'} ${hasError ? 'error' : ''}`}
                  >
                    {line || '\u00A0'}
                  </div>
                );
              })}
              
              {errors.length > 0 && (
                <div className="errors-container">
                  <div className="errors-title">⚠ Transposition Issues</div>
                  {errors.map((error, idx) => (
                    <div key={idx} className="error-item">
                      Line {error.lineNumber}: "{error.originalToken}" → {error.reason}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              Transposed notation will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
