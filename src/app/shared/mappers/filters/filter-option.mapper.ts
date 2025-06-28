import { ApiData } from '@osf/core/models';
import { FilterOptionAttributes, FilterOptionMetadata, SelectOption } from '@shared/models';

export type FilterOptionItem = ApiData<FilterOptionAttributes, null, null, null>;

export function mapFilterOption(item: FilterOptionItem): SelectOption {
  const metadata: FilterOptionMetadata = item.attributes.resourceMetadata;
  const name = metadata.name?.[0]?.['@value'] || metadata.title?.[0]?.['@value'] || '';
  const id = metadata['@id'];

  return {
    label: name,
    value: id,
  };
}
