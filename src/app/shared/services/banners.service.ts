import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@shared/models';
import { JsonApiService } from '@shared/services';

import { BannerMapper } from '../mappers/banner.mapper';
import { BannerJsonApi } from '../models/banner.json-api.model';
import { BannerModel } from '../models/banner.model';

import { environment } from 'src/environments/environment';

/**
 * Service for fetching scheduled banners from OSF API v2
 */
@Injectable({
  providedIn: 'root',
})
export class BannersService {
  /**
   * Injected instance of the JSON:API service used for making API requests.
   * This service handles standardized JSON:API request and response formatting.
   */
  private jsonApiService = inject(JsonApiService);

  /**
   * Retrieves the current banner
   *
   * @returns Observable emitting a Banner object.
   *
   */
  fetchCurrentBanner(): Observable<BannerModel> {
    return this.jsonApiService
      .get<JsonApiResponse<BannerJsonApi, null>>(`${environment.apiDomainUrl}/_/banners/current`)
      .pipe(map((response) => BannerMapper.fromResponse(response.data)));
  }
}
