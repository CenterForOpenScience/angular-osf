import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';

import { ScopeMapper, TokenMapper } from '../mappers';
import { ScopeJsonApi, ScopeModel, TokenCreateResponseJsonApi, TokenGetResponseJsonApi, TokenModel } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  private readonly jsonApiService = inject(JsonApiService);

  getScopes(): Observable<ScopeModel[]> {
    return this.jsonApiService
      .get<JsonApiResponse<ScopeJsonApi[], null>>(`${environment.apiUrl}/scopes/`)
      .pipe(map((responses) => ScopeMapper.fromResponse(responses.data)));
  }

  getTokens(): Observable<TokenModel[]> {
    return this.jsonApiService
      .get<JsonApiResponse<TokenGetResponseJsonApi[], null>>(`${environment.apiUrl}/tokens/`)
      .pipe(map((responses) => responses.data.map((response) => TokenMapper.fromGetResponse(response))));
  }

  getTokenById(tokenId: string): Observable<TokenModel> {
    return this.jsonApiService
      .get<JsonApiResponse<TokenGetResponseJsonApi, null>>(`${environment.apiUrl}/tokens/${tokenId}/`)
      .pipe(map((response) => TokenMapper.fromGetResponse(response.data)));
  }

  createToken(name: string, scopes: string[]): Observable<TokenModel> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.jsonApiService
      .post<JsonApiResponse<TokenCreateResponseJsonApi, null>>(environment.apiUrl + '/tokens/', request)
      .pipe(map((response) => TokenMapper.fromCreateResponse(response.data)));
  }

  updateToken(tokenId: string, name: string, scopes: string[]): Observable<TokenModel> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.jsonApiService
      .patch<TokenCreateResponseJsonApi>(`${environment.apiUrl}/tokens/${tokenId}/`, request)
      .pipe(map((response) => TokenMapper.fromCreateResponse(response)));
  }

  deleteToken(tokenId: string): Observable<void> {
    return this.jsonApiService.delete(`${environment.apiUrl}/tokens/${tokenId}/`);
  }
}
