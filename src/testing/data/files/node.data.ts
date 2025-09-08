import { MapFiles } from '@osf/shared/mappers';

import structuredClone from 'structured-clone';

const NodeFiles = {
  data: [
    {
      id: 'xgrm4:osfstorage',
      type: 'files',
      attributes: {
        kind: 'folder',
        name: 'osfstorage',
        path: '/',
        node: 'xgrm4',
        provider: 'osfstorage',
      },
      relationships: {
        files: {
          links: {
            related: {
              href: 'https://api.staging4.osf.io/v2/nodes/xgrm4/files/osfstorage/',
              meta: {},
            },
          },
        },
        root_folder: {
          links: {
            related: {
              href: 'https://api.staging4.osf.io/v2/files/68a377161b86e776023701bc/',
              meta: {},
            },
          },
          data: {
            id: '68a377161b86e776023701bc',
            type: 'files',
          },
        },
        target: {
          links: {
            related: {
              href: 'https://api.staging4.osf.io/v2/nodes/xgrm4/',
              meta: {
                type: 'nodes',
              },
            },
          },
          data: {
            type: 'nodes',
            id: 'xgrm4',
          },
        },
      },
      links: {
        upload: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/osfstorage/',
        new_folder: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/osfstorage/?kind=folder',
        storage_addons: 'https://api.staging4.osf.io/v2/addons/?filter%5Bcategories%5D=storage',
      },
    },
    {
      id: '873f91f5-897e-4fde-a7ed-2ac64bdefc13',
      type: 'files',
      attributes: {
        kind: 'folder',
        path: '/',
        node: 'xgrm4',
        provider: 'googledrive',
      },
      relationships: {
        files: {
          links: {
            related: {
              href: 'https://api.staging4.osf.io/v2/nodes/xgrm4/files/googledrive/',
              meta: {},
            },
          },
        },
        root_folder: {
          data: null,
        },
        target: {
          links: {
            related: {
              href: 'https://api.staging4.osf.io/v2/nodes/xgrm4/',
              meta: {
                type: 'nodes',
              },
            },
          },
          data: {
            type: 'nodes',
            id: 'xgrm4',
          },
        },
      },
      links: {
        upload: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/googledrive/',
        new_folder: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/googledrive/?kind=folder',
        storage_addons: 'https://api.staging4.osf.io/v2/addons/?filter%5Bcategories%5D=storage',
      },
    },
  ],
  meta: {
    total: 2,
    per_page: 10,
    version: '2.20',
  },
  links: {
    self: 'https://api.staging4.osf.io/v2/nodes/xgrm4/files/',
    first: null,
    last: null,
    prev: null,
    next: null,
  },
};

export function getNodeFilesData(index?: number, asArray?: boolean) {
  if (index || index === 0) {
    if (asArray) {
      return [structuredClone(NodeFiles.data[index])];
    } else {
      return structuredClone(NodeFiles.data[index]);
    }
  } else {
    return structuredClone(NodeFiles);
  }
}

export function getNodeFilesMappedData(index?: number, asArray?: boolean) {
  if (index || index === 0) {
    if (asArray) {
      return [structuredClone(MapFiles(NodeFiles.data as any)[index])];
    } else {
      return structuredClone(MapFiles(NodeFiles.data as any)[index]);
    }
  } else {
    return structuredClone(MapFiles(NodeFiles.data as any));
  }
}
