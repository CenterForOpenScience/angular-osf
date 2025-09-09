import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@shared/models';
import { JsonApiService } from '@shared/services';

import { BannerMapper } from '../mappers/banner.mapper';
import { Banner, BannerJsonApi } from '../models/banners.model';

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
   * Retrieves a list of external storage service addons by type.
   *
   * @param addonType - The addon type to fetch (e.g., 'storage').
   * @returns Observable emitting an array of mapped Addon objects.
   *
   */
  fetchCurrentBanner(): Observable<Banner> {
    return this.jsonApiService
      .get<JsonApiResponse<BannerJsonApi, null>>(`${environment.apiUrlPrivate}/banners/current`)
      .pipe(map((response) => BannerMapper.fromResponse(response.data)));
  }
}
