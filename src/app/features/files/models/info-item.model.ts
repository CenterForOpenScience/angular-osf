import { ResourceType } from '@osf/shared/enums';

export interface FileInfoItem {
  titleKey: string;
  descriptionKey: string;
  showForResourceTypes: ResourceType[];
}
