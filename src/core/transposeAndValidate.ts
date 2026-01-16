import { type ParsedLine, type NotationLine } from '../parsers';
import { transposeNote } from './transpose';
import { validateNote } from './validate';
import { type TransposedLine, type TransposedToken } from './transposedTypes';

/**
 * Transpose and validate parsed lines in one pass.
 * This maintains the line structure and attaches errors directly to tokens.
 */
export function transposeAndValidate(
  parsedLines: ParsedLine[],
  semitones: number
): TransposedLine[] {
  return parsedLines.map((line) => {
    if (line.type === 'lyrics') {
      // Lyrics lines pass through unchanged
      return {
        type: 'lyrics',
        lineNumber: line.lineNumber,
        original: line.original,
      };
    }

    // Notation line - transpose and validate each token
    const notationLine = line as NotationLine;
    const transposedTokens: TransposedToken[] = notationLine.tokens.map((token) => {
      const transposedNote = transposeNote(token.standardized, semitones);
      const error = validateNote(transposedNote, token.lineNumber, token.original);

      return {
        lineNumber: token.lineNumber,
        original: token.original,
        originalNote: token.standardized,
        transposedNote,
        error,
      };
    });

    return {
      type: 'notation',
      lineNumber: notationLine.lineNumber,
      original: notationLine.original,
      tokens: transposedTokens,
    };
  });
}

/**
 * Extract all validation errors from transposed lines.
 */
export function extractErrors(transposedLines: TransposedLine[]): Array<{
  lineNumber: number;
  originalToken: string;
  reason: string;
}> {
  const errors: Array<{ lineNumber: number; originalToken: string; reason: string }> = [];

  for (const line of transposedLines) {
    if (line.type === 'notation') {
      for (const token of line.tokens) {
        if (token.error) {
          errors.push({
            lineNumber: token.error.lineNumber,
            originalToken: token.error.originalToken,
            reason: token.error.reason,
          });
        }
      }
    }
  }

  return errors;
}
