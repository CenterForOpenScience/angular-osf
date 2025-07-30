import { MetadataProjectsEnum } from '@shared/enums';

export interface MetadataTabsModel {
  id: string;
  label: string;
  type: MetadataProjectsEnum;
}
