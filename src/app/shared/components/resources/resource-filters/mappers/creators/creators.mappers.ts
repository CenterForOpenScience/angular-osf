import { CreatorItem } from '@shared/components/resources/resource-filters/models/creator/creator-item.entity';
import { Creator } from '@shared/components/resources/resource-filters/models/creator/creator.entity';

export function MapCreators(rawItem: CreatorItem): Creator {
  return {
    id: rawItem?.['@id'],
    name: rawItem?.name?.[0]?.['@value'],
  };
}
