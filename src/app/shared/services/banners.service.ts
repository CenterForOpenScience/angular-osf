import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { BannerModel } from '../../core/components/osf-banners/models/banner.model';
import { BannerMapper } from '../mappers/banner.mapper';
import { JsonApiResponse } from '../models';
import { BannerJsonApi } from '../models/banner.json-api.model';

import { JsonApiService } from './json-api.service';

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
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiDomainUrl = this.environment.apiDomainUrl;

  /**
   * Retrieves the current banner
   *
   * @returns Observable emitting a Banner object.
   *
   */
  getCurrentBanner(): Observable<BannerModel> {
    return this.jsonApiService
      .get<JsonApiResponse<BannerJsonApi, null>>(`${this.apiDomainUrl}/_/banners/current`)
      .pipe(map((response) => BannerMapper.fromResponse(response.data)));
  }
}
