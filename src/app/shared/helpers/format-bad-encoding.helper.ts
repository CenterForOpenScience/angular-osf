export function replaceBadEncodedChars(text: string) {
  if (!text) return '';
  return text.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
}
