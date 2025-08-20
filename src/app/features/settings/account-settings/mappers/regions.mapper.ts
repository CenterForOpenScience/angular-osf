import { ApiData } from '@osf/shared/models';

import { Region } from '../models';

export function MapRegions(data: ApiData<{ name: string }, null, null, null>[]): Region[] {
  const regions: Region[] = [];

  for (const region of data) {
    regions.push(MapRegion(region));
  }

  return regions;
}

export function MapRegion(data: ApiData<{ name: string }, null, null, null>): Region {
  return {
    id: data.id,
    name: data.attributes.name,
  };
}
