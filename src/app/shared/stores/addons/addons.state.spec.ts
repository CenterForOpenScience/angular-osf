import { provideStore, Store } from '@ngxs/store';

import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AddonsService } from '@osf/shared/services/addons/addons.service';

import {
  GetAuthorizedStorageAddons,
  GetAuthorizedStorageOauthToken,
  GetConfiguredStorageAddons,
  GetStorageAddons,
} from './addons.actions';
import { AddonsSelectors } from './addons.selectors';
import { AddonsState } from './addons.state';

import { getAddonsAuthorizedStorageData } from '@testing/data/addons/addons.authorized-storage.data';
import { getConfiguredAddonsData } from '@testing/data/addons/addons.configured.data';
import { getAddonsExternalStorageData } from '@testing/data/addons/addons.external-storage.data';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('State: Addons', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [provideStore([AddonsState]), AddonsService],
    });

    store = TestBed.inject(Store);
  });

  describe('getStorageAddons', () => {
    it('should fetch storage addons and update state and selector output', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any[] | null = [];
        store.dispatch(new GetStorageAddons()).subscribe(() => {
          result = store.selectSnapshot(AddonsSelectors.getStorageAddons);
        });

        const loading = store.selectSignal(AddonsSelectors.getStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        const request = httpMock.expectOne('http://addons.localhost:8000/external-storage-services');
        expect(request.request.method).toBe('GET');
        request.flush(getAddonsExternalStorageData());

        expect(result[0]).toEqual(
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

        const addon = store.selectSnapshot(AddonsSelectors.getStorageAddon(result[0].id));

        expect(addon).toEqual(
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
        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));

    it('should handle error if getAddons fails', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      let result: any = null;

      store.dispatch(new GetStorageAddons()).subscribe({
        next: () => {
          result = 'Expected error, but got success';
        },
        error: () => {
          result = store.snapshot().addons.storageAddons;
        },
      });

      const loading = store.selectSignal(AddonsSelectors.getStorageAddonsLoading);
      expect(loading()).toBeTruthy();

      const req = httpMock.expectOne('http://addons.localhost:8000/external-storage-services');
      expect(req.request.method).toBe('GET');

      req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

      expect(result).toEqual({
        data: null,
        error: 'Http failure response for http://addons.localhost:8000/external-storage-services: 500 Server Error',
        isLoading: false,
        isSubmitting: false,
      });

      expect(loading()).toBeFalsy();
      expect(httpMock.verify).toBeTruthy();
    }));
  });

  describe('getConfiguredStorageAddons', () => {
    it('should fetch configured storage addons and update state and selector output', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any[] = [];
        store.dispatch(new GetConfiguredStorageAddons('reference-id')).subscribe(() => {
          result = store.selectSnapshot(AddonsSelectors.getConfiguredStorageAddons);
        });

        const loading = store.selectSignal(AddonsSelectors.getConfiguredStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        const request = httpMock.expectOne(
          'http://addons.localhost:8000/resource-references/reference-id/configured_storage_addons/'
        );
        expect(request.request.method).toBe('GET');
        request.flush(getConfiguredAddonsData());

        expect(result[0]).toEqual(
          Object({
            baseAccountId: '62ed6dd7-f7b7-4003-b7b4-855789c1f991',
            baseAccountType: 'authorized-storage-accounts',
            connectedCapabilities: ['ACCESS', 'UPDATE'],
            connectedOperationNames: ['list_child_items', 'list_root_items', 'get_item_info'],
            currentUserIsOwner: true,
            displayName: 'Google Drive',
            externalServiceName: 'googledrive',
            id: '756579dc-3a24-4849-8866-698a60846ac3',
            resourceType: undefined,
            rootFolderId: '0AIl0aR4C9JAFUk9PVA',
            selectedStorageItemId: '0AIl0aR4C9JAFUk9PVA',
            targetUrl: undefined,
            type: 'configured-storage-addons',
            externalStorageServiceId: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
          })
        );

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));

    it('should handle error if getConfiguredStorageAddons fails', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any = null;

        store.dispatch(new GetConfiguredStorageAddons('reference-id')).subscribe({
          next: () => {
            result = 'Expected error, but got success';
          },
          error: () => {
            result = store.snapshot().addons.configuredStorageAddons;
          },
        });

        const loading = store.selectSignal(AddonsSelectors.getConfiguredStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        const req = httpMock.expectOne(
          'http://addons.localhost:8000/resource-references/reference-id/configured_storage_addons/'
        );
        expect(req.request.method).toBe('GET');

        req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

        expect(result).toEqual({
          data: [],
          error:
            'Http failure response for http://addons.localhost:8000/resource-references/reference-id/configured_storage_addons/: 500 Server Error',
          isLoading: false,
          isSubmitting: false,
        });

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));
  });

  describe('getAuthorizedStorageAddons', () => {
    it('should fetch authorized storage oauth token and add state and selector output', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any[] = [];
        store.dispatch(new GetAuthorizedStorageAddons('reference-id')).subscribe(() => {
          result = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddons);
        });

        const loading = store.selectSignal(AddonsSelectors.getAuthorizedStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        const request = httpMock.expectOne(
          'http://addons.localhost:8000/user-references/reference-id/authorized_storage_accounts/?include=external-storage-service&fields%5Bexternal-storage-services%5D=external_service_name,credentials_format'
        );
        expect(request.request.method).toBe('GET');
        request.flush(getAddonsAuthorizedStorageData());

        expect(result[0]).toEqual(
          Object({
            accountOwnerId: '0b441148-83e5-4f7f-b302-b07b528b160b',
            apiBaseUrl: 'https://www.googleapis.com',
            authUrl: null,
            authorizedCapabilities: ['ACCESS', 'UPDATE'],
            authorizedOperationNames: ['list_root_items', 'get_item_info', 'list_child_items'],
            credentialsAvailable: true,
            credentialsFormat: '',
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

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));

    it('should handle error if getAuthorizedStorageOauthToken fails', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any = null;

        store.dispatch(new GetAuthorizedStorageAddons('reference-id')).subscribe({
          next: () => {
            result = 'Expected error, but got success';
          },
          error: () => {
            result = store.snapshot().addons.authorizedStorageAddons;
          },
        });

        const loading = store.selectSignal(AddonsSelectors.getAuthorizedStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        const request = httpMock.expectOne(
          'http://addons.localhost:8000/user-references/reference-id/authorized_storage_accounts/?include=external-storage-service&fields%5Bexternal-storage-services%5D=external_service_name,credentials_format'
        );
        expect(request.request.method).toBe('GET');

        request.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

        expect(result).toEqual({
          data: [],
          error:
            'Http failure response for http://addons.localhost:8000/user-references/reference-id/authorized_storage_accounts/?include=external-storage-service&fields%5Bexternal-storage-services%5D=external_service_name,credentials_format: 500 Server Error',
          isLoading: false,
          isSubmitting: false,
        });

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));
  });

  describe('getAuthorizedStorageOauthToken', () => {
    it('should fetch authorized storage oauth token and add state and selector output', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any[] = [];
        store.dispatch(new GetAuthorizedStorageOauthToken('account-id', 'storage')).subscribe(() => {
          result = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddons);
        });

        const loading = store.selectSignal(AddonsSelectors.getAuthorizedStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        const request = httpMock.expectOne('http://addons.localhost:8000/authorized-storage-accounts/account-id');
        expect(request.request.method).toBe('PATCH');
        request.flush(getAddonsAuthorizedStorageData(0));

        expect(result[0]).toEqual(
          Object({
            accountOwnerId: '0b441148-83e5-4f7f-b302-b07b528b160b',
            apiBaseUrl: 'https://www.googleapis.com',
            authUrl: null,
            authorizedCapabilities: ['ACCESS', 'UPDATE'],
            authorizedOperationNames: ['list_root_items', 'get_item_info', 'list_child_items'],
            credentialsAvailable: true,
            credentialsFormat: '',
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

        const oauthToken = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddonOauthToken(result[0].id));

        expect(oauthToken).toBe('ya29.A0AS3H6NzDCKgrUx');

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));

    it('should fetch authorized storage oauth token and update state and selector output', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any[] = [];
        store.dispatch(new GetAuthorizedStorageAddons('reference-id')).subscribe();

        store.dispatch(new GetAuthorizedStorageOauthToken('account-id', 'storage')).subscribe(() => {
          result = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddons);
        });

        const loading = store.selectSignal(AddonsSelectors.getAuthorizedStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        let request = httpMock.expectOne(
          'http://addons.localhost:8000/user-references/reference-id/authorized_storage_accounts/?include=external-storage-service&fields%5Bexternal-storage-services%5D=external_service_name,credentials_format'
        );
        expect(request.request.method).toBe('GET');
        request.flush(getAddonsAuthorizedStorageData());

        request = httpMock.expectOne('http://addons.localhost:8000/authorized-storage-accounts/account-id');
        expect(request.request.method).toBe('PATCH');
        const addonWithToken = getAddonsAuthorizedStorageData(1);
        addonWithToken.data.attributes.oauth_token = 'ya2.34234324534';
        request.flush(addonWithToken);

        expect(result[1]).toEqual(
          Object({
            accountOwnerId: '0b441148-83e5-4f7f-b302-b07b528b160b',
            apiBaseUrl: 'https://www.googleapis.com',
            authUrl: null,
            authorizedCapabilities: ['ACCESS', 'UPDATE'],
            authorizedOperationNames: ['list_root_items', 'get_item_info', 'list_child_items'],
            credentialsAvailable: true,
            credentialsFormat: '',
            defaultRootFolder: '',
            displayName: 'Google Drive',
            externalServiceName: '',
            externalStorageServiceId: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
            id: '62ed6dd7-f7b7-4003-b7b4-855789c1f991',
            oauthToken: 'ya2.34234324534',
            providerName: '',
            supportedFeatures: [],
            type: 'authorized-storage-accounts',
          })
        );

        let oauthToken = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddonOauthToken(result[0].id));
        expect(oauthToken).toBe('ya29.A0AS3H6NzDCKgrUx');

        oauthToken = store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddonOauthToken(result[1].id));
        expect(oauthToken).toBe(result[1].oauthToken);

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));

    it('should handle error if getAuthorizedStorageOauthToken fails', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any = null;

        store.dispatch(new GetAuthorizedStorageOauthToken('account-id', 'storage')).subscribe({
          next: () => {
            result = 'Expected error, but got success';
          },
          error: () => {
            result = store.snapshot().addons.authorizedStorageAddons;
          },
        });

        const loading = store.selectSignal(AddonsSelectors.getAuthorizedStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        const req = httpMock.expectOne('http://addons.localhost:8000/authorized-storage-accounts/account-id');
        expect(req.request.method).toBe('PATCH');

        req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

        expect(result).toEqual({
          data: [],
          error:
            'Http failure response for http://addons.localhost:8000/authorized-storage-accounts/account-id: 500 Server Error',
          isLoading: false,
          isSubmitting: false,
        });

        expect(loading()).toBeFalsy();
        expect(httpMock.verify).toBeTruthy();
      }
    ));
  });
});
