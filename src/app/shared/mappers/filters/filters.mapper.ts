import { DiscoverableFilter, IndexCardSearchResponseJsonApi, RelatedPropertyPathDataJsonApi } from '@shared/models';

export function MapFilters(indexCardSearchResponseJsonApi: IndexCardSearchResponseJsonApi): DiscoverableFilter[] {
  const relatedPropertiesIds = indexCardSearchResponseJsonApi.data.relationships.relatedProperties.data.map(
    (obj) => obj.id
  );
  const relatedPropertyPathItems = relatedPropertiesIds.map((relatedPropertyId) => {
    return indexCardSearchResponseJsonApi.included!.find(
      (item): item is RelatedPropertyPathDataJsonApi =>
        item.type === 'related-property-path' && item.id === relatedPropertyId
    )!;
  });

  return relatedPropertyPathItems.map((relatedPropertyPath) => RelatedPropertyPathMapper(relatedPropertyPath));
}

export function RelatedPropertyPathMapper(relatedPropertyPath: RelatedPropertyPathDataJsonApi): DiscoverableFilter {
  const key = relatedPropertyPath.attributes.propertyPathKey;
  const propertyPath = relatedPropertyPath.attributes.propertyPath?.[0];
  const label = propertyPath?.displayLabel?.[0]?.['@value'] ?? key;
  const operator = relatedPropertyPath.attributes.suggestedFilterOperator ?? 'any-of';
  const description = propertyPath?.description?.[0]?.['@value'];
  const helpLink = propertyPath?.link?.[0]?.['@value'];
  const helpLinkText = propertyPath?.linkText?.[0]?.['@value'];
  const type: DiscoverableFilter['type'] = key === 'dateCreated' ? 'date' : key === 'creator' ? 'checkbox' : 'select';

  return {
    key,
    label,
    type,
    operator,
    options: [],
    description,
    helpLink,
    helpLinkText,
    resultCount: relatedPropertyPath.attributes.cardSearchResultCount,
    isLoading: false,
    isLoaded: false,
  };
}
