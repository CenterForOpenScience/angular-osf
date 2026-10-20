import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { AccountSettingsService } from './account-settings.service';

describe('AccountSettingsService', () => {
  let service: AccountSettingsService;
  let jsonApiService: JsonApiServiceMockType;

  beforeEach(() => {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [
        AccountSettingsService,
        provideMockEnvironment(),
        { provide: JsonApiService, useValue: jsonApiService },
      ],
    });

    service = TestBed.inject(AccountSettingsService);
  });

  it('should delete an external identity with the error interceptor bypassed', () => {
    service.deleteExternalIdentity('orcid').subscribe();

    expect(jsonApiService.delete).toHaveBeenCalledTimes(1);
    const [url, , , context] = jsonApiService.delete.mock.calls[0];
    expect(url).toBe(`${MOCK_API_URL}/users/me/settings/identities/orcid/`);
    expect(context?.get(BYPASS_ERROR_INTERCEPTOR)).toBe(true);
  });
});
