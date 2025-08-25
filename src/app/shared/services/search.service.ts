import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MapResources } from '@osf/features/search/mappers';
import { IndexCardSearch, ResourceItem, ResourcesData } from '@osf/features/search/models';
import { JsonApiService } from '@osf/shared/services';
import {
  AppliedFilter,
  CombinedFilterMapper,
  FilterOptionItem,
  mapFilterOption,
  RelatedPropertyPathItem,
} from '@shared/mappers';
import { ApiData, FilterOptionsResponseJsonApi, SelectOption } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly jsonApiService = inject(JsonApiService);

  getResources(
    filters: Record<string, string>,
    searchText: string,
    sortBy: string,
    resourceType: string
  ): Observable<ResourcesData> {
    const params: Record<string, string> = {
      'cardSearchFilter[resourceType]': resourceType ?? '',
      'cardSearchFilter[accessService]': environment.webUrl,
      'cardSearchText[*,creator.name,isContainedBy.creator.name]': searchText ?? '',
      'page[size]': '10',
      sort: sortBy,
      ...filters,
    };

    return this.jsonApiService.get<IndexCardSearch>(`${environment.shareDomainUrl}/index-card-search`, params).pipe(
      map((response) => {
        if (response?.included) {
          const indexCardItems = response.included.filter(
            (item): item is ApiData<{ resourceMetadata: ResourceItem }, null, null, null> => item.type === 'index-card'
          );

          const relatedPropertyPathItems = response.included.filter(
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

        return {} as ResourcesData;
      })
    );
  }

  getResourcesByLink(link: string): Observable<ResourcesData> {
    return this.jsonApiService.get<IndexCardSearch>(link).pipe(
      map((response) => {
        if (response?.included) {
          const indexCardItems = response.included.filter(
            (item): item is ApiData<{ resourceMetadata: ResourceItem }, null, null, null> => item.type === 'index-card'
          );

          const relatedPropertyPathItems = response.included.filter(
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

        return {} as ResourcesData;
      })
    );
  }

  getFilterOptions(filterKey: string): Observable<{ options: SelectOption[]; nextUrl?: string }> {
    const params: Record<string, string> = {
      valueSearchPropertyPath: filterKey,
      'cardSearchFilter[accessService]': environment.webUrl,
      'page[size]': '50',
    };

    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(`${environment.shareDomainUrl}/index-value-search`, params)
      .pipe(map((response) => this.returnDataToOptionsWithNextUrl(response)));
  }

  getFilterOptionsWithSearch(
    filterKey: string,
    searchText: string
  ): Observable<{ options: SelectOption[]; nextUrl?: string }> {
    const params: Record<string, string> = {
      valueSearchPropertyPath: filterKey,
      valueSearchText: searchText,
      'cardSearchFilter[accessService]': environment.webUrl,
      'page[size]': '50',
    };

    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(`${environment.shareDomainUrl}/index-value-search`, params)
      .pipe(map((response) => this.returnDataToOptionsWithNextUrl(response)));
  }

  getFilterOptionsFromPaginationUrl(url: string): Observable<{ options: SelectOption[]; nextUrl?: string }> {
    return this.jsonApiService
      .get<FilterOptionsResponseJsonApi>(url)
      .pipe(map((response) => this.returnDataToOptionsWithNextUrl(response)));
  }

  private returnDataToOptionsWithNextUrl(response: FilterOptionsResponseJsonApi): {
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
}
