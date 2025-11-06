import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileFolderModel } from '@shared/models/files/file-folder.model';

export const OSF_FILE_MOCK: FileFolderModel = {
  id: 'file-123',
  kind: FileKind.Folder,
  name: 'example.pdf',
  node: 'node-456',
  path: '/example.pdf',
  provider: 'osfstorage',
  links: {
    newFolder: '/v2/files/file-123/newfolder/',
    storageAddons: 'https://api.staging4.osf.io/v2/addons/?filter%5Bcategories%5D=storage',
    upload: '/v2/files/file-123/upload/',
    filesLink: '/v2/nodes/node-456/files/',
    download: '/v2/files/file-123/download/',
  },
};
