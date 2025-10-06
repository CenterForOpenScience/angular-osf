import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RelatedItemsType } from '@osf/features/analytics/enums';

import { DuplicatesMapper } from '../mappers';
import { ResponseJsonApi } from '../models';
import { DuplicateJsonApi, DuplicatesWithTotal } from '../models/duplicates';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class RelatedService {
  private jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  fetchAllLinkedNodes(resourceId: string, resourceType: string, pageNumber?: number, pageSize?: number) {
    return this.fetchAllRelated(resourceId, resourceType, RelatedItemsType.Linked, pageNumber, pageSize);
  }

  fetchAllDuplicates(
    resourceId: string,
    resourceType: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<DuplicatesWithTotal> {
    return this.fetchAllRelated(resourceId, resourceType, RelatedItemsType.Duplicates, pageNumber, pageSize);
  }

  private fetchAllRelated(
    resourceId: string,
    resourceType: string,
    relatedType: RelatedItemsType,
    pageNumber?: number,
    pageSize?: number
  ): Observable<DuplicatesWithTotal> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    if (pageNumber) {
      params['page'] = pageNumber;
    }

    if (pageSize) {
      params['page[size]'] = pageSize;
    }

    return this.jsonApiService
      .get<ResponseJsonApi<DuplicateJsonApi[]>>(`${this.apiUrl}/${resourceType}/${resourceId}/${relatedType}/`, params)
      .pipe(map((res) => DuplicatesMapper.fromDuplicatesJsonApiResponse(res)));
  }
}
