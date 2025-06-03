/**
 * Compares two arrays of objects and returns the items from `edited` that differ from `original`.
 * Assumes each item has a unique key property.
 *
 * @param original - The original array of items.
 * @param edited - The edited array of items.
 * @param key - The unique key property name to identify items (e.g., 'id').
 * @param compareFn - Optional custom comparison function for item equality.
 * @returns Array of changed or new items from `edited`.
 */
export function findChangedItems<T>(
  original: T[],
  edited: T[],
  key: keyof T,
  compareFn?: (a: T, b: T) => boolean
): T[] {
  const originalMap = new Map<T[keyof T], T>();
  original.forEach((item) => originalMap.set(item[key], item));

  const isEqual = compareFn ?? ((a: T, b: T) => JSON.stringify(a) === JSON.stringify(b));

  return edited.filter((item) => {
    const originalItem = originalMap.get(item[key]);
    if (!originalItem) {
      return true;
    }

    return !isEqual(item, originalItem);
  });
}
