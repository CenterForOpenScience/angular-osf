import { firstValueFrom } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { UserSelectors } from '@core/store/user';
import { AuthorizedAddonRequestJsonApi } from '@osf/shared/models/addons/authorized-addon-json-api.model';
import { UserModel } from '@osf/shared/models/user/user.model';

import { getAddonsAuthorizedStorageData } from '@testing/data/addons/addons.authorized-storage.data';
import { getConfiguredAddonsData } from '@testing/data/addons/addons.configured.data';
import { getAddonsExternalStorageData } from '@testing/data/addons/addons.external-storage.data';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { AddonsService } from './addons.service';

describe('Service: Addons', () => {
  let service: AddonsService;
  let httpMock: HttpTestingController;

  function setup(currentUser: UserModel | null = null) {
    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideOSFHttp(),
        provideMockStore({
          signals: [{ selector: UserSelectors.getCurrentUser, value: currentUser }],
        }),
        AddonsService,
      ],
    });

    service = TestBed.inject(AddonsService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should test getAddons', async () => {
    setup();

    const resultsPromise = firstValueFrom(service.getAddons('storage'));
    const request = httpMock.expectOne('http://addons.localhost:8000/external-storage-services');
    expect(request.request.method).toBe('GET');
    request.flush(getAddonsExternalStorageData());

    const results = await resultsPromise;
    expect(results[0]).toEqual(
      Object({
        authUrl: 'https://figshare.com/account/applications/authorize',
        credentialsFormat: 'OAUTH2',
        displayName: 'figshare',
        externalServiceName: 'figshare',
        iconUrl: 'https://addons.staging4.osf.io/static/provider_icons/figshare.svg',
        id: '1d8d9be2-522e-4969-b8fa-bfb45ae13c0d',
        providerName: 'figshare',
        supportedFeatures: ['DOWNLOAD_AS_ZIP', 'FORKING', 'LOGS', 'PERMISSIONS', 'REGISTERING'],
        type: 'external-storage-services',
        wbKey: 'figshare',
        configurableApiRoot: false,
      })
    );
  });

  it('should test getConfigureAddons', async () => {
    setup();

    const resultsPromise = firstValueFrom(service.getConfiguredAddons('storage', 'reference-id'));
    const request = httpMock.expectOne(
      'http://addons.localhost:8000/resource-references/reference-id/configured_storage_addons/?include=external-storage-service&fields%5Bexternal-storage-services%5D=external_service_name,credentials_format,icon_url'
    );
    expect(request.request.method).toBe('GET');
    request.flush(getConfiguredAddonsData());

    const results = await resultsPromise;
    expect(results[0]).toEqual(
      Object({
        baseAccountId: '62ed6dd7-f7b7-4003-b7b4-855789c1f991',
        baseAccountType: 'authorized-storage-accounts',
        connectedCapabilities: ['ACCESS', 'UPDATE'],
        connectedOperationNames: ['list_child_items', 'list_root_items', 'get_item_info'],
        externalStorageServiceId: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
        currentUserIsOwner: true,
        displayName: 'Google Drive',
        rootFolderId: '0AIl0aR4C9JAFUk9PVA',
        externalServiceName: 'googledrive',
        id: '756579dc-3a24-4849-8866-698a60846ac3',
        resourceType: undefined,
        selectedStorageItemId: '0AIl0aR4C9JAFUk9PVA',
        targetUrl: undefined,
        type: 'configured-storage-addons',
        iconUrl: 'https://osf.io/assets/images/logo.svg',
      })
    );
  });

  it('should test getAuthorizedAddons', async () => {
    setup();

    const resultsPromise = firstValueFrom(service.getAuthorizedAddons('storage', 'reference-id'));
    const request = httpMock.expectOne(
      'http://addons.localhost:8000/user-references/reference-id/authorized_storage_accounts/?include=external-storage-service&fields%5Bexternal-storage-services%5D=external_service_name,credentials_format,icon_url'
    );
    expect(request.request.method).toBe('GET');
    request.flush(getAddonsAuthorizedStorageData());

    const results = await resultsPromise;
    expect(results[0]).toEqual(
      Object({
        accountOwnerId: '0b441148-83e5-4f7f-b302-b07b528b160b',
        apiBaseUrl: 'https://www.googleapis.com',
        authUrl: null,
        authorizedCapabilities: ['ACCESS', 'UPDATE'],
        authorizedOperationNames: ['list_root_items', 'get_item_info', 'list_child_items'],
        credentialsAvailable: true,
        credentialsFormat: 'OAUTH2',
        iconUrl: 'https://osf.io/assets/images/logo.svg',
        defaultRootFolder: '',
        displayName: 'Google Drive',
        externalServiceName: 'googledrive',
        oauthToken: 'ya29.A0AS3H6NzDCKgrUx',
        externalStorageServiceId: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
        id: '331b7333-a13a-4d3b-add0-5af0fd1d4ac4',
        providerName: '',
        supportedFeatures: [],
        type: 'authorized-storage-accounts',
      })
    );
  });

  it('should error when getAddonsUserReference has no current user', async () => {
    setup(null);

    await expect(firstValueFrom(service.getAddonsUserReference())).rejects.toThrow('Current user not found');
  });

  it('should fetch getAddonsUserReference for the current user', async () => {
    setup(MOCK_USER);

    const resultsPromise = firstValueFrom(service.getAddonsUserReference());
    const request = httpMock.expectOne(
      (req) =>
        req.url === 'http://addons.localhost:8000/user-references/' &&
        req.params.get('filter[user_uri]') === `http://localhost:4200/${MOCK_USER.id}`
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      data: [
        {
          id: 'user-ref-1',
          type: 'user-references',
          attributes: { user_uri: `http://localhost:4200/${MOCK_USER.id}` },
        },
      ],
    });

    await expect(resultsPromise).resolves.toEqual([
      {
        id: 'user-ref-1',
        userUri: `http://localhost:4200/${MOCK_USER.id}`,
      },
    ]);
  });

  it('should test getAuthorizedStorageOauthToken', async () => {
    setup();

    const resultsPromise = firstValueFrom(service.getAuthorizedStorageOauthToken('account-id', 'storage'));
    const request = httpMock.expectOne('http://addons.localhost:8000/authorized-storage-accounts/account-id');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.context.get(BYPASS_ERROR_INTERCEPTOR)).toBe(true);
    expect(request.request.body).toEqual(
      Object({
        data: Object({
          attributes: Object({
            serialize_oauth_token: 'true',
          }),
          id: 'account-id',
          type: 'authorized-storage-accounts',
        }),
      })
    );
    request.flush(getAddonsAuthorizedStorageData(0));

    await expect(resultsPromise).resolves.toEqual(
      Object({
        accountOwnerId: '0b441148-83e5-4f7f-b302-b07b528b160b',
        apiBaseUrl: 'https://www.googleapis.com',
        authUrl: null,
        authorizedCapabilities: ['ACCESS', 'UPDATE'],
        authorizedOperationNames: ['list_root_items', 'get_item_info', 'list_child_items'],
        credentialsAvailable: true,
        credentialsFormat: '',
        iconUrl: '',
        defaultRootFolder: '',
        displayName: 'Google Drive',
        externalServiceName: '',
        oauthToken: 'ya29.A0AS3H6NzDCKgrUx',
        externalStorageServiceId: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
        id: '331b7333-a13a-4d3b-add0-5af0fd1d4ac4',
        providerName: '',
        supportedFeatures: [],
        type: 'authorized-storage-accounts',
      })
    );
  });

  it('should update authorized addon with the full response document', async () => {
    setup();

    const payload = {
      data: {
        type: 'authorized-storage-accounts',
        attributes: {
          api_base_url: 'https://www.googleapis.com',
          auth_url: null,
          authorized_capabilities: ['ACCESS'],
          credentials: {},
          credentials_available: true,
          display_name: 'Google Drive',
          initiate_oauth: false,
        },
        relationships: {},
      },
    } as AuthorizedAddonRequestJsonApi;

    const resultsPromise = firstValueFrom(service.updateAuthorizedAddon(payload, 'storage', 'account-id'));
    const request = httpMock.expectOne(
      'http://addons.localhost:8000/authorized-storage-accounts/account-id/?include=external-storage-service'
    );
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(payload);
    request.flush(getAddonsAuthorizedStorageData(0));

    const result = await resultsPromise;
    expect(result.id).toBe('331b7333-a13a-4d3b-add0-5af0fd1d4ac4');
    expect(result.displayName).toBe('Google Drive');
  });
});
