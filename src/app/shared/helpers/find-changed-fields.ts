/**
 * Compares a partial form model with a full object and returns only the fields that have changed.
 * Useful for detecting which fields in a form differ from the original object state.
 *
 * Uses `JSON.stringify` for deep equality comparison and handles basic types, arrays, and objects.
 * Note: Differences in date formatting or time zones (e.g., missing 'Z' in ISO strings) may cause false positives.
 *
 * @param formModel - A partial object representing the edited form values.
 * @param currentObject - The original full object to compare against.
 * @returns A partial object containing only the fields from `formModel` that differ from `currentObject`.
 */
export function findChangedFields<T extends object>(formModel: Partial<T>, currentObject: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key of Object.keys(formModel) as (keyof T)[]) {
    const formVal = formModel[key];
    const currentVal = currentObject[key];

    const isEqual = JSON.stringify(formVal) === JSON.stringify(currentVal);

    if (!isEqual) {
      result[key] = formVal;
    }
  }

  return result;
}
