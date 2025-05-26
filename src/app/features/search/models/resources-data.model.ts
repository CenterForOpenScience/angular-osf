import { Resource } from '@osf/shared/models';

export interface ResourcesData {
  resources: Resource[];
  count: number;
  first: string;
  next: string;
  previous: string;
}
