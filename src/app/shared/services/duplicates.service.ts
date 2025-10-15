import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { BaseNodeMapper } from '../mappers';
import { BaseNodeDataJsonApi, NodeModel, PaginatedData, ResponseJsonApi } from '../models';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class DuplicatesService {
  private jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  fetchAllDuplicates(
    resourceId: string,
    resourceType: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<PaginatedData<NodeModel[]>> {
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
      .get<ResponseJsonApi<BaseNodeDataJsonApi[]>>(`${this.apiUrl}/${resourceType}/${resourceId}/forks/`, params)
      .pipe(map((res) => BaseNodeMapper.getNodesWithEmbedsAndTotalData(res)));
  }
}
