import { useState, useMemo } from 'react';
import { InputPanel, OutputPanel, TransposeControls } from './components';
import { genericDotsParser } from './parsers';
import { transposeAndValidate, extractErrors, type TransposedLine } from './core';
import './index.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [transposeAmount, setTransposeAmount] = useState(0);

  // Process the input text through the parser and transposer
  const { transposedLines, errors } = useMemo(() => {
    if (!inputText.trim()) {
      return { 
        transposedLines: [] as TransposedLine[],
        errors: [] as Array<{ lineNumber: number; originalToken: string; reason: string }>,
      };
    }

    // Parse the input
    const parsed = genericDotsParser.parse(inputText);

    // Transpose and validate in one pass (maintains line structure)
    const transposed = transposeAndValidate(parsed, transposeAmount);

    // Extract errors from transposed tokens
    const validationErrors = extractErrors(transposed);

    return {
      transposedLines: transposed,
      errors: validationErrors,
    };
  }, [inputText, transposeAmount]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🪈 Sargam Transposer</h1>
        <p className="app-subtitle">Transpose bansuri notation up or down by semitones</p>
      </header>

      <TransposeControls value={transposeAmount} onChange={setTransposeAmount} />

      <div className="split-container">
        <InputPanel value={inputText} onChange={setInputText} />
        <OutputPanel transposedLines={transposedLines} errors={errors} />
      </div>
    </div>
  );
}

export default App;
