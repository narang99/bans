import { Note, type Octave, type StandardizedNote, type ValidationError, NOTE_NAMES } from './types';

/**
 * Bansuri range configuration.
 * Define which notes are allowed in each octave.
 * This is NOT baked into the logic - modify this object to change allowed ranges.
 */
export const BANSURI_RANGE: Record<Octave, Set<Note>> = {
  // Low octave: only Pa, Dha, Dha_Komal, Ni, Ni_Komal
  [0]: new Set([Note.Pa, Note.Dha, Note.Dha_Komal, Note.Ni, Note.Ni_Komal]),
  
  // Middle octave: all notes allowed
  [1]: new Set([
    Note.Sa, Note.Re_Komal, Note.Re, Note.Ga_Komal, Note.Ga,
    Note.Ma, Note.Ma_Tivra, Note.Pa, Note.Dha_Komal, Note.Dha,
    Note.Ni_Komal, Note.Ni,
  ]),
  
  // Upper octave: Sa, Re, Ga, Ma, Ma_Tivra, Pa
  [2]: new Set([Note.Sa, Note.Re, Note.Ga, Note.Ma, Note.Ma_Tivra, Note.Pa]),
};

/**
 * Validate a single note against the bansuri range.
 */
export function validateNote(
  note: StandardizedNote,
  lineNumber: number,
  originalToken: string
): ValidationError | null {
  const allowedNotes = BANSURI_RANGE[note.octave];
  
  if (!allowedNotes.has(note.note)) {
    const octaveLabel = note.octave === 0 ? 'low' : note.octave === 2 ? 'upper' : 'middle';
    return {
      lineNumber,
      originalToken,
      transposedNote: note,
      reason: `Note ${NOTE_NAMES[note.note]} not available in ${octaveLabel} octave on bansuri`,
    };
  }
  
  return null;
}

/**
 * Validate an array of notes with their line numbers and original tokens.
 * Returns an array of validation errors (empty if all valid).
 */
export function validateNotes(
  notes: StandardizedNote[],
  lineNumbers: number[],
  originalTokens: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (let i = 0; i < notes.length; i++) {
    const error = validateNote(notes[i], lineNumbers[i], originalTokens[i]);
    if (error) {
      errors.push(error);
    }
  }
  
  return errors;
}
