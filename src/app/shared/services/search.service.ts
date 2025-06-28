import { map, Observable, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ApiData } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { MapResources } from '@osf/features/search/mappers';
import { IndexCardSearch, ResourceItem, ResourcesData } from '@osf/features/search/models';
import {
  AppliedFilter,
  CombinedFilterMapper,
  FilterOptionItem,
  mapFilterOption,
  RelatedPropertyPathItem,
} from '@shared/mappers';
import { FilterOptionsResponse, SelectOption } from '@shared/models';

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
      'cardSearchFilter[accessService]': 'https://staging4.osf.io/',
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
      }),
      tap((res) => console.log(res))
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

  getFilterOptions(filterKey: string): Observable<SelectOption[]> {
    const params: Record<string, string> = {
      valueSearchPropertyPath: filterKey,
      'page[size]': '50',
    };

    return this.jsonApiService
      .get<FilterOptionsResponse>(`${environment.shareDomainUrl}/index-card-search`, params)
      .pipe(
        map((response) => {
          if (response?.included) {
            const filterOptionItems = response.included.filter(
              (item): item is FilterOptionItem => item.type === 'index-card' && !!item.attributes?.resourceMetadata
            );

            return filterOptionItems.map((item) => mapFilterOption(item));
          }

          return [];
        })
      );
  }
}
