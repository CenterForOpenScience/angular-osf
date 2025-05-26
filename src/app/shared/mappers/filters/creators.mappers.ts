import { Creator } from '@osf/shared/models/filters/creator/creator.model';
import { CreatorItem } from '@osf/shared/models/filters/creator/creator-item.model';

export function MapCreators(rawItem: CreatorItem): Creator {
  return {
    id: rawItem?.['@id'],
    name: rawItem?.name?.[0]?.['@value'],
  };
}
