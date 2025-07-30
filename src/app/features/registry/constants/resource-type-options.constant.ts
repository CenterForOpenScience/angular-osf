import { RegistryResourceType } from '@shared/enums';
import { SelectOption } from '@shared/models';

export const resourceTypeOptions: SelectOption[] = [
  {
    label: 'resources.typeOptions.data',
    value: RegistryResourceType.Data,
  },
  {
    label: 'resources.typeOptions.code',
    value: RegistryResourceType.Code,
  },
  {
    label: 'resources.typeOptions.materials',
    value: RegistryResourceType.Materials,
  },
  {
    label: 'resources.typeOptions.papers',
    value: RegistryResourceType.Papers,
  },
  {
    label: 'resources.typeOptions.supplements',
    value: RegistryResourceType.Supplements,
  },
];
