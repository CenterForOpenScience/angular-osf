import { Resource } from '@shared/entities/resource-card/resource.entity';

export interface ResourcesData {
  resources: Resource[];
  count: number;
  first: string;
  next: string;
  previous: string;
}
