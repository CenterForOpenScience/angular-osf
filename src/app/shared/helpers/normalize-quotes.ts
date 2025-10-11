export function normalizeQuotes(text: string) {
  return text.replace(/[\u201C\u201D]/g, '"');
}
