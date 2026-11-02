import { firstValueFrom } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { UserMapper } from '@osf/shared/mappers/user';

import { getUserDataJsonApi } from '@testing/data/user/user.data';
import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

import { AccountSettingsMapper, MapExternalIdentities } from '../mappers';
import { AccountSettingsDataJsonApi, AccountSettingsResponseJsonApi, ListIdentitiesResponseJsonApi } from '../models';

import { AccountSettingsService } from './account-settings.service';

describe('AccountSettingsService', () => {
  let service: AccountSettingsService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8000/v2';
  const userId = 'user-1';

  const accountSettingsData: AccountSettingsDataJsonApi = {
    id: userId,
    type: 'user-settings',
    attributes: {
      two_factor_enabled: true,
      two_factor_confirmed: false,
      subscribe_osf_general_email: true,
      subscribe_osf_help_email: false,
      deactivation_requested: false,
      contacted_deactivation: false,
      secret: 'secret-value',
    },
  };

  const identitiesResponse: ListIdentitiesResponseJsonApi = {
    data: [
      {
        id: 'orcid',
        type: 'external-identities',
        attributes: {
          external_id: '0000-0001-2345-6789',
          status: 'verified',
        },
      },
    ],
    meta: {
      total: 1,
      per_page: 10,
      version: '2.0',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp(), AccountSettingsService],
    });

    service = TestBed.inject(AccountSettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should expose the api url from the environment', () => {
    expect(service.apiUrl).toBe(apiUrl);
  });

  it('should get account settings', async () => {
    const response: AccountSettingsResponseJsonApi = { data: accountSettingsData };
    const resultPromise = firstValueFrom(service.getSettings());

    const req = httpMock.expectOne(`${apiUrl}/users/me/settings/`);
    expect(req.request.method).toBe('GET');
    req.flush(response);

    await expect(resultPromise).resolves.toEqual(AccountSettingsMapper.getAccountSettings(accountSettingsData));
  });

  it('should update account settings', async () => {
    const settings = { subscribe_osf_general_email: 'true' };
    const resultPromise = firstValueFrom(service.updateSettings(userId, settings));

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}/settings/`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      data: {
        id: userId,
        attributes: settings,
        type: 'user_settings',
      },
    });
    req.flush({ data: accountSettingsData });

    await expect(resultPromise).resolves.toEqual(AccountSettingsMapper.getAccountSettings(accountSettingsData));
  });

  it('should update location', async () => {
    const userData = getUserDataJsonApi();
    const resultPromise = firstValueFrom(service.updateLocation(userId, 'us'));

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}/`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      data: {
        id: userId,
        attributes: {},
        relationships: {
          default_region: {
            data: {
              type: 'regions',
              id: 'us',
            },
          },
        },
        type: 'users',
      },
    });
    req.flush({ data: userData });

    await expect(resultPromise).resolves.toEqual(UserMapper.fromUserGetResponse(userData));
  });

  it('should update indexing', async () => {
    const userData = getUserDataJsonApi();
    const resultPromise = firstValueFrom(service.updateIndexing(userId, false));

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}/`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      data: {
        id: userId,
        attributes: {
          allow_indexing: false,
        },
        relationships: {},
        type: 'users',
      },
    });
    req.flush({ data: userData });

    await expect(resultPromise).resolves.toEqual(UserMapper.fromUserGetResponse(userData));
  });

  it('should update password', async () => {
    const resultPromise = firstValueFrom(service.updatePassword('old-pass', 'new-pass'));

    const req = httpMock.expectOne(`${apiUrl}/users/me/settings/password/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      data: {
        type: 'user_passwords',
        attributes: {
          existing_password: 'old-pass',
          new_password: 'new-pass',
        },
      },
    });
    req.flush(null);

    await expect(resultPromise).resolves.toBeNull();
  });

  it('should get external identities', async () => {
    const resultPromise = firstValueFrom(service.getExternalIdentities());

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${apiUrl}/users/me/settings/identities/` &&
        request.params.get('page') === '1' &&
        request.params.get('page[size]') === '10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(identitiesResponse);

    await expect(resultPromise).resolves.toEqual(MapExternalIdentities(identitiesResponse.data));
  });

  it('should delete an external identity with the error interceptor bypassed', async () => {
    const resultPromise = firstValueFrom(service.deleteExternalIdentity('orcid'));

    const req = httpMock.expectOne(`${apiUrl}/users/me/settings/identities/orcid/`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.context.get(BYPASS_ERROR_INTERCEPTOR)).toBe(true);
    req.flush(null);

    await expect(resultPromise).resolves.toBeNull();
  });
});
