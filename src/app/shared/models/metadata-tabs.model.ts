import { MetadataResourceEnum } from '../enums/metadata-resource.enum';

export interface MetadataTabsModel {
  id: string | 'osf';
  label: string;
  type: MetadataResourceEnum;
}
