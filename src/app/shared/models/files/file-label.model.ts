import { FileFolderModel } from './file-folder.model';

export interface FileLabelModel {
  label: string;
  folder: FileFolderModel;
}
