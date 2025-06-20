import { Observable } from 'rxjs';

import { OsfFile } from '@shared/models';

export interface FilesTreeActions {
  setCurrentFolder: (folder: OsfFile | null) => Observable<void>;
  setSearch?: (search: string) => Observable<void>;
  setSort?: (sort: string) => Observable<void>;
  setFilesIsLoading?: (isLoading: boolean) => Observable<void>;
  getFiles: (filesLink: string) => Observable<void>;
  getRootFolderFiles: (projectId: string) => Observable<void>;
  deleteEntry?: (projectId: string, link: string) => Observable<void>;
  renameEntry?: (projectId: string, link: string, newName: string) => Observable<void>;
  setMoveFileCurrentFolder?: (folder: OsfFile | null) => Observable<void>;
}
