import { AsyncStateModel, OsfFile } from '@shared/models';

export interface RegistryFilesStateModel {
  files: AsyncStateModel<OsfFile[]>;
  search: string;
  sort: string;
  currentFolder: OsfFile | null;
}
