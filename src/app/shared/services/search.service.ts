import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/shared/services';
import { MapResources } from '@shared/mappers/search';
import {
  ApiData,
  FilterOptionItem,
  FilterOptionsResponseJsonApi,
  IndexCardSearchResponse,
  ResourcesData,
  SearchResourceMetadata,
  SelectOption,
} from '@shared/models';

import { AppliedFilter, CombinedFilterMapper, mapFilterOption, RelatedPropertyPathItem } from '../mappers';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly jsonApiService = inject(JsonApiService);

  getResources(params: Record<string, string>): Observable<ResourcesData> {
    return this.jsonApiService
      .get<IndexCardSearchResponse>(`${environment.shareDomainUrl}/index-card-search`, params)
      .pipe(
        map((response) => {
          return this.handleResourcesRawResponse(response);
        })
      );
  }

  getResourcesByLink(link: string): Observable<ResourcesData> {
    return this.jsonApiService.get<IndexCardSearchResponse>(link).pipe(
      map((response) => {
        return this.handleResourcesRawResponse(response);
      })
    );
  }

  getFilterOptions(params: Record<string, string>): Observable<{ options: SelectOption[]; nextUrl?: string }> {
    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(`${environment.shareDomainUrl}/index-value-search`, params)
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

  private handleResourcesRawResponse(response: IndexCardSearchResponse): ResourcesData {
    const indexCardItems = response.included!.filter(
      (
        item
      ): item is ApiData<
        {
          resourceMetadata: SearchResourceMetadata;
        },
        null,
        null,
        null
      > => item.type === 'index-card'
    );

    const relatedPropertyPathItems = response.included!.filter(
      (item): item is RelatedPropertyPathItem => item.type === 'related-property-path'
    );

    const appliedFilters: AppliedFilter[] = response.data?.attributes?.cardSearchFilter || [];

    return {
      resources: indexCardItems.map((item) => MapResources(item.attributes.resourceMetadata)),
      filters: CombinedFilterMapper(appliedFilters, relatedPropertyPathItems),
      count: response.data.attributes.totalResultCount,
      first: response.data?.relationships?.searchResultPage?.links?.first?.href,
      next: response.data?.relationships?.searchResultPage?.links?.next?.href,
      previous: response.data?.relationships?.searchResultPage?.links?.prev?.href,
    };
  }
}
