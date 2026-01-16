import { type TransposedLine, type TransposedToken, Note } from '../core';

/**
 * Reconstruct a single token as JSX with proper formatting:
 * - Underline for low octave
 * - Overline for upper octave
 * - Subscript K for komal notes
 */
export function reconstructToken(token: TransposedToken): React.JSX.Element {
  const { note, octave } = token.transposedNote;
  
  // Determine base note name
  let baseName = '';
  let isKomal = false;
  
  switch (note) {
    case Note.Sa:
      baseName = 'S';
      break;
    case Note.Re_Komal:
      baseName = 'R';
      isKomal = true;
      break;
    case Note.Re:
      baseName = 'R';
      break;
    case Note.Ga_Komal:
      baseName = 'G';
      isKomal = true;
      break;
    case Note.Ga:
      baseName = 'G';
      break;
    case Note.Ma:
      baseName = 'M';
      break;
    case Note.Ma_Tivra:
      baseName = 'M#';
      break;
    case Note.Pa:
      baseName = 'P';
      break;
    case Note.Dha_Komal:
      baseName = 'D';
      isKomal = true;
      break;
    case Note.Dha:
      baseName = 'D';
      break;
    case Note.Ni_Komal:
      baseName = 'N';
      isKomal = true;
      break;
    case Note.Ni:
      baseName = 'N';
      break;
    default:
      baseName = '?';
  }
  
  // Build the JSX element with appropriate styling
  let content: React.JSX.Element;
  
  if (octave === 0) {
    // Low octave - underline
    content = (
      <span style={{ textDecoration: 'underline' }}>
        {baseName}
        {isKomal && <sub style={{ fontSize: '0.7em' }}>K</sub>}
      </span>
    );
  } else if (octave === 2) {
    // Upper octave - overline
    content = (
      <span style={{ textDecoration: 'overline' }}>
        {baseName}
        {isKomal && <sub style={{ fontSize: '0.7em' }}>K</sub>}
      </span>
    );
  } else {
    // Middle octave - no decoration
    content = (
      <span>
        {baseName}
        {isKomal && <sub style={{ fontSize: '0.7em' }}>K</sub>}
      </span>
    );
  }
  
  return content;
}

/**
 * Reconstruct a notation line as JSX with space-separated tokens
 */
export function reconstructNotationLine(tokens: TransposedToken[]): React.JSX.Element {
  return (
    <>
      {tokens.map((token, idx) => (
        <span key={idx}>
          {idx > 0 && ' '}
          {reconstructToken(token)}
        </span>
      ))}
    </>
  );
}

/**
 * Reconstruct all transposed lines as JSX elements
 */
export function reconstructLines(transposedLines: TransposedLine[]): React.JSX.Element[] {
  return transposedLines.map((line, idx) => {
    if (line.type === 'lyrics') {
      return <span key={idx}>{line.original}</span>;
    } else {
      return <span key={idx}>{reconstructNotationLine(line.tokens)}</span>;
    }
  });
}
