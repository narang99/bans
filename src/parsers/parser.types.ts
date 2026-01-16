import { type StandardizedNote } from '../core/types';

/**
 * Parser interface for different notation formats.
 * Each parser handles a specific website or notation style.
 */
export interface Parser {
  name: string;
  canParse(text: string): boolean;
  parse(text: string): ParsedLine[];
}

// Discriminated union for ParsedLine
export type ParsedLine = LyricsLine | NotationLine;

export interface LyricsLine {
  type: 'lyrics';
  lineNumber: number;
  original: string;
}

export interface NotationLine {
  type: 'notation';
  lineNumber: number;
  original: string;
  tokens: ParsedToken[];
}

export interface ParsedToken {
  lineNumber: number;
  original: string;        // e.g., "M.."
  standardized: StandardizedNote;
  startIndex: number;      // Position in original line for reconstruction
  endIndex: number;
}
