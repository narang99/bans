import { useState, useMemo } from 'react';
import { InputPanel, OutputPanel, TransposeControls } from './components';
import { genericDotsParser, type ParsedLine, type NotationLine } from './parsers';
import { transposeNotes, validateNotes, type ValidationError, type StandardizedNote } from './core';
import './index.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [transposeAmount, setTransposeAmount] = useState(0);

  // Process the input text through the parser and transposer
  const { output, parsedLines, errors } = useMemo(() => {
    if (!inputText.trim()) {
      return { output: '', parsedLines: [] as ParsedLine[], errors: [] as ValidationError[] };
    }

    // Parse the input
    const parsed = genericDotsParser.parse(inputText);

    // Extract all notes with their line numbers and original tokens
    const allNotes: StandardizedNote[] = [];
    const allLineNumbers: number[] = [];
    const allOriginalTokens: string[] = [];

    for (const line of parsed) {
      if (line.type === 'notation') {
        const notationLine = line as NotationLine;
        for (const token of notationLine.tokens) {
          allNotes.push(token.standardized);
          allLineNumbers.push(token.lineNumber);
          allOriginalTokens.push(token.original);
        }
      }
    }

    // Transpose notes
    const transposed = transposeNotes(allNotes, transposeAmount);

    // Validate transposed notes
    const validationErrors = validateNotes(transposed, allLineNumbers, allOriginalTokens);

    // Reconstruct output
    const outputText = genericDotsParser.reconstruct(parsed, transposed);

    return {
      output: outputText,
      parsedLines: parsed,
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
        <OutputPanel output={output} parsedLines={parsedLines} errors={errors} />
      </div>
    </div>
  );
}

export default App;
