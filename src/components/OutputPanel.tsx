import { useRef } from 'react';
import { type TransposedLine } from '../core';
import { CopyButton } from './CopyButton';
import { reconstructLines } from './reconstruct';

interface OutputPanelProps {
  transposedLines: TransposedLine[];
  errors: Array<{ lineNumber: number; originalToken: string; reason: string }>;
  centered?: boolean;
}

export function OutputPanel({ transposedLines, errors, centered = false }: OutputPanelProps) {
  // Build a map of line numbers with errors
  const errorLineNumbers = new Set(errors.map(e => e.lineNumber));
  
  // Reconstruct lines as JSX
  const reconstructedLines = reconstructLines(transposedLines);

  const outputRef = useRef(null);

  
  return (
    <div className="panel">
      <div className="panel-header">
        <span>Transposed Output</span>
        {errors.length > 0 && (
          <span style={{ color: 'var(--red-dim)', fontSize: '0.8rem' }}>
            ⚠ {errors.length} issue{errors.length > 1 ? 's' : ''}
          </span>
        )}
        <CopyButton targetRef={outputRef} />
      </div>
      <div className="panel-content" ref={outputRef}>
        <div className={`output-display ${centered ? 'centered' : ''}`}>
          {transposedLines.length > 0 ? (
            <>
              {reconstructedLines.map((lineContent, idx) => {
                const lineNum = idx + 1;
                const isNotation = transposedLines[idx]?.type === 'notation';
                const hasError = errorLineNumbers.has(lineNum);
                
                return (
                  <div
                    key={idx}
                    className={`output-line ${isNotation ? 'notation' : 'lyrics'} ${hasError ? 'error' : ''}`}
                  >
                    {lineContent}
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
