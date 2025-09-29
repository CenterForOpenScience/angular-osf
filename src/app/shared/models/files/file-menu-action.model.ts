import { FileMenuType } from '@osf/shared/enums';

export interface FileMenuAction {
  value: FileMenuType;
  data?: FileMenuData;
}

export interface FileMenuData {
  type: string;
}

export type FileMenuFlags = Record<FileMenuType, boolean>;
