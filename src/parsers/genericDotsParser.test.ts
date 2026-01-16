import { describe, it, expect } from 'vitest';
import { genericDotsParser } from './genericDotsParser';
import { Note } from '../core/types';

describe('genericDotsParser.canParse', () => {
  it('should return true for text with notation', () => {
    expect(genericDotsParser.canParse('S..G..M..P..')).toBe(true);
  });

  it('should return true for mixed lyrics and notation', () => {
    const text = `Hello world
S..G..M..`;
    expect(genericDotsParser.canParse(text)).toBe(true);
  });

  it('should return false for pure lyrics without note-like chars', () => {
    // Use text without characters that look like notes (S, R, G, M, P, D, N, etc)
    expect(genericDotsParser.canParse('Hello, this is a test')).toBe(false);
  });
});

describe('genericDotsParser.parse', () => {
  it('should identify lyrics lines', () => {
    // Use text that won't be confused with notation
    const result = genericDotsParser.parse('Ye li hai meri aankhon');
    expect(result[0].type).toBe('lyrics');
    expect(result[0].original).toBe('Ye li hai meri aankhon');
    expect(result[0].lineNumber).toBe(1);
  });

  it('should identify notation lines and extract tokens', () => {
    const result = genericDotsParser.parse('S..G..P..');
    expect(result[0].type).toBe('notation');
    if (result[0].type === 'notation') {
      expect(result[0].tokens.length).toBe(3);
      expect(result[0].tokens[0].standardized.note).toBe(Note.Sa);
      expect(result[0].tokens[1].standardized.note).toBe(Note.Ga);
      expect(result[0].tokens[2].standardized.note).toBe(Note.Pa);
    }
  });

  it('should handle Tivra Ma (M) vs Shudh Ma (m)', () => {
    // Note: lowercase 'm' surrounded by dots needs to be extracted properly
    const result = genericDotsParser.parse('S..m..M..S..');
    expect(result[0].type).toBe('notation');
    if (result[0].type === 'notation') {
      expect(result[0].tokens[0].standardized.note).toBe(Note.Sa);
      expect(result[0].tokens[1].standardized.note).toBe(Note.Ma);      // m = Shudh
      expect(result[0].tokens[2].standardized.note).toBe(Note.Ma_Tivra); // M = Tivra
      expect(result[0].tokens[3].standardized.note).toBe(Note.Sa);
    }
  });

  it('should handle low octave notes (p, d, n)', () => {
    const result = genericDotsParser.parse('p..d..n..');
    expect(result[0].type).toBe('notation');
    if (result[0].type === 'notation') {
      expect(result[0].tokens[0].standardized).toEqual({ note: Note.Pa, octave: -1 });
      expect(result[0].tokens[1].standardized).toEqual({ note: Note.Dha, octave: -1 });
      expect(result[0].tokens[2].standardized).toEqual({ note: Note.Ni, octave: -1 });
    }
  });

  it('should handle upper octave notes with apostrophe', () => {
    const result = genericDotsParser.parse("S'..R'..G'..");
    expect(result[0].type).toBe('notation');
    if (result[0].type === 'notation') {
      expect(result[0].tokens[0].standardized).toEqual({ note: Note.Sa, octave: 1 });
      expect(result[0].tokens[1].standardized).toEqual({ note: Note.Re, octave: 1 });
      expect(result[0].tokens[2].standardized).toEqual({ note: Note.Ga, octave: 1 });
    }
  });

  it('should handle komal notes with (k) suffix', () => {
    const result = genericDotsParser.parse('R(k)..G(k)..D(k)..N(k)..');
    expect(result[0].type).toBe('notation');
    if (result[0].type === 'notation') {
      expect(result[0].tokens[0].standardized.note).toBe(Note.Re_Komal);
      expect(result[0].tokens[1].standardized.note).toBe(Note.Ga_Komal);
      expect(result[0].tokens[2].standardized.note).toBe(Note.Dha_Komal);
      expect(result[0].tokens[3].standardized.note).toBe(Note.Ni_Komal);
    }
  });

  it('should preserve line numbers across multiple lines', () => {
    const text = `Lyrics line
S..G..
More lyrics
P..D..`;
    const result = genericDotsParser.parse(text);
    expect(result[0].lineNumber).toBe(1);
    expect(result[1].lineNumber).toBe(2);
    expect(result[2].lineNumber).toBe(3);
    expect(result[3].lineNumber).toBe(4);
  });

  it('should track line numbers in tokens', () => {
    const text = `Lyrics
S..G..M..`;
    const result = genericDotsParser.parse(text);
    if (result[1].type === 'notation') {
      expect(result[1].tokens[0].lineNumber).toBe(2);
      expect(result[1].tokens[1].lineNumber).toBe(2);
    }
  });
});

describe('genericDotsParser.reconstruct', () => {
  it('should reconstruct with transposed notes', () => {
    const parsed = genericDotsParser.parse('S..G..P..');
    // Transposed notes: R, Ma, Dha (each up by 2)
    const transposed = [
      { note: Note.Re, octave: 0 as const },
      { note: Note.Ma, octave: 0 as const },
      { note: Note.Dha, octave: 0 as const },
    ];
    const result = genericDotsParser.reconstruct(parsed, transposed);
    expect(result).toBe('R m D');
  });

  it('should preserve lyrics lines', () => {
    const text = `Hello
S..G..`;
    const parsed = genericDotsParser.parse(text);
    const transposed = [
      { note: Note.Re, octave: 0 as const },
      { note: Note.Ma, octave: 0 as const },
    ];
    const result = genericDotsParser.reconstruct(parsed, transposed);
    expect(result).toContain('Hello');
  });

  it('should output upper octave with apostrophe', () => {
    const parsed = genericDotsParser.parse('S..');
    const transposed = [{ note: Note.Sa, octave: 1 as const }];
    const result = genericDotsParser.reconstruct(parsed, transposed);
    expect(result).toBe("S'");
  });

  it('should output low octave with lowercase', () => {
    const parsed = genericDotsParser.parse('S..');
    const transposed = [{ note: Note.Pa, octave: -1 as const }];
    const result = genericDotsParser.reconstruct(parsed, transposed);
    expect(result).toBe('p');
  });
});
