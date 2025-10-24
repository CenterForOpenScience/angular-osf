import { AddonCategory } from '@shared/enums/addons-category.enum';
import { SelectOption } from '@shared/models';

export const ADDON_CATEGORY_OPTIONS: SelectOption[] = [
  {
    label: 'settings.addons.categories.additionalService',
    value: AddonCategory.EXTERNAL_STORAGE_SERVICES,
  },
  {
    label: 'settings.addons.categories.citationManager',
    value: AddonCategory.EXTERNAL_CITATION_SERVICES,
  },
  {
    label: 'settings.addons.categories.linkedServices',
    value: AddonCategory.EXTERNAL_LINK_SERVICES,
  },
  {
    label: 'settings.addons.categories.otherServices',
    value: AddonCategory.EXTERNAL_REDIRECT_SERVICES,
  },
];
