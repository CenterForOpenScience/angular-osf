import { ResourceType } from '@osf/shared/enums/resource-type.enum';

export interface FileInfoItem {
  titleKey: string;
  descriptionKey: string;
  showForResourceTypes: ResourceType[];
}
