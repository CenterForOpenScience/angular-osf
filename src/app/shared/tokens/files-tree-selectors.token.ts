import { InjectionToken, Signal } from '@angular/core';

import { OsfFile } from '@shared/models';

export interface FilesTreeSelectors {
  isFilesLoading: () => Signal<boolean>;
  getFiles: () => Signal<OsfFile[]>;
  getCurrentFolder: () => Signal<OsfFile | null>;
}

export const FILES_TREE_SELECTORS = new InjectionToken<FilesTreeSelectors>('FILES_TREE_SELECTORS');
