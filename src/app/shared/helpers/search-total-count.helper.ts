import { IndexCardSearchResponseJsonApi } from '../models/search/index-card-search-json-api.model';

export function parseSearchTotalCount(response: IndexCardSearchResponseJsonApi): number {
  let totalCount = 0;
  const rawTotalCount = response.data.attributes.totalResultCount;

  if (typeof rawTotalCount === 'number') {
    totalCount = rawTotalCount;
  } else if (
    typeof rawTotalCount === 'object' &&
    rawTotalCount !== null &&
    '@id' in rawTotalCount &&
    String(rawTotalCount['@id']).includes('ten-thousands-and-more')
  ) {
    totalCount = 10000;
  }

  return totalCount;
}
