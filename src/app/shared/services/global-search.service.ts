import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/shared/services';
import { MapResources } from '@shared/mappers/search';
import {
  FilterOption,
  FilterOptionItem,
  FilterOptionsResponseJsonApi,
  IndexCardDataJsonApi,
  IndexCardSearchResponseJsonApi,
  ResourcesData,
  SearchResultJsonApi,
} from '@shared/models';

import { AppliedFilter, CombinedFilterMapper, mapFilterOptions, RelatedPropertyPathItem } from '../mappers';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private readonly jsonApiService = inject(JsonApiService);

  getResources(params: Record<string, string>): Observable<ResourcesData> {
    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(`${environment.shareTroveUrl}/index-card-search`, params)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  getResourcesByLink(link: string): Observable<ResourcesData> {
    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(link)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  getFilterOptions(params: Record<string, string>): Observable<{ options: FilterOption[]; nextUrl?: string }> {
    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(`${environment.shareTroveUrl}/index-value-search`, params)
      .pipe(map((response) => this.handleFilterOptionsRawResponse(response)));
  }

  getFilterOptionsFromPaginationUrl(url: string): Observable<{ options: FilterOption[]; nextUrl?: string }> {
    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(url)
      .pipe(map((response) => this.handleFilterOptionsRawResponse(response)));
  }

  private handleFilterOptionsRawResponse(response: FilterOptionsResponseJsonApi): {
    options: FilterOption[];
    nextUrl?: string;
  } {
    const options: FilterOption[] = [];
    let nextUrl: string | undefined;

    const searchResultItems = response
      .included!.filter((item): item is SearchResultJsonApi => item.type === 'search-result')
      .sort((a, b) => Number(a.id.at(-1)) - Number(b.id.at(-1)));
    const filterOptionItems = response.included!.filter((item): item is FilterOptionItem => item.type === 'index-card');

    options.push(...mapFilterOptions(searchResultItems, filterOptionItems));

    const searchResultPage = response?.data?.relationships?.['searchResultPage'] as {
      links?: { next?: { href: string } };
    };
    if (searchResultPage?.links?.next?.href) {
      nextUrl = searchResultPage.links.next.href;
    }

    return { options, nextUrl };
  }

  private handleResourcesRawResponse(response: IndexCardSearchResponseJsonApi): ResourcesData {
    const searchResultItems = response
      .included!.filter((item): item is SearchResultJsonApi => item.type === 'search-result')
      .sort((a, b) => Number(a.id.at(-1)) - Number(b.id.at(-1)));

    const indexCardItems = response.included!.filter((item) => item.type === 'index-card') as IndexCardDataJsonApi[];
    const indexCardItemsCorrectOrder = searchResultItems.map((searchResult) => {
      return indexCardItems.find((indexCard) => indexCard.id === searchResult.relationships.indexCard.data.id)!;
    });
    const relatedPropertyPathItems = response.included!.filter(
      (item): item is RelatedPropertyPathItem => item.type === 'related-property-path'
    );

    const appliedFilters: AppliedFilter[] = response.data?.attributes?.cardSearchFilter || [];

    return {
      resources: indexCardItemsCorrectOrder.map((item) => MapResources(item)),
      filters: CombinedFilterMapper(appliedFilters, relatedPropertyPathItems),
      count: response.data.attributes.totalResultCount,
      self: response.data.links.self,
      first: response.data?.relationships?.searchResultPage.links?.first?.href ?? null,
      next: response.data?.relationships?.searchResultPage.links?.next?.href ?? null,
      previous: response.data?.relationships?.searchResultPage.links?.prev?.href ?? null,
    };
  }
}
