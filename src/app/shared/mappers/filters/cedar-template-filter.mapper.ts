import {
  CEDAR_PROPERTIES_BASE_IRI,
  CEDAR_TEMPLATE_FIELD_TYPE,
  CedarTemplate,
  CedarTemplateContextSchema,
  CedarTemplateField,
} from '@osf/features/metadata/models';
import {
  DiscoverableFilter,
  FilterOperatorOption,
  FilterOption,
} from '@osf/shared/models/search/discoverable-filter.model';

export class CedarTemplateFilterMapper {
  static fromTemplate(template: CedarTemplate): DiscoverableFilter[] {
    const { order, propertyLabels } = template._ui;
    const contextProperties = (template.properties['@context'] as CedarTemplateContextSchema)?.properties ?? {};

    return order
      .filter((key) => {
        const field = template.properties[key] as CedarTemplateField | undefined;
        return (
          propertyLabels[key]?.trim() &&
          field?.['@type'] === CEDAR_TEMPLATE_FIELD_TYPE &&
          (field._valueConstraints?.literals?.length ?? 0) > 0
        );
      })
      .map((key) => {
        const field = template.properties[key] as CedarTemplateField;
        const iri = contextProperties[key]?.enum?.[0];
        const cedarPropertyIri = iri?.replace(CEDAR_PROPERTIES_BASE_IRI, '');
        const options: FilterOption[] = (field._valueConstraints!.literals ?? []).map((literal) => ({
          label: literal.label,
          value: literal.label,
          cardSearchResultCount: null,
        }));

        return {
          key,
          label: propertyLabels[key],
          operator: FilterOperatorOption.AnyOf,
          options,
          cedarPropertyIri,
        };
      });
  }
}
