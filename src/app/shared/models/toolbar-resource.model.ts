import { ResourceType } from '@shared/enums';

export interface ToolbarResource {
  id: string;
  title: string;
  isPublic: boolean;
  storage?: {
    id: string;
    type: string;
    storageLimitStatus: string;
    storageUsage: string;
  };
  viewOnlyLinksCount: number;
  forksCount: number;
  resourceType: ResourceType;
  isAnonymous: boolean;
}
