import { MetadataProjectsEnum } from '../enums';

export interface MetadataTabsModel {
  id: string;
  label: string;
  type: MetadataProjectsEnum;
}
