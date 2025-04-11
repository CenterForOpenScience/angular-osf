import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResourceItem } from '@osf/features/search/models/raw-models/resource-response.model';
import {
  ApiData,
  JsonApiResponse,
} from '@core/services/json-api/json-api.entity';
import { MapResources } from '@osf/features/search/mappers/search.mapper';
import { Resource } from '@osf/features/search/models/resource.entity';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  #jsonApiService = inject(JsonApiService);

  getResources(filters: Record<string, string>): Observable<Resource[]> {
    const params: Record<string, string> = {
      'cardSearchFilter[resourceType]':
        'Registration,RegistrationComponent,Project,ProjectComponent,Preprint,Agent,File',
      'cardSearchFilter[accessService]': 'https://staging4.osf.io/',
      'cardSearchText[*,creator.name,isContainedBy.creator.name]': '',
      'page[size]': '20',
      sort: '-relevance',
      ...filters,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<
          null,
          ApiData<{ resourceMetadata: ResourceItem }, null>[]
        >
      >(`${environment.shareDomainUrl}/index-card-search`, params)
      .pipe(
        map((response) =>
          response.included
            .filter((item) => item.type === 'index-card')
            .map((item) => MapResources(item.attributes.resourceMetadata)),
        ),
      );
  }

  // getValueSearch(): Observable<Resource[]> {
  //   const params = {
  //     'cardSearchFilter[resourceType]': 'Registration,RegistrationComponent,Project,ProjectComponent,Preprint,Agent,File',
  //     'cardSearchFilter[accessService]': 'https://staging4.osf.io/',
  //     'cardSearchText[*,creator.name,isContainedBy.creator.name]': '',
  //     sort: '-relevance',
  //   };
  //
  //   return
  // }
}
