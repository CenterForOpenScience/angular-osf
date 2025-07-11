export function convertToSnakeCase(obj: Record<string, string>): Record<string, string> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const snakeCaseKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      acc[snakeCaseKey] = value;
      return acc;
    },
    {} as Record<string, string>
  );
}
