import { CedarTemplate } from '@osf/features/metadata/models';
import { DiscoverableFilter, FilterOperatorOption } from '@osf/shared/models/search/discaverable-filter.model';

export class CedarTemplateFilterMapper {
  static fromTemplate(template: CedarTemplate): DiscoverableFilter[] {
    const { order, propertyLabels } = template._ui;

    return order
      .filter((key) => propertyLabels[key]?.trim())
      .map((key) => ({
        key,
        label: propertyLabels[key],
        operator: FilterOperatorOption.AnyOf,
      }));
  }
}
