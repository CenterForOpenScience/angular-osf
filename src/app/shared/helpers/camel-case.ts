export function toCamelCase(input: string): string {
  if (!input) return '';

  return input
    .split('_')
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}
