import { AddonType } from '@shared/enums/addon-type.enum';
import { AddonCategory } from '@shared/enums/addons-category.enum';

export function addonCategoryToQueryParam(category: AddonCategory): AddonType | null {
  const match = category.match(/external-(\w+)-services/);
  return match ? (match[1] as AddonType) : null;
}

export function queryParamToAddonCategory(type: AddonType): AddonCategory {
  return `external-${type}-services` as AddonCategory;
}
