import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';

export interface FileMenuAction {
  value: FileMenuType;
  data?: FileMenuData;
}

export interface FileMenuData {
  type: string;
}

export type FileMenuFlags = Record<FileMenuType, boolean>;
