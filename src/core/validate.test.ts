import { describe, it, expect } from 'vitest';
import { validateNote, validateNotes, BANSURI_RANGE } from './validate';
import { Note } from './types';

describe('BANSURI_RANGE', () => {
  it('should have correct notes for low octave', () => {
    expect(BANSURI_RANGE[0].has(Note.Pa)).toBe(true);
    expect(BANSURI_RANGE[0].has(Note.Dha)).toBe(true);
    expect(BANSURI_RANGE[0].has(Note.Ni)).toBe(true);
    expect(BANSURI_RANGE[0].has(Note.Sa)).toBe(false); // Sa not in low octave
  });

  it('should allow all notes in middle octave', () => {
    expect(BANSURI_RANGE[1].size).toBe(12);
  });

  it('should have correct notes for upper octave', () => {
    expect(BANSURI_RANGE[2].has(Note.Sa)).toBe(true);
    expect(BANSURI_RANGE[2].has(Note.Re)).toBe(true);
    expect(BANSURI_RANGE[2].has(Note.Pa)).toBe(true);
    expect(BANSURI_RANGE[2].has(Note.Dha)).toBe(false); // Dha not in upper octave
    expect(BANSURI_RANGE[2].has(Note.Ni)).toBe(false);
  });
});

describe('validateNote', () => {
  it('should return null for valid middle octave note', () => {
    const result = validateNote({ note: Note.Sa, octave: 1 }, 1, 'S');
    expect(result).toBeNull();
  });

  it('should return null for valid low octave note (Pa)', () => {
    const result = validateNote({ note: Note.Pa, octave: 0 }, 1, 'p');
    expect(result).toBeNull();
  });

  it('should return error for invalid low octave note (Sa)', () => {
    const result = validateNote({ note: Note.Sa, octave: 0 }, 1, 'S');
    expect(result).not.toBeNull();
    expect(result?.reason).toContain('farther from the lowest note (p)');
  });

  it('should return error for invalid upper octave note (Dha)', () => {
    const result = validateNote({ note: Note.Dha, octave: 2 }, 5, 'D');
    expect(result).not.toBeNull();
    expect(result?.reason).toContain('farther from the highest note (Pa\')');
    expect(result?.lineNumber).toBe(5);
  });

  it('should return error for octave too high (> 2)', () => {
    const result = validateNote({ note: Note.Sa, octave: 3 }, 1, "S''");
    expect(result).not.toBeNull();
    expect(result?.reason).toContain('farther from the highest note (Pa\')');
  });

  it('should return error for octave too low (< 0)', () => {
    const result = validateNote({ note: Note.Ni, octave: -1 }, 1, 'n_low');
    expect(result).not.toBeNull();
    expect(result?.reason).toContain('farther from the lowest note (p)');
  });

  it('should include original token in error', () => {
    const result = validateNote({ note: Note.Ni, octave: 2 }, 3, "N'");
    expect(result?.originalToken).toBe("N'");
  });
});

describe('validateNotes', () => {
  it('should return empty array for all valid notes', () => {
    const notes = [
      { note: Note.Sa, octave: 1 },
      { note: Note.Pa, octave: 1 },
    ];
    const result = validateNotes(notes, [1, 1], ['S', 'P']);
    expect(result).toEqual([]);
  });

  it('should return errors for invalid notes', () => {
    const notes = [
      { note: Note.Sa, octave: 1 },  // valid
      { note: Note.Dha, octave: 2 }, // invalid - Dha not in upper octave
    ];
    const result = validateNotes(notes, [1, 2], ['S', "D'"]);
    expect(result.length).toBe(1);
    expect(result[0].lineNumber).toBe(2);
    expect(result[0].originalToken).toBe("D'");
  });
});
