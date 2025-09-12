import { FilterOption, FilterOptionItem, SearchResultJsonApi } from '@shared/models';

export function mapFilterOptions(
  searchResultItems: SearchResultJsonApi[],
  filterOptionItems: FilterOptionItem[]
): FilterOption[] {
  return searchResultItems.map((searchResult) => {
    const cardSearchResultCount = searchResult.attributes!.cardSearchResultCount;
    const filterOption = filterOptionItems.find((option) => option.id === searchResult.relationships.indexCard.data.id);
    const filterOptionMetadata = filterOption?.attributes.resourceMetadata;
    const id = filterOptionMetadata['@id'];

    if ('title' in filterOptionMetadata) {
      return {
        label: filterOptionMetadata?.title?.[0]?.['@value'],
        value: id,
        cardSearchResultCount,
      };
    } else if ('displayLabel' in filterOptionMetadata) {
      return {
        label: filterOptionMetadata.displayLabel?.[0]?.['@value'],
        value: id,
        cardSearchResultCount,
      };
    } else if ('name' in filterOptionMetadata) {
      return {
        label: filterOptionMetadata.name?.[0]?.['@value'],
        value: id,
        cardSearchResultCount,
      };
    } else {
      return {
        label: '',
        value: id,
        cardSearchResultCount,
      };
    }
  });
}
