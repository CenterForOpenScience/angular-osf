export type FolderType = 'file' | 'folder';

export type FileType = 'pdf' | 'doc';

export interface FileItem {
  id?: number;
  name: string;
  type: FolderType;
  downloadType?: FileType;
  downloads?: number;
  size?: string;
  modifiedAt?: Date;
  children?: FileItem[];
}

export const FILES: FileItem[] = [
  {
    name: 'folder name example',
    type: 'folder',
    children: [
      {
        id: 0,
        name: 'filerandomname.doc',
        type: 'file',
        downloadType: 'doc',
        downloads: 12,
        size: '1.2 MB',
        modifiedAt: new Date('2023-10-01T12:00:00'),
      },
      {
        id: 1,
        name: 'filerandomname.pdf',
        type: 'file',
        downloadType: 'pdf',
        downloads: 12,
        size: '1.2 MB',
        modifiedAt: new Date('2023-10-01T12:00:00'),
      },
    ],
  },
  {
    id: 3,
    name: 'filerandomname.doc',
    type: 'file',
    downloadType: 'doc',
    downloads: 12,
    size: '1.2 MB',
    modifiedAt: new Date('2023-10-01T12:00:00'),
  },
];
