import { StorageItem } from '@shared/models';

import { Cite } from '@citation-js/core';

export function formatCitation(item: StorageItem, style: string): string {
  if (!item.csl) {
    return item.itemName || '';
  }

  try {
    const cite = new Cite(item.csl);
    const citation = cite.format('bibliography', {
      format: 'text',
      template: style,
      lang: 'en-US',
    });
    return citation.trim();
  } catch {
    return item.itemName || '';
  }
}

export function getItemUrl(item: StorageItem): string {
  return (item.csl?.['URL'] as string) || '';
}
