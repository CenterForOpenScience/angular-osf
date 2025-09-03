import { ResourceType } from '@osf/shared/enums';

export interface ResourceInfoModel {
  id: string;
  title: string;
  type: ResourceType;
}
