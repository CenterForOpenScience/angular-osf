import { FilesMapper } from '@osf/shared/mappers/files/files.mapper';

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
        guid: null,
        size: 0,
        materialized_path: '/',
        date_modified: '2023-08-01T12:00:00Z',
        extra: {
          hashes: {
            md5: '',
            sha256: '',
          },
          downloads: 0,
        },
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
        info: 'https://api.staging4.osf.io/v2/files/xgrm4:osfstorage/',
        move: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/osfstorage/move/',
        upload: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/osfstorage/',
        delete: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/osfstorage/delete/',
        download: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/osfstorage/download/',
        self: 'https://api.staging4.osf.io/v2/files/xgrm4:osfstorage/',
        html: 'https://osf.io/xgrm4/files/osfstorage/',
        render: 'https://osf.io/xgrm4/files/osfstorage/render',
        new_folder: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/osfstorage/?kind=folder',
        storage_addons: 'https://api.staging4.osf.io/v2/addons/?filter%5Bcategories%5D=storage',
      },
      embeds: {
        target: {
          data: {
            id: 'xgrm4',
            type: 'nodes',
            attributes: {},
            relationships: {
              root: {
                data: {
                  id: 'root-id',
                  type: 'nodes',
                },
              },
            },
          },
        },
      },
    },
    {
      id: '873f91f5-897e-4fde-a7ed-2ac64bdefc13',
      type: 'files',
      attributes: {
        kind: 'folder',
        name: 'googledrive',
        path: '/',
        node: 'xgrm4',
        provider: 'googledrive',
        guid: null,
        size: 0,
        materialized_path: '/',
        date_modified: '2023-08-01T12:00:00Z',
        extra: {
          hashes: {
            md5: '',
            sha256: '',
          },
          downloads: 0,
        },
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
        info: 'https://api.staging4.osf.io/v2/files/873f91f5-897e-4fde-a7ed-2ac64bdefc13/',
        move: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/googledrive/move/',
        upload: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/googledrive/',
        delete: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/googledrive/delete/',
        download: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/googledrive/download/',
        self: 'https://api.staging4.osf.io/v2/files/873f91f5-897e-4fde-a7ed-2ac64bdefc13/',
        html: 'https://osf.io/xgrm4/files/googledrive/',
        render: 'https://osf.io/xgrm4/files/googledrive/render',
        new_folder: 'https://files.us.staging4.osf.io/v1/resources/xgrm4/providers/googledrive/?kind=folder',
        storage_addons: 'https://api.staging4.osf.io/v2/addons/?filter%5Bcategories%5D=storage',
      },
      embeds: {
        target: {
          data: {
            id: 'xgrm4',
            type: 'nodes',
            attributes: {},
            relationships: {
              root: {
                data: {
                  id: 'root-id',
                  type: 'nodes',
                },
              },
            },
          },
        },
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
      return [structuredClone(FilesMapper.getFiles(NodeFiles.data as any)[index])];
    } else {
      return structuredClone(FilesMapper.getFiles(NodeFiles.data as any)[index]);
    }
  } else {
    return structuredClone(FilesMapper.getFiles(NodeFiles.data as any));
  }
}
