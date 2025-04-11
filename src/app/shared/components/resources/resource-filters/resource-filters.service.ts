import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ApiData,
  JsonApiResponse,
} from '@core/services/json-api/json-api.entity';
import { environment } from '../../../../../environments/environment';
import { CreatorItem } from '@shared/components/resources/resource-filters/models/creator/creator-item.entity';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { MapCreators } from '@shared/components/resources/resource-filters/mappers/creators/creators.mappers';
import { Creator } from '@shared/components/resources/resource-filters/models/creator/creator.entity';

@Injectable({
  providedIn: 'root',
})
export class ResourceFiltersService {
  #jsonApiService = inject(JsonApiService);

  getCreators(valueSearchText: string): Observable<Creator[]> {
    const params = {
      'cardSearchFilter[resourceType]':
        'Registration,RegistrationComponent,Project,ProjectComponent,Preprint,Agent,File',
      'cardSearchFilter[accessService]': 'https://staging4.osf.io/',
      'cardSearchText[*,creator.name,isContainedBy.creator.name]': '',
      'page[size]': '20',
      sort: '-relevance',
      valueSearchPropertyPath: 'creator',
      valueSearchText: valueSearchText,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<
          null,
          ApiData<{ resourceMetadata: CreatorItem }, null>[]
        >
      >(`${environment.shareDomainUrl}/index-value-search`, params)
      .pipe(
        map((response) =>
          response.included
            .filter((item) => item.type === 'index-card')
            .map((item) => MapCreators(item.attributes.resourceMetadata)),
        ),
      );
  }
}
