import { FileKind } from '@osf/shared/enums';

export interface FileFolderModel {
  id: string;
  kind: FileKind.Folder;
  name: string;
  node: string;
  path: string;
  provider: string;
  links: FileFolderLinks;
}

export interface FileFolderLinks {
  newFolder: string;
  storageAddons: string;
  upload: string;
  filesLink: string;
  download: string;
}
