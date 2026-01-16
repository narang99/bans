import { Note, type Octave, type StandardizedNote } from './types';

const NOTES_IN_OCTAVE = 12;

/**
 * Transpose a single note by the given number of semitones.
 * Handles octave wrapping automatically.
 */
export function transposeNote(
  note: StandardizedNote,
  semitones: number
 ): StandardizedNote {
  // Calculate total position (octave * 12 + note value)
  const totalPosition = note.octave * NOTES_IN_OCTAVE + note.note + semitones;

  // Calculate new octave and note
  let newOctave = Math.floor(totalPosition / NOTES_IN_OCTAVE) as Octave;
  const newNote = ((totalPosition % NOTES_IN_OCTAVE) + NOTES_IN_OCTAVE) % NOTES_IN_OCTAVE;

  // Clamp octave to valid range (0, 1, 2)
  if (newOctave < 0) {
    newOctave = 0 as Octave;
  } else if (newOctave > 2) {
    newOctave = 2 as Octave;
  }

  return {
    note: newNote as Note,
    octave: newOctave,
  };
}

/**
 * Transpose an array of notes by the given number of semitones.
 */
export function transposeNotes(
  notes: StandardizedNote[],
  semitones: number
): StandardizedNote[] {
  return notes.map((n) => transposeNote(n, semitones));
}
