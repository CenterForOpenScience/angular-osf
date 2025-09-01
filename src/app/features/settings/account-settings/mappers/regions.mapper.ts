import { ApiData, IdName } from '@osf/shared/models';

export function MapRegions(data: ApiData<{ name: string }, null, null, null>[]): IdName[] {
  const regions: IdName[] = [];

  for (const region of data) {
    regions.push(MapRegion(region));
  }

  return regions;
}

export function MapRegion(data: ApiData<{ name: string }, null, null, null>): IdName {
  return {
    id: data.id,
    name: data.attributes.name,
  };
}
