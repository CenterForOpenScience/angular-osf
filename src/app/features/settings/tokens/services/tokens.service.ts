import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiResponse } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { ScopeMapper, TokenMapper } from '../mappers';
import { ScopeJsonApi, ScopeModel, TokenGetResponseJsonApi, TokenModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiDomainUrl}/v2`;

  getScopes(): Observable<ScopeModel[]> {
    return this.jsonApiService
      .get<JsonApiResponse<ScopeJsonApi[], null>>(`${this.apiUrl}/scopes/`)
      .pipe(map((responses) => ScopeMapper.fromResponse(responses.data)));
  }

  getTokens(): Observable<TokenModel[]> {
    return this.jsonApiService
      .get<JsonApiResponse<TokenGetResponseJsonApi[], null>>(`${this.apiUrl}/tokens/`)
      .pipe(map((responses) => responses.data.map((response) => TokenMapper.fromGetResponse(response))));
  }

  getTokenById(tokenId: string): Observable<TokenModel> {
    return this.jsonApiService
      .get<JsonApiResponse<TokenGetResponseJsonApi, null>>(`${this.apiUrl}/tokens/${tokenId}/`)
      .pipe(map((response) => TokenMapper.fromGetResponse(response.data)));
  }

  createToken(name: string, scopes: string[]): Observable<TokenModel> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.jsonApiService
      .post<JsonApiResponse<TokenGetResponseJsonApi, null>>(`${this.apiUrl}/tokens/`, request)
      .pipe(map((response) => TokenMapper.fromGetResponse(response.data)));
  }

  updateToken(tokenId: string, name: string, scopes: string[]): Observable<TokenModel> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.jsonApiService
      .patch<TokenGetResponseJsonApi>(`${this.apiUrl}/tokens/${tokenId}/`, request)
      .pipe(map((response) => TokenMapper.fromGetResponse(response)));
  }

  deleteToken(tokenId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/tokens/${tokenId}/`);
  }
}
