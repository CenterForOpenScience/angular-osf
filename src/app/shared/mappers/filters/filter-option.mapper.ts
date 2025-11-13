import { FilterOption } from '@osf/shared/models/search/discaverable-filter.model';
import { FilterOptionItem } from '@osf/shared/models/search/filter-options-json-api.models';
import { SearchResultDataJsonApi } from '@osf/shared/models/search/index-card-search-json-api.models';

export function mapFilterOptions(
  searchResultItems: SearchResultDataJsonApi[],
  filterOptionItems: FilterOptionItem[]
): FilterOption[] {
  return searchResultItems
    .map((searchResult) => {
      const cardSearchResultCount = searchResult.attributes!.cardSearchResultCount;
      const filterOption = filterOptionItems.find(
        (option) => option.id === searchResult.relationships.indexCard.data.id
      );
      const filterOptionMetadata = filterOption?.attributes.resourceMetadata;
      const id = filterOptionMetadata['@id'];

      if ('title' in filterOptionMetadata) {
        return {
          label: filterOptionMetadata?.title?.[0]?.['@value'],
          value: id ?? filterOptionMetadata?.title?.[0]?.['@value'],
          cardSearchResultCount,
        };
      } else if ('displayLabel' in filterOptionMetadata) {
        return {
          label: filterOptionMetadata.displayLabel?.[0]?.['@value'],
          value: id ?? filterOptionMetadata?.displayLabel?.[0]?.['@value'],
          cardSearchResultCount,
        };
      } else if ('name' in filterOptionMetadata) {
        return {
          label: filterOptionMetadata.name?.[0]?.['@value'],
          value: id ?? filterOptionMetadata?.name?.[0]?.['@value'],
          cardSearchResultCount,
        };
      } else {
        return {
          label: '',
          value: id,
          cardSearchResultCount,
        };
      }
    })
    .sort((a, b) => b.cardSearchResultCount - a.cardSearchResultCount);
}
