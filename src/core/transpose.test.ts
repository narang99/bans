import { describe, it, expect } from 'vitest';
import { transposeNote, transposeNotes } from './transpose';
import { Note } from './types';

describe('transposeNote', () => {
  it('should transpose up by 1 semitone within same octave', () => {
    const result = transposeNote({ note: Note.Sa, octave: 1 }, 1);
    expect(result).toEqual({ note: Note.Re_Komal, octave: 1 });
  });

  it('should transpose up by 2 semitones (Sa to Re)', () => {
    const result = transposeNote({ note: Note.Sa, octave: 1 }, 2);
    expect(result).toEqual({ note: Note.Re, octave: 1 });
  });

  it('should transpose down by 1 semitone', () => {
    const result = transposeNote({ note: Note.Re, octave: 1 }, -1);
    expect(result).toEqual({ note: Note.Re_Komal, octave: 1 });
  });

  it('should wrap to upper octave when transposing up past Ni', () => {
    const result = transposeNote({ note: Note.Ni, octave: 1 }, 1);
    expect(result).toEqual({ note: Note.Sa, octave: 2 });
  });

  it('should wrap to lower octave when transposing down past Sa', () => {
    const result = transposeNote({ note: Note.Sa, octave: 1 }, -1);
    expect(result).toEqual({ note: Note.Ni, octave: 0 });
  });

  it('should handle multiple octave jumps and clamp to max octave', () => {
    // From middle octave Sa, up 24 semitones (2 octaves) - should clamp to octave 2
    const result = transposeNote({ note: Note.Sa, octave: 1 }, 24);
    expect(result.octave).toBe(2);
  });

  it('should handle multiple octave jumps and clamp to min octave', () => {
    // From middle octave Sa, down 24 semitones (2 octaves) - should clamp to octave 0
    const result = transposeNote({ note: Note.Sa, octave: 1 }, -24);
    expect(result.octave).toBe(0);
  });

  it('should transpose from low octave to middle', () => {
    const result = transposeNote({ note: Note.Ni, octave: 0 }, 1);
    expect(result).toEqual({ note: Note.Sa, octave: 1 });
  });

  it('should transpose Tivra Ma up by 1', () => {
    const result = transposeNote({ note: Note.Ma_Tivra, octave: 1 }, 1);
    expect(result).toEqual({ note: Note.Pa, octave: 1 });
  });
});

describe('transposeNotes', () => {
  it('should transpose array of notes', () => {
    const notes = [
      { note: Note.Sa, octave: 1 as const },
      { note: Note.Ga, octave: 1 as const },
      { note: Note.Pa, octave: 1 as const },
    ];
    const result = transposeNotes(notes, 2);
    // Sa(0)+2=Re(2), Ga(4)+2=Ma_Tivra(6), Pa(7)+2=Dha(9)
    expect(result).toEqual([
      { note: Note.Re, octave: 1 },
      { note: Note.Ma_Tivra, octave: 1 },
      { note: Note.Dha, octave: 1 },
    ]);
  });

  it('should return empty array for empty input', () => {
    expect(transposeNotes([], 5)).toEqual([]);
  });
});
