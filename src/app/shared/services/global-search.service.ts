import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { MapResources } from '@shared/mappers/search';
import {
  FilterOption,
  FilterOptionItem,
  FilterOptionsResponseJsonApi,
  IndexCardSearchResponseJsonApi,
  ResourcesData,
  SearchResultJsonApi,
} from '@shared/models';

import { AppliedFilter, CombinedFilterMapper, mapFilterOptions, RelatedPropertyPathItem } from '../mappers';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly shareTroveUrl = this.environment.shareTroveUrl;

  getResources(params: Record<string, string>): Observable<ResourcesData> {
    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(`${this.shareTroveUrl}/index-card-search`, params)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  getResourcesByLink(link: string): Observable<ResourcesData> {
    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(link)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  getFilterOptions(params: Record<string, string>): Observable<{ options: FilterOption[]; nextUrl?: string }> {
    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(`${this.shareTroveUrl}/index-value-search`, params)
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
    let nextUrl: string | undefined;

    const searchResultItems =
      response.included?.filter((item): item is SearchResultJsonApi => item.type === 'search-result') ?? [];
    const filterOptionItems =
      response.included?.filter((item): item is FilterOptionItem => item.type === 'index-card') ?? [];

    const options = mapFilterOptions(searchResultItems, filterOptionItems);
    const searchResultPage = response?.data?.relationships?.['searchResultPage'] as {
      links?: { next?: { href: string } };
    };
    if (searchResultPage?.links?.next?.href) {
      nextUrl = searchResultPage.links.next.href;
    }

    return { options, nextUrl };
  }

  private handleResourcesRawResponse(response: IndexCardSearchResponseJsonApi): ResourcesData {
    const relatedPropertyPathItems = response.included!.filter(
      (item): item is RelatedPropertyPathItem => item.type === 'related-property-path'
    );

    const appliedFilters: AppliedFilter[] = response.data?.attributes?.cardSearchFilter || [];

    return {
      resources: MapResources(response),
      filters: CombinedFilterMapper(appliedFilters, relatedPropertyPathItems),
      count: response.data.attributes.totalResultCount,
      self: response.data.links.self,
      first: response.data?.relationships?.searchResultPage.links?.first?.href ?? null,
      next: response.data?.relationships?.searchResultPage.links?.next?.href ?? null,
      previous: response.data?.relationships?.searchResultPage.links?.prev?.href ?? null,
    };
  }
}
