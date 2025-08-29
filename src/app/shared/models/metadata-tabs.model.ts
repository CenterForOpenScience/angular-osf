import { MetadataResourceEnum } from '../enums';

export interface MetadataTabsModel {
  id: string | 'osf';
  label: string;
  type: MetadataResourceEnum;
}
