import { FileMenuType } from '../enums';

export interface FileMenuAction {
  value: FileMenuType;
  data?: FileMenuData;
}

export interface FileMenuData {
  type: string;
}
