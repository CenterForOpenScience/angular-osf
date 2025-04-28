import { Resource } from '@osf/features/search/models/resource.entity';

export interface ResourcesData {
  resources: Resource[];
  count: number;
  first: string;
  next: string;
  previous: string;
}
