import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { PreprintsMapper } from '@osf/features/preprints/mappers';
import { LicenseOptions } from '@osf/shared/models/license/license.model';
import { PreprintDataJsonApi } from '@osf/shared/models/preprints/preprint-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { PreprintLicensesService } from './preprint-licenses.service';

describe('PreprintLicensesService', () => {
  let service: PreprintLicensesService;
  let jsonApiService: JsonApiServiceMockType;

  const preprintId = 'preprint-1';
  const licenseId = 'license-123';
  const apiResponse = { id: preprintId } as PreprintDataJsonApi;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [PreprintLicensesService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(PreprintLicensesService);
  }

  it('should expose apiUrl from environment', () => {
    setup();

    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('updatePreprintLicense should patch without license_record when options are omitted', async () => {
    setup();
    const mapperSpy = vi.spyOn(PreprintsMapper, 'fromPreprintJsonApi').mockReturnValue(PREPRINT_MOCK);
    jsonApiService.patch.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.updatePreprintLicense(preprintId, licenseId));

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/`, {
      data: {
        type: 'preprints',
        id: preprintId,
        relationships: {
          license: {
            data: {
              id: licenseId,
              type: 'licenses',
            },
          },
        },
        attributes: {},
      },
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(PREPRINT_MOCK);
  });

  it('updatePreprintLicense should patch with license_record when options are provided', async () => {
    setup();
    const licenseOptions: LicenseOptions = {
      copyrightHolders: 'John Doe',
      year: '2023',
    };
    const mapperSpy = vi.spyOn(PreprintsMapper, 'fromPreprintJsonApi').mockReturnValue(PREPRINT_MOCK);
    jsonApiService.patch.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.updatePreprintLicense(preprintId, licenseId, licenseOptions));

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/`, {
      data: {
        type: 'preprints',
        id: preprintId,
        relationships: {
          license: {
            data: {
              id: licenseId,
              type: 'licenses',
            },
          },
        },
        attributes: {
          license_record: {
            copyright_holders: [licenseOptions.copyrightHolders],
            year: licenseOptions.year,
          },
        },
      },
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(PREPRINT_MOCK);
  });
});
