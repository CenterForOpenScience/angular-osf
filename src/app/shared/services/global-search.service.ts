import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { mapFilterOptions } from '../mappers/filters/filter-option.mapper';
import { MapFilters } from '../mappers/filters/filters.mapper';
import { MapResources } from '../mappers/search';
import { FilterOption } from '../models/search/discaverable-filter.model';
import { FilterOptionItem, FilterOptionsResponseJsonApi } from '../models/search/filter-options-json-api.models';
import {
  IndexCardSearchResponseJsonApi,
  SearchResultDataJsonApi,
} from '../models/search/index-card-search-json-api.models';
import { ResourcesData } from '../models/search/resource.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get shareTroveUrl() {
    return this.environment.shareTroveUrl;
  }

  getResources(params: Record<string, string | string[]>): Observable<ResourcesData> {
    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(`${this.shareTroveUrl}/index-card-search`, params)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  getResourcesByLink(link: string): Observable<ResourcesData> {
    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(link)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  getFilterOptions(
    params: Record<string, string | string[]>
  ): Observable<{ options: FilterOption[]; nextUrl?: string }> {
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
      response.included?.filter((item): item is SearchResultDataJsonApi => item.type === 'search-result') ?? [];
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
    return {
      resources: MapResources(response),
      filters: MapFilters(response),
      count: this.parseTotalCount(response),
      self: response.data.links.self,
      first: response.data?.relationships?.searchResultPage.links?.first?.href ?? null,
      next: response.data?.relationships?.searchResultPage.links?.next?.href ?? null,
      previous: response.data?.relationships?.searchResultPage.links?.prev?.href ?? null,
    };
  }

  private parseTotalCount(response: IndexCardSearchResponseJsonApi) {
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
}
