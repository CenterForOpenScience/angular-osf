import { Creator } from '@shared/entities/filters/creator/creator.entity';
import { CreatorItem } from '@shared/entities/filters/creator/creator-item.entity';

export function MapCreators(rawItem: CreatorItem): Creator {
  return {
    id: rawItem?.['@id'],
    name: rawItem?.name?.[0]?.['@value'],
  };
}
