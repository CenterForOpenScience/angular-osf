import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { JsonApiResponse } from '@osf/shared/models/common/json-api.model';

import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';
import { EnvironmentTokenMock } from '@testing/providers/environment.token.mock';

import { ScopeJsonApi, ScopeModel, TokenGetResponseJsonApi, TokenModel } from '../models';

import { TokensService } from './tokens.service';

describe('TokensService', () => {
  let service: TokensService;
  const apiBase = `${EnvironmentTokenMock.useValue.apiDomainUrl}/v2`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp(), TokensService],
    });
    service = TestBed.inject(TokensService);
  });

  it('should expose apiUrl from environment', () => {
    expect(service.apiUrl).toBe(`${apiBase}`);
  });

  it('should getScopes and map response', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    const response: JsonApiResponse<ScopeJsonApi[], null> = {
      data: [
        {
          id: 'osf.full_read',
          type: 'scopes',
          attributes: { description: 'Read access' },
        },
      ],
    };
    let result: ScopeModel[] = [];

    service.getScopes().subscribe((value) => (result = value));

    const req = httpMock.expectOne(`${apiBase}/scopes/`);
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(result).toEqual([{ id: 'osf.full_read', description: 'Read access' }]);
    httpMock.verify();
  }));

  it('should getTokens and map response', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    const response: JsonApiResponse<TokenGetResponseJsonApi[], null> = {
      data: [
        {
          id: 'token-1',
          attributes: { name: 'Token One', token_id: 'token-value-1' },
          embeds: {
            scopes: {
              data: [{ id: 'osf.full_read' }, { id: 'osf.full_write' }],
            },
          },
        },
      ],
    };
    let result: TokenModel[] = [];

    service.getTokens().subscribe((value) => (result = value));

    const req = httpMock.expectOne(`${apiBase}/tokens/`);
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(result).toEqual([
      {
        id: 'token-1',
        tokenId: 'token-value-1',
        name: 'Token One',
        scopes: ['osf.full_read', 'osf.full_write'],
      },
    ]);
    httpMock.verify();
  }));

  it('should getTokenById and map response', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    const response: JsonApiResponse<TokenGetResponseJsonApi, null> = {
      data: {
        id: 'token-2',
        attributes: { name: 'Token Two', token_id: 'token-value-2' },
        embeds: {
          scopes: {
            data: [{ id: 'osf.full_read' }],
          },
        },
      },
    };
    let result: TokenModel | undefined;

    service.getTokenById('token-2').subscribe((value) => (result = value));

    const req = httpMock.expectOne(`${apiBase}/tokens/token-2/`);
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(result).toEqual({
      id: 'token-2',
      tokenId: 'token-value-2',
      name: 'Token Two',
      scopes: ['osf.full_read'],
    });
    httpMock.verify();
  }));

  it('should createToken with mapped request and mapped response', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      const response: JsonApiResponse<TokenGetResponseJsonApi, null> = {
        data: {
          id: 'token-3',
          attributes: { name: 'Created Token', token_id: 'token-value-3' },
          embeds: {
            scopes: {
              data: [{ id: 'osf.full_read' }, { id: 'osf.full_write' }],
            },
          },
        },
      };
      let result: TokenModel | undefined;

      service.createToken('Created Token', ['osf.full_read', 'osf.full_write']).subscribe((value) => (result = value));

      const req = httpMock.expectOne(`${apiBase}/tokens/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        data: {
          attributes: {
            name: 'Created Token',
            scopes: 'osf.full_read osf.full_write',
          },
          type: 'tokens',
        },
      });
      req.flush(response);

      expect(result).toEqual({
        id: 'token-3',
        tokenId: 'token-value-3',
        name: 'Created Token',
        scopes: ['osf.full_read', 'osf.full_write'],
      });
      httpMock.verify();
    }
  ));

  it('should updateToken with mapped request and mapped response', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      const response = {
        data: {
          id: 'token-4',
          attributes: { name: 'Updated Token', token_id: 'token-value-4' },
          embeds: {
            scopes: {
              data: [{ id: 'osf.full_write' }],
            },
          },
        } as TokenGetResponseJsonApi,
      };
      let result: TokenModel | undefined;

      service.updateToken('token-4', 'Updated Token', ['osf.full_write']).subscribe((value) => (result = value));

      const req = httpMock.expectOne(`${apiBase}/tokens/token-4/`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        data: {
          attributes: {
            name: 'Updated Token',
            scopes: 'osf.full_write',
          },
          type: 'tokens',
        },
      });
      req.flush(response);

      expect(result).toEqual({
        id: 'token-4',
        tokenId: 'token-value-4',
        name: 'Updated Token',
        scopes: ['osf.full_write'],
      });
      httpMock.verify();
    }
  ));

  it('should deleteToken with DELETE method', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let completed = false;

    service.deleteToken('token-5').subscribe({
      complete: () => {
        completed = true;
      },
    });

    const req = httpMock.expectOne(`${apiBase}/tokens/token-5/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(completed).toBe(true);
    httpMock.verify();
  }));

  it('should propagate errors from getTokenById', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let errorStatus: number | undefined;

    service.getTokenById('token-error').subscribe({
      next: () => {},
      error: (error) => {
        errorStatus = error.status;
      },
    });

    const req = httpMock.expectOne(`${apiBase}/tokens/token-error/`);
    req.flush({ errors: [{ detail: 'boom' }] }, { status: 500, statusText: 'Server Error' });

    expect(errorStatus).toBe(500);
    httpMock.verify();
  }));
});
