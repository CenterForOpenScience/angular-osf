import { ApiData } from '@osf/shared/models';
import { FilterOptionAttributes, SelectOption } from '@shared/models';

export type FilterOptionItem = ApiData<FilterOptionAttributes, null, null, null>;

export function mapFilterOption(item: FilterOptionItem): SelectOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata: any = item.attributes.resourceMetadata;
  const id = metadata['@id'];

  if ('title' in metadata) {
    return {
      label: metadata?.title?.[0]?.['@value'],
      value: id,
    };
  } else if ('displayLabel' in metadata) {
    return {
      label: metadata.displayLabel?.[0]?.['@value'],
      value: id,
    };
  } else if ('name' in metadata) {
    return {
      label: metadata.name?.[0]?.['@value'],
      value: id,
    };
  } else {
    return {
      label: '',
      value: id,
    };
  }
}
