import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';

import { ScopeMapper, TokenMapper } from '../mappers';
import { ScopeJsonApi, ScopeModel, TokenCreateResponseJsonApi, TokenGetResponseJsonApi, TokenModel } from '../models';

import { TokensService } from './tokens.service';

import { environment } from 'src/environments/environment';

jest.mock('../mappers/scope.mapper');
jest.mock('../mappers/token.mapper');

describe('TokensService', () => {
  let service: TokensService;
  let jsonApiServiceMock: jest.Mocked<JsonApiService>;

  beforeEach(() => {
    jsonApiServiceMock = {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<JsonApiService>;

    TestBed.configureTestingModule({
      providers: [TokensService, { provide: JsonApiService, useValue: jsonApiServiceMock }],
    });

    service = TestBed.inject(TokensService);
  });

  it('getScopes should map response using ScopeMapper', (done) => {
    const mockResponse = { data: [{ type: 'scope' }] as ScopeJsonApi[] };
    const mappedScopes: ScopeModel[] = [{ name: 'mock-scope' }] as any;

    (ScopeMapper.fromResponse as jest.Mock).mockReturnValue(mappedScopes);
    jsonApiServiceMock.get.mockReturnValue(of(mockResponse));

    service.getScopes().subscribe((result) => {
      expect(jsonApiServiceMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/scopes/`);
      expect(result).toBe(mappedScopes);
      done();
    });
  });

  it('getTokens should map each response using TokenMapper.fromGetResponse', (done) => {
    const mockData: TokenGetResponseJsonApi[] = [
      { id: '1' } as TokenGetResponseJsonApi,
      { id: '2' } as TokenGetResponseJsonApi,
    ];
    const mapped = [{ id: '1' }, { id: '2' }] as TokenModel[];

    (TokenMapper.fromGetResponse as jest.Mock).mockImplementation((item) => ({ id: item.id }));

    jsonApiServiceMock.get.mockReturnValue(of({ data: mockData }));

    service.getTokens().subscribe((tokens) => {
      expect(tokens).toEqual(mapped);
      expect(TokenMapper.fromGetResponse).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('getTokenById should map response using TokenMapper.fromGetResponse', (done) => {
    const tokenId = 'abc';
    const mockApiResponse = { data: { id: tokenId } as TokenGetResponseJsonApi };
    const mappedToken = { id: tokenId } as TokenModel;

    (TokenMapper.fromGetResponse as jest.Mock).mockReturnValue(mappedToken);
    jsonApiServiceMock.get.mockReturnValue(of(mockApiResponse));

    service.getTokenById(tokenId).subscribe((token) => {
      expect(jsonApiServiceMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/tokens/${tokenId}/`);
      expect(token).toBe(mappedToken);
      done();
    });
  });

  it('createToken should map response using TokenMapper.fromCreateResponse', (done) => {
    const name = 'new token';
    const scopes = ['read'];
    const requestBody = { name, scopes };

    const apiResponse = { data: { id: 'xyz' } } as JsonApiResponse<TokenCreateResponseJsonApi, null>;
    const mapped = { id: 'xyz' } as TokenModel;

    (TokenMapper.toRequest as jest.Mock).mockReturnValue(requestBody);
    (TokenMapper.fromCreateResponse as jest.Mock).mockReturnValue(mapped);
    jsonApiServiceMock.post.mockReturnValue(of(apiResponse));

    service.createToken(name, scopes).subscribe((token) => {
      expect(jsonApiServiceMock.post).toHaveBeenCalledWith(`${environment.apiUrl}/tokens/`, requestBody);
      expect(token).toEqual(mapped);
      done();
    });
  });

  it('updateToken should map response using TokenMapper.fromCreateResponse', (done) => {
    const tokenId = '123';
    const name = 'updated';
    const scopes = ['write'];
    const requestBody = { name, scopes };

    const apiResponse = { id: tokenId } as TokenCreateResponseJsonApi;
    const mapped = { id: tokenId } as TokenModel;

    (TokenMapper.toRequest as jest.Mock).mockReturnValue(requestBody);
    (TokenMapper.fromCreateResponse as jest.Mock).mockReturnValue(mapped);
    jsonApiServiceMock.patch.mockReturnValue(of(apiResponse));

    service.updateToken(tokenId, name, scopes).subscribe((token) => {
      expect(jsonApiServiceMock.patch).toHaveBeenCalledWith(`${environment.apiUrl}/tokens/${tokenId}/`, requestBody);
      expect(token).toEqual(mapped);
      done();
    });
  });

  it('deleteToken should call jsonApiService.delete with correct URL', (done) => {
    const tokenId = 'delete-me';
    jsonApiServiceMock.delete.mockReturnValue(of(void 0));

    service.deleteToken(tokenId).subscribe((result) => {
      expect(jsonApiServiceMock.delete).toHaveBeenCalledWith(`${environment.apiUrl}/tokens/${tokenId}/`);
      expect(result).toBeUndefined();
      done();
    });
  });
});
