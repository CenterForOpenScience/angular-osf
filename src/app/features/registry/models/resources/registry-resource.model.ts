import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';

export interface RegistryResource {
  id: string;
  description: string;
  finalized: boolean;
  type: RegistryResourceType;
  pid: string;
}
