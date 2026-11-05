import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { LicensesMapper } from '@osf/shared/mappers/licenses.mapper';
import { LicenseResponseJsonApi, LicensesResponseJsonApi } from '@osf/shared/models/license/licenses-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { LicensesService } from './licenses.service';

describe('LicensesService', () => {
  let service: LicensesService;
  let jsonApiService: JsonApiServiceMockType;

  beforeEach(() => {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [LicensesService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(LicensesService);
  });

  it('should expose apiUrl from environment', () => {
    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('getLicenses should request licenses with sort and map response', async () => {
    const licensesUrl = `${MOCK_API_URL}/licenses/`;
    const apiResponse = { data: [] } as unknown as LicensesResponseJsonApi;
    const mapperSpy = vi.spyOn(LicensesMapper, 'fromLicensesResponse').mockReturnValue([MOCK_LICENSE]);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getLicenses(licensesUrl));

    expect(jsonApiService.get).toHaveBeenCalledWith(licensesUrl, {
      'page[size]': 100,
      sort: 'name',
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual([MOCK_LICENSE]);
  });

  it('getLicenseById should request license and map response', async () => {
    const licenseId = MOCK_LICENSE.id;
    const licenseApiResponse = { data: { id: licenseId } } as LicenseResponseJsonApi;
    const mapperSpy = vi.spyOn(LicensesMapper, 'fromLicenseDataJsonApi').mockReturnValue(MOCK_LICENSE);
    jsonApiService.get.mockReturnValue(of(licenseApiResponse));

    const response = await firstValueFrom(service.getLicenseById(licenseId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/licenses/${licenseId}/`);
    expect(mapperSpy).toHaveBeenCalledWith(licenseApiResponse.data);
    expect(response).toEqual(MOCK_LICENSE);
  });
});
