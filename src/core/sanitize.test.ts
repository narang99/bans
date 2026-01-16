import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './sanitize';

describe('sanitizeInput', () => {
  it('should convert single curly quotes to ASCII quotes', () => {
    const input = "S\u2018..G\u2019..m\u201A..P\u201B..";
    const expected = "S'..G'..m'..P'..";
    expect(sanitizeInput(input)).toBe(expected);
  });

  it('should convert double curly quotes to ASCII double quotes', () => {
    const input = "\u201CHello\u201D";
    const expected = '"Hello"';
    expect(sanitizeInput(input)).toBe(expected);
  });

  it('should handle empty input', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('should not change already standard quotes', () => {
    const input = "S'..R'..G'";
    expect(sanitizeInput(input)).toBe(input);
  });
});
