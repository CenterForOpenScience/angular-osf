import { DiscoverableFilter, FilterOperatorOption } from '@osf/shared/models/search/discaverable-filter.model';
import {
  IndexCardSearchResponseJsonApi,
  RelatedPropertyPathDataJsonApi,
} from '@osf/shared/models/search/index-card-search-json-api.models';

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
  const operator = relatedPropertyPath.attributes.suggestedFilterOperator as FilterOperatorOption;
  const propertyPath = relatedPropertyPath.attributes.propertyPath?.at(-1);

  const label = propertyPath?.displayLabel?.[0]?.['@value'] ?? key;
  const description = propertyPath?.description?.[0]?.['@value'];
  const helpLink = propertyPath?.link?.[0]?.['@value'];
  const helpLinkText = propertyPath?.linkText?.[0]?.['@value'];

  return {
    key,
    operator,
    label,
    description,
    helpLink,
    helpLinkText,
    resultCount: relatedPropertyPath.attributes.cardSearchResultCount,
    isLoading: false,
    isLoaded: false,
    options: [],
  };
}
