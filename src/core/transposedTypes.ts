import { type StandardizedNote, type ValidationError } from './types';

/**
 * A transposed token containing the original and transposed note,
 * plus any validation error.
 */
export interface TransposedToken {
  lineNumber: number;
  original: string;
  originalNote: StandardizedNote;
  transposedNote: StandardizedNote;
  error: ValidationError | null;
}

/**
 * A transposed notation line containing all transposed tokens.
 */
export interface TransposedNotationLine {
  type: 'notation';
  lineNumber: number;
  original: string;
  tokens: TransposedToken[];
}

/**
 * Lyrics line (unchanged during transposition)
 */
export interface TransposedLyricsLine {
  type: 'lyrics';
  lineNumber: number;
  original: string;
}

/**
 * Union type for transposed lines
 */
export type TransposedLine = TransposedNotationLine | TransposedLyricsLine;
