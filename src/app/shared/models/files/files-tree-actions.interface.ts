import { Observable } from 'rxjs';

import { OsfFile } from '@shared/models';

export interface FilesTreeActions {
  setCurrentFolder: (folder: OsfFile | null) => Observable<void>;
  setFilesIsLoading?: (isLoading: boolean) => void;
  getFiles: (filesLink: string, page?: number) => Observable<void>;
  deleteEntry?: (projectId: string, link: string) => Observable<void>;
  renameEntry?: (projectId: string, link: string, newName: string) => Observable<void>;
  setMoveFileCurrentFolder?: (folder: OsfFile | null) => Observable<void>;
}
