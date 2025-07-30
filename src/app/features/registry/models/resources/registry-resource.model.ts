import { RegistryResourceType } from '@shared/enums';

export interface RegistryResource {
  id: string;
  description: string;
  finalized: boolean;
  type: RegistryResourceType;
  pid: string;
}
