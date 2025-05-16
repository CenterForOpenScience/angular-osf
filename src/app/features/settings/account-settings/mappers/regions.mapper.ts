import { ApiData } from '@core/services/json-api/json-api.entity';
import { Region } from '@osf/features/settings/account-settings/models/osf-models/region.model';

export function MapRegions(data: ApiData<{ name: string }, null, null>[]): Region[] {
  const regions: Region[] = [];
  for (const region of data) {
    regions.push(MapRegion(region));
  }

  return regions;
}

export function MapRegion(data: ApiData<{ name: string }, null, null>): Region {
  return {
    id: data.id,
    name: data.attributes.name,
  };
}
