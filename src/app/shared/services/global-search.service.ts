import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/shared/services';
import { MapResources } from '@shared/mappers/search';
import {
  FilterOptionItem,
  FilterOptionsResponseJsonApi,
  IndexCardDataJsonApi,
  IndexCardSearchResponseJsonApi,
  ResourcesData,
  SelectOption,
} from '@shared/models';

import { AppliedFilter, CombinedFilterMapper, mapFilterOption, RelatedPropertyPathItem } from '../mappers';

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

  getFilterOptions(params: Record<string, string>): Observable<{ options: SelectOption[]; nextUrl?: string }> {
    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(`${environment.shareTroveUrl}/index-value-search`, params)
      .pipe(map((response) => this.handleFilterOptionsRawResponse(response)));
  }

  getFilterOptionsFromPaginationUrl(url: string): Observable<{ options: SelectOption[]; nextUrl?: string }> {
    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(url)
      .pipe(map((response) => this.handleFilterOptionsRawResponse(response)));
  }

  private handleFilterOptionsRawResponse(response: FilterOptionsResponseJsonApi): {
    options: SelectOption[];
    nextUrl?: string;
  } {
    const options: SelectOption[] = [];
    let nextUrl: string | undefined;

    if (response?.included) {
      const filterOptionItems = response.included.filter(
        (item): item is FilterOptionItem => item.type === 'index-card' && !!item.attributes?.resourceMetadata
      );

      options.push(...filterOptionItems.map((item) => mapFilterOption(item)));
    }

    const searchResultPage = response?.data?.relationships?.['searchResultPage'] as {
      links?: { next?: { href: string } };
    };
    if (searchResultPage?.links?.next?.href) {
      nextUrl = searchResultPage.links.next.href;
    }

    return { options, nextUrl };
  }

  private handleResourcesRawResponse(response: IndexCardSearchResponseJsonApi): ResourcesData {
    const indexCardItems = response.included!.filter((item) => item.type === 'index-card') as IndexCardDataJsonApi[];
    const relatedPropertyPathItems = response.included!.filter(
      (item): item is RelatedPropertyPathItem => item.type === 'related-property-path'
    );

    const appliedFilters: AppliedFilter[] = response.data?.attributes?.cardSearchFilter || [];

    return {
      resources: indexCardItems.map((item) => MapResources(item)),
      filters: CombinedFilterMapper(appliedFilters, relatedPropertyPathItems),
      count: response.data.attributes.totalResultCount,
      first: response.data?.relationships?.searchResultPage.links?.first?.href,
      next: response.data?.relationships?.searchResultPage.links?.next?.href,
      previous: response.data?.relationships?.searchResultPage.links?.prev?.href,
    };
  }
}
