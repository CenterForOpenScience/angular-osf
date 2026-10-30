import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
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

  const defaultProvider = 'osf';
  const apiResponse = { data: [] } as unknown as LicensesResponseJsonApi;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [
        LicensesService,
        MockProvider(JsonApiService, jsonApiService),
        provideMockEnvironment({ defaultProvider }),
      ],
    });

    service = TestBed.inject(LicensesService);
  }

  it('should expose apiUrl from environment', () => {
    setup();

    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('should expose defaultProvider from environment', () => {
    setup();

    expect(service.defaultProvider).toBe(defaultProvider);
  });

  it('getLicenses should request project licenses with sort', async () => {
    setup();
    const mapperSpy = vi.spyOn(LicensesMapper, 'fromLicensesResponse').mockReturnValue([MOCK_LICENSE]);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getLicenses(ResourceType.Project));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/licenses/`, {
      'page[size]': 100,
      sort: 'name',
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual([MOCK_LICENSE]);
  });

  it('getLicenses should request registration licenses for provider with sort', async () => {
    setup();
    const providerId = 'provider-1';
    const mapperSpy = vi.spyOn(LicensesMapper, 'fromLicensesResponse').mockReturnValue([MOCK_LICENSE]);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getLicenses(ResourceType.Registration, providerId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/providers/registrations/${providerId}/licenses/`, {
      'page[size]': 100,
      sort: 'name',
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual([MOCK_LICENSE]);
  });

  it('getLicenses should request preprint licenses with default provider and sort', async () => {
    setup();
    const mapperSpy = vi.spyOn(LicensesMapper, 'fromLicensesResponse').mockReturnValue([MOCK_LICENSE]);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getLicenses(ResourceType.Preprint));

    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/providers/preprints/${defaultProvider}/licenses/`,
      {
        'page[size]': 100,
        sort: 'name',
      }
    );
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual([MOCK_LICENSE]);
  });

  it('getLicenses should request collection licenses with sort', async () => {
    setup();
    const providerId = 'collection-provider';
    const mapperSpy = vi.spyOn(LicensesMapper, 'fromLicensesResponse').mockReturnValue([MOCK_LICENSE]);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getLicenses(ResourceType.Collection, providerId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/providers/collections/${providerId}/licenses/`, {
      'page[size]': 100,
      sort: 'name',
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual([MOCK_LICENSE]);
  });

  it('getLicenseById should request license and map response', async () => {
    setup();
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
