import { DiscoverableFilter, Resource } from '@osf/shared/models';

export interface ResourcesData {
  resources: Resource[];
  filters: DiscoverableFilter[];
  count: number;
  first: string;
  next: string;
  previous: string;
}
