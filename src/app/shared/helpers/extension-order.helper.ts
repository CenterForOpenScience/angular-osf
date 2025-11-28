export interface PositionedItem<T> {
  item: T;
  position?: 'start' | 'end' | number;
}

/**
 * Insert extension-provided items into a base list respecting their desired position.
 */
export function insertByPosition<T>(baseItems: T[], additions: PositionedItem<T>[]): T[] {
  return additions.reduce(
    (acc, addition) => {
      const { item, position } = addition;
      if (position === 'start') {
        return [item, ...acc];
      }

      if (typeof position === 'number') {
        const index = clampIndex(position, acc.length);
        return [...acc.slice(0, index), item, ...acc.slice(index)];
      }

      // Default to appending at the end ('end' or undefined)
      return [...acc, item];
    },
    [...baseItems]
  );
}

function clampIndex(position: number, length: number): number {
  if (position < 0) return 0;
  if (position > length) return length;
  return position;
}
