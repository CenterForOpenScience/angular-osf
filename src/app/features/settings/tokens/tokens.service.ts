import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { Scope } from '@osf/features/settings/tokens/entities/scope.interface';
import { TokenMapper } from '@osf/features/settings/tokens/token.mapper';

import { environment } from '../../../../environments/environment';

import { Token, TokenCreateResponse, TokenGetResponse } from './entities/tokens.models';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  #jsonApiService = inject(JsonApiService);

  getScopes(): Observable<Scope[]> {
    return this.#jsonApiService
      .get<JsonApiResponse<Scope[], null>>(environment.apiUrl + '/scopes/')
      .pipe(map((responses) => responses.data));
  }

  getTokens(): Observable<Token[]> {
    return this.#jsonApiService.get<JsonApiResponse<TokenGetResponse[], null>>(environment.apiUrl + '/tokens/').pipe(
      map((responses) => {
        return responses.data.map((response) => TokenMapper.fromGetResponse(response));
      })
    );
  }

  getTokenById(tokenId: string): Observable<Token> {
    return this.#jsonApiService
      .get<JsonApiResponse<TokenGetResponse, null>>(`${environment.apiUrl}/tokens/${tokenId}/`)
      .pipe(map((response) => TokenMapper.fromGetResponse(response.data)));
  }

  createToken(name: string, scopes: string[]): Observable<Token> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.#jsonApiService
      .post<TokenCreateResponse>(environment.apiUrl + '/tokens/', request)
      .pipe(map((response) => TokenMapper.fromCreateResponse(response)));
  }

  updateToken(tokenId: string, name: string, scopes: string[]): Observable<Token> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.#jsonApiService
      .patch<TokenCreateResponse>(`${environment.apiUrl}/tokens/${tokenId}/`, request)
      .pipe(map((response) => TokenMapper.fromCreateResponse(response)));
  }

  deleteToken(tokenId: string): Observable<void> {
    return this.#jsonApiService.delete(`${environment.apiUrl}/tokens/${tokenId}/`);
  }
}
