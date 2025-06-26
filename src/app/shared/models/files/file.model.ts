import { OsfFileTarget } from '@osf/features/project/files/models';
import { FileLinks } from '@shared/models';

export interface OsfFile {
  id: string;
  guid: string;
  name: string;
  kind: string;
  path: string;
  size: number;
  provider: string;
  materializedPath: string;
  lastTouched: null;
  dateModified: string;
  dateCreated: string;
  extra: {
    hashes: {
      md5: string;
      sha256: string;
    };
    downloads: number;
  };
  tags: [];
  currentUserCanComment: boolean;
  currentVersion: number;
  showAsUnviewed: boolean;
  links: FileLinks;
  relationships: {
    parentFolderLink: string;
    parentFolderId: string;
    filesLink: string;
  };
  target: OsfFileTarget;
  previousFolder: boolean;
}
