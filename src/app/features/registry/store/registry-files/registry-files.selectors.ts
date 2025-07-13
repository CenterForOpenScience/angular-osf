import { Selector } from '@ngxs/store';

import { OsfFile } from '@shared/models';

import { RegistryFilesStateModel } from './registry-files.model';
import { RegistryFilesState } from './registry-files.state';

export class RegistryFilesSelectors {
  @Selector([RegistryFilesState])
  static getFiles(state: RegistryFilesStateModel): OsfFile[] {
    return state.files.data;
  }

  @Selector([RegistryFilesState])
  static isFilesLoading(state: RegistryFilesStateModel): boolean {
    return state.files.isLoading;
  }

  @Selector([RegistryFilesState])
  static getCurrentFolder(state: RegistryFilesStateModel): OsfFile | null {
    return state.currentFolder;
  }
}
