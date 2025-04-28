import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MapResources } from '@osf/features/search/mappers/search.mapper';
import { IndexCardSearch } from '@osf/features/search/models/raw-models/index-card-search.model';
import { ResourcesData } from '@osf/features/search/models/resources-data.entity';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  #jsonApiService = inject(JsonApiService);

  getResources(
    filters: Record<string, string>,
    searchText: string,
    sortBy: string,
    resourceType: string,
  ): Observable<ResourcesData> {
    const params: Record<string, string> = {
      'cardSearchFilter[resourceType]': resourceType ?? '',
      'cardSearchFilter[accessService]': 'https://staging4.osf.io/',
      'cardSearchText[*,creator.name,isContainedBy.creator.name]':
        searchText ?? '',
      'page[size]': '10',
      sort: sortBy,
      ...filters,
    };

    return this.#jsonApiService
      .get<IndexCardSearch>(
        `${environment.shareDomainUrl}/index-card-search`,
        params,
      )
      .pipe(
        map((response) => {
          if (response?.included) {
            return {
              resources: response?.included
                .filter((item) => item.type === 'index-card')
                .map((item) => MapResources(item.attributes.resourceMetadata)),
              count: response.data.attributes.totalResultCount,
              first:
                response.data?.relationships?.searchResultPage?.links?.first
                  ?.href,
              next: response.data?.relationships?.searchResultPage?.links?.next
                ?.href,
              previous:
                response.data?.relationships?.searchResultPage?.links?.prev
                  ?.href,
            };
          }

          return {} as ResourcesData;
        }),
      );
  }

  getResourcesByLink(link: string): Observable<ResourcesData> {
    return this.#jsonApiService.get<IndexCardSearch>(link).pipe(
      map((response) => {
        if (response?.included) {
          return {
            resources: response.included
              .filter((item) => item.type === 'index-card')
              .map((item) => MapResources(item.attributes.resourceMetadata)),
            count: response.data.attributes.totalResultCount,
            first:
              response.data?.relationships?.searchResultPage?.links?.first
                ?.href,
            next: response.data?.relationships?.searchResultPage?.links?.next
              ?.href,
            previous:
              response.data?.relationships?.searchResultPage?.links?.prev?.href,
          };
        }

        return {} as ResourcesData;
      }),
    );
  }
}
