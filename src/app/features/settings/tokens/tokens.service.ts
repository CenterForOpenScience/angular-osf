import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { Observable } from 'rxjs';
import {
  Token,
  TokenCreateResponse,
  TokenGetResponse,
} from './entities/tokens.models';
import { map } from 'rxjs/operators';
import { TokenMapper } from '@osf/features/settings/tokens/token.mapper';
import { Scope } from '@osf/features/settings/tokens/entities/scope.interface';
import { JsonApiResponse } from '@core/services/json-api/json-api.entity';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://api.staging4.osf.io/v2/';

  getScopes(): Observable<Scope[]> {
    return this.jsonApiService
      .get<JsonApiResponse<Scope[], null>>(this.baseUrl + 'scopes')
      .pipe(map((responses) => responses.data));
  }

  getTokens(): Observable<Token[]> {
    return this.jsonApiService
      .get<JsonApiResponse<TokenGetResponse[], null>>(this.baseUrl + 'tokens')
      .pipe(
        map((responses) => {
          return responses.data.map((response) =>
            TokenMapper.fromGetResponse(response),
          );
        }),
      );
  }

  getTokenById(tokenId: string): Observable<Token> {
    return this.jsonApiService
      .get<
        JsonApiResponse<TokenGetResponse, null>
      >(this.baseUrl + `tokens/${tokenId}`)
      .pipe(map((response) => TokenMapper.fromGetResponse(response.data)));
  }

  createToken(name: string, scopes: string[]): Observable<Token> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.jsonApiService
      .post<TokenCreateResponse>(this.baseUrl + 'tokens/', request)
      .pipe(map((response) => TokenMapper.fromCreateResponse(response)));
  }

  updateToken(
    tokenId: string,
    name: string,
    scopes: string[],
  ): Observable<Token> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.jsonApiService
      .patch<TokenCreateResponse>(this.baseUrl + `tokens/${tokenId}`, request)
      .pipe(map((response) => TokenMapper.fromCreateResponse(response)));
  }

  deleteToken(tokenId: string): Observable<void> {
    return this.jsonApiService.delete(this.baseUrl + `tokens/${tokenId}`);
  }
}
