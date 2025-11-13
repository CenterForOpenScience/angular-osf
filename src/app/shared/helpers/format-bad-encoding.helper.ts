export function replaceBadEncodedChars(text: string) {
  return text.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
}
