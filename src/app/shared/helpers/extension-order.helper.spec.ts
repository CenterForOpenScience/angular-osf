import { insertByPosition } from './extension-order.helper';

describe('insertByPosition', () => {
  it('adds start items before existing entries', () => {
    const base = ['download', 'share'];
    const result = insertByPosition(base, [
      { item: 'edit', position: 'start' },
      { item: 'delete', position: 'end' },
    ]);

    expect(result).toEqual(['edit', 'download', 'share', 'delete']);
  });

  it('inserts by numeric index and clamps within bounds', () => {
    const base = ['download'];
    const result = insertByPosition(base, [
      { item: 'rename', position: 1 },
      { item: 'share', position: 10 },
      { item: 'preview', position: -5 },
    ]);

    expect(result).toEqual(['preview', 'download', 'rename', 'share']);
  });
});
