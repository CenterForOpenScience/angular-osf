import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { RegistrationMapper } from '@osf/shared/mappers/registration';
import { LicenseOptions } from '@osf/shared/models/license/license.model';
import { DraftRegistrationModel } from '@osf/shared/models/registration/draft-registration.model';
import { DraftRegistrationDataJsonApi } from '@osf/shared/models/registration/registration-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { MOCK_DRAFT_REGISTRATION } from '@testing/mocks/registries.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { RegistrationsLicenseService } from './registrations-licenses.service';

describe('RegistrationsLicenseService', () => {
  let service: RegistrationsLicenseService;
  let jsonApiService: JsonApiServiceMockType;

  const registrationId = 'draft-1';
  const licenseId = 'license-123';
  const apiResponse = { id: registrationId } as DraftRegistrationDataJsonApi;
  const mappedDraft = MOCK_DRAFT_REGISTRATION as DraftRegistrationModel;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [RegistrationsLicenseService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(RegistrationsLicenseService);
  }

  it('should expose apiUrl from environment', () => {
    setup();

    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('updateLicense should patch with empty node_license when options are omitted', async () => {
    setup();
    const mapperSpy = vi.spyOn(RegistrationMapper, 'fromDraftRegistrationResponse').mockReturnValue(mappedDraft);
    jsonApiService.patch.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.updateLicense(registrationId, licenseId));

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/draft_registrations/${registrationId}/`, {
      data: {
        type: 'draft_registrations',
        id: registrationId,
        relationships: {
          license: {
            data: {
              id: licenseId,
              type: 'licenses',
            },
          },
        },
        attributes: {
          node_license: {
            copyright_holders: [],
            year: '',
          },
        },
      },
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(mappedDraft);
  });

  it('updateLicense should patch with node_license when options are provided', async () => {
    setup();
    const licenseOptions: LicenseOptions = {
      copyrightHolders: 'John Doe',
      year: '2023',
    };
    const mapperSpy = vi.spyOn(RegistrationMapper, 'fromDraftRegistrationResponse').mockReturnValue(mappedDraft);
    jsonApiService.patch.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.updateLicense(registrationId, licenseId, licenseOptions));

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/draft_registrations/${registrationId}/`, {
      data: {
        type: 'draft_registrations',
        id: registrationId,
        relationships: {
          license: {
            data: {
              id: licenseId,
              type: 'licenses',
            },
          },
        },
        attributes: {
          node_license: {
            copyright_holders: [licenseOptions.copyrightHolders],
            year: licenseOptions.year,
          },
        },
      },
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(mappedDraft);
  });
});
