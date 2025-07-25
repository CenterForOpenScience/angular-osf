import { RegistryAction } from './registry-action.model';

export interface RegistryModeration {
  id: string;
  title: string;
  reviewsState: string;
  public: boolean;
  embargoed: boolean;
  embargoEndDate?: string;
  actions: RegistryAction[];
}
