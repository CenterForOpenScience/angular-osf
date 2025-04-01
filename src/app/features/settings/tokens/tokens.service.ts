import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { Observable } from 'rxjs';
import { Token, TokenCreateResponse } from './entities/tokens.models';
import { map } from 'rxjs/operators';
import { TokenMapper } from '@osf/features/settings/tokens/mappers/token.mapper';
import { Scope } from '@osf/features/settings/tokens/entities/scope.interface';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://api.staging4.osf.io/v2/';

  getScopes(): Observable<Scope[]> {
    return this.jsonApiService.getArray<Scope>(this.baseUrl + 'scopes');
  }

  getTokens(): Observable<Token[]> {
    return this.jsonApiService.getArray<Token>(this.baseUrl + 'tokens');
  }

  createToken(name: string, scopes: string[]): Observable<Token> {
    const request = TokenMapper.toRequest(name, scopes);

    return this.jsonApiService
      .post<TokenCreateResponse>(this.baseUrl + 'tokens', request)
      .pipe(map((response) => TokenMapper.fromResponse(response)));
  }

  updateToken(
    tokenId: string,
    name: string,
    scopes: string[],
  ): Observable<Token> {
    const request = TokenMapper.toRequest(name, scopes);
    console.log(request);

    return this.jsonApiService
      .patch<TokenCreateResponse>(this.baseUrl + `tokens/${tokenId}`, request)
      .pipe(map((response) => TokenMapper.fromResponse(response)));
  }

  deleteToken(tokenId: string): Observable<void> {
    return this.jsonApiService.delete(this.baseUrl + `tokens/${tokenId}`);
  }
}
