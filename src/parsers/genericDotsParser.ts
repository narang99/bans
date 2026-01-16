import { Note, type Octave, type StandardizedNote, NOTE_NAMES } from '../core/types';
import { type Parser, type ParsedLine, type ParsedToken, type NotationLine } from './parser.types';

// ============================================================
// TOKEN MAPPING - EDIT THESE TO CHANGE HOW NOTES ARE RECOGNIZED
// ============================================================

interface NoteMapping {
  note: Note;
  octave: Octave;
}

/**
 * Maps input tokens to standardized notes.
 * Format from user specification:
 * - Lowercase p/d/n = low octave
 * - m = Shudh Ma, M = Tivra Ma
 * - (k) suffix = komal notes
 * - ' suffix = upper octave
 */
const NOTE_MAPPING: Record<string, NoteMapping> = {
  // LOW OCTAVE (lowercase p, d, n)
  'p': { note: Note.Pa, octave: -1 },
  'd': { note: Note.Dha, octave: -1 },
  'n': { note: Note.Ni, octave: -1 },
  
  // MIDDLE OCTAVE - Shudh (natural) notes
  'S': { note: Note.Sa, octave: 0 },
  'R': { note: Note.Re, octave: 0 },
  'G': { note: Note.Ga, octave: 0 },
  'm': { note: Note.Ma, octave: 0 },        // Shudh Ma
  'M': { note: Note.Ma_Tivra, octave: 0 },  // Tivra Ma
  'P': { note: Note.Pa, octave: 0 },
  'D': { note: Note.Dha, octave: 0 },
  'N': { note: Note.Ni, octave: 0 },
  
  // KOMAL notes - (k) suffix
  'D(k)': { note: Note.Dha_Komal, octave: 0 },
  'N(k)': { note: Note.Ni_Komal, octave: 0 },
  'R(k)': { note: Note.Re_Komal, octave: 0 },
  'G(k)': { note: Note.Ga_Komal, octave: 0 },
  
  // UPPER OCTAVE - ' suffix
  "S'": { note: Note.Sa, octave: 1 },
  "R'": { note: Note.Re, octave: 1 },
  "G'": { note: Note.Ga, octave: 1 },
  "m'": { note: Note.Ma, octave: 1 },
  "M'": { note: Note.Ma_Tivra, octave: 1 },
  "P'": { note: Note.Pa, octave: 1 },
};

// ============================================================
// REVERSE MAPPING - FOR RECONSTRUCTION
// ============================================================

/**
 * Maps standardized notes back to output tokens.
 * Edit this to change output format.
 */
function noteToToken(note: StandardizedNote): string {
  const { note: n, octave: o } = note;
  
  // Low octave
  if (o === -1) {
    switch (n) {
      case Note.Pa: return 'p';
      case Note.Dha: return 'd';
      case Note.Dha_Komal: return 'd(k)'; // Extended for komal
      case Note.Ni: return 'n';
      case Note.Ni_Komal: return 'n(k)';
      default: return `[${NOTE_NAMES[n]}↓]`; // Fallback for invalid
    }
  }
  
  // Upper octave
  if (o === 1) {
    switch (n) {
      case Note.Sa: return "S'";
      case Note.Re: return "R'";
      case Note.Ga: return "G'";
      case Note.Ma: return "m'";
      case Note.Ma_Tivra: return "M'";
      case Note.Pa: return "P'";
      default: return `[${NOTE_NAMES[n]}↑]`; // Fallback for invalid
    }
  }
  
  // Middle octave
  switch (n) {
    case Note.Sa: return 'S';
    case Note.Re_Komal: return 'R(k)';
    case Note.Re: return 'R';
    case Note.Ga_Komal: return 'G(k)';
    case Note.Ga: return 'G';
    case Note.Ma: return 'm';
    case Note.Ma_Tivra: return 'M';
    case Note.Pa: return 'P';
    case Note.Dha_Komal: return 'D(k)';
    case Note.Dha: return 'D';
    case Note.Ni_Komal: return 'N(k)';
    case Note.Ni: return 'N';
    default: return `[?]`;
  }
}

// ============================================================
// PARSER LOGIC
// ============================================================

// Regex to detect notation lines (contains note letters with dots/spaces)
// const NOTE_CHARS_PATTERN = /[SRGMPDNsrgmpdnS'R'G'M'P']/;
// const DOTS_PATTERN = /\.{2,}/g;

/**
 * Check if a line looks like notation.
 * Requires characteristic patterns:
 * - Dots pattern like "S..G..M.." or "S...G..."
 * - Or space-separated notes with uppercase like "S G M P"
 */
function isNotationLine(line: string): boolean {
  // Check for dots pattern (2+ consecutive dots) - very characteristic of notation
  const hasDotsPattern = /\.{2,}/.test(line);
  
  if (hasDotsPattern) {
    // If has dots, check for note characters near dots
    const hasNotesWithDots = /[SRGMPDNpdn]\.{2,}|\.{2,}[SRGMPDNpdn]/i.test(line);
    return hasNotesWithDots;
  }
  
  // Check for space-separated uppercase notes (e.g., "S G M P" or "S' R' G'")
  // Must have at least 2 note tokens separated by spaces
  const spacePattern = /\b[SRGMPDN](['(k)]*)?\s+[SRGMPDN](['(k)]*)?/;
  if (spacePattern.test(line)) {
    return true;
  }
  
  return false;
}

/**
 * Extract tokens from a notation line.
 * Handles formats like "S..G..M.." or "S G M" or "S' R' G'"
 */
function extractTokens(line: string, lineNumber: number): ParsedToken[] {
  const tokens: ParsedToken[] = [];
  
  // Normalize: replace multiple dots with single space
  const normalized = line.replace(/\.+/g, ' ').replace(/\s+/g, ' ');
  
  // Match tokens including komal (k) suffix and upper octave ' suffix
  // Order matters: longer patterns first
  // Note: includes lowercase 'm' for Shudh Ma, uppercase 'M' for Tivra Ma
  const tokenPattern = /([SRGDN]\(k\)|[SRGMPmDN]'|[SRGMPDNpdnm])/g;
  
  let match;
  while ((match = tokenPattern.exec(normalized)) !== null) {
    const tokenStr = match[0];
    const mapping = NOTE_MAPPING[tokenStr];
    
    if (mapping) {
      tokens.push({
        lineNumber,
        original: tokenStr,
        standardized: { note: mapping.note, octave: mapping.octave },
        startIndex: match.index,
        endIndex: match.index + tokenStr.length,
      });
    }
  }
  
  return tokens;
}

/**
 * Generic Dots Parser
 * Handles notation like "S..G..m..D..P.." from typical bansuri websites
 */
export const genericDotsParser: Parser = {
  name: 'Generic Dots Parser',
  
  canParse(text: string): boolean {
    // Check if text contains notation-like patterns
    return text.split('\n').some(line => isNotationLine(line));
  },
  
  parse(text: string): ParsedLine[] {
    const lines = text.split('\n');
    const result: ParsedLine[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1; // 1-indexed
      
      if (isNotationLine(line)) {
        const tokens = extractTokens(line, lineNumber);
        if (tokens.length > 0) {
          result.push({
            type: 'notation',
            lineNumber,
            original: line,
            tokens,
          });
        } else {
          // No valid tokens found, treat as lyrics
          result.push({
            type: 'lyrics',
            lineNumber,
            original: line,
          });
        }
      } else {
        result.push({
          type: 'lyrics',
          lineNumber,
          original: line,
        });
      }
    }
    
    return result;
  },
  
  reconstruct(lines: ParsedLine[], transposedNotes: StandardizedNote[]): string {
    let noteIndex = 0;
    const result: string[] = [];
    
    for (const line of lines) {
      if (line.type === 'lyrics') {
        result.push(line.original);
      } else {
        // Reconstruct notation line with transposed notes
        const notationLine = line as NotationLine;
        const newTokens: string[] = [];
        
        for (const _token of notationLine.tokens) {
          if (noteIndex < transposedNotes.length) {
            newTokens.push(noteToToken(transposedNotes[noteIndex]));
            noteIndex++;
          }
        }
        
        // Join with spaces (normalized format)
        result.push(newTokens.join(' '));
      }
    }
    
    return result.join('\n');
  },
};
