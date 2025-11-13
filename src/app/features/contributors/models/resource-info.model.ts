import { ResourceType } from '@osf/shared/enums/resource-type.enum';

export interface ResourceInfoModel {
  id: string;
  title: string;
  type: ResourceType;
  rootParentId?: string;
}
