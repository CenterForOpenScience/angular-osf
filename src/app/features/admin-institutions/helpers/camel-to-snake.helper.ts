export function camelToSnakeCase(str: string): string {
  const isSnakeCase = /^[a-z0-9_]+$/.test(str);
  if (isSnakeCase) {
    return str;
  }

  return str.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '');
}
