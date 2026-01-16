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
  const newOctave = Math.floor(totalPosition / NOTES_IN_OCTAVE) as Octave;
  const newNote = ((totalPosition % NOTES_IN_OCTAVE) + NOTES_IN_OCTAVE) % NOTES_IN_OCTAVE;
  console.log(`total: ${totalPosition} newOctave: ${newOctave} newNote: ${newNote}`);

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
