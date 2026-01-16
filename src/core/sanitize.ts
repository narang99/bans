/**
 * Sanitizes input text by:
 * 1. Converting curly quotes (smart quotes) to standard ASCII quotes
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';

  return text
    // Opening and closing curly single quotes (various unicode forms)
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    // Opening and closing curly double quotes (not explicitly asked for, but good practice)
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"');
}
