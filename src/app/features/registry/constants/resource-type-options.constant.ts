import { RegistryResourceType } from '@shared/enums/registry-resource.enum';
import { SelectOption } from '@shared/models/select-option.model';

export const resourceTypeOptions: SelectOption[] = [
  {
    label: 'resourceCard.resources.data',
    value: RegistryResourceType.Data,
  },
  {
    label: 'resourceCard.resources.code',
    value: RegistryResourceType.Code,
  },
  {
    label: 'resourceCard.resources.materials',
    value: RegistryResourceType.Materials,
  },
  {
    label: 'resourceCard.resources.papers',
    value: RegistryResourceType.Papers,
  },
  {
    label: 'resourceCard.resources.supplements',
    value: RegistryResourceType.Supplements,
  },
];
