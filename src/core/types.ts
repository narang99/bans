/**
 * Core types for Sargam notation transposition
 */

// 12 semitones in an octave
export enum Note {
  Sa = 0,
  Re_Komal = 1,
  Re = 2,
  Ga_Komal = 3,
  Ga = 4,
  Ma = 5,
  Ma_Tivra = 6,
  Pa = 7,
  Dha_Komal = 8,
  Dha = 9,
  Ni_Komal = 10,
  Ni = 11,
}

export type Octave = 0 | 1 | 2; // 0=low, 1=middle, 2=upper

export interface StandardizedNote {
  note: Note;
  octave: Octave;
}

// Validation result
export interface ValidationError {
  lineNumber: number;
  originalToken: string;
  transposedNote: StandardizedNote;
  reason: string;
}

// Result of transposition including validation
export interface TransposeResult {
  notes: StandardizedNote[];
  errors: ValidationError[];
}

// Note names for display
export const NOTE_NAMES: Record<Note, string> = {
  [Note.Sa]: 'Sa',
  [Note.Re_Komal]: 'Re(k)',
  [Note.Re]: 'Re',
  [Note.Ga_Komal]: 'Ga(k)',
  [Note.Ga]: 'Ga',
  [Note.Ma]: 'Ma',
  [Note.Ma_Tivra]: 'Ma#',
  [Note.Pa]: 'Pa',
  [Note.Dha_Komal]: 'Dha(k)',
  [Note.Dha]: 'Dha',
  [Note.Ni_Komal]: 'Ni(k)',
  [Note.Ni]: 'Ni',
};
