import { NgxsModule, Store } from '@ngxs/store';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AddonsService } from '@osf/shared/services/addons/addons.service';

import { GetConfiguredStorageAddons, GetStorageAddons } from './addons.actions';
import { AddonsSelectors } from './addons.selectors';
import { AddonsState } from './addons.state';

import { getConfiguredAddonsData } from '@testing/data/addons/addons.configured.data';
import { getAddonsExternalStorageData } from '@testing/data/addons/addons.external-storage.data';

describe('State: Addons', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AddonsState])],
      providers: [provideHttpClient(), provideHttpClientTesting(), AddonsService],
    });

    store = TestBed.inject(Store);
  });

  describe('getStorageAddons', () => {
    it('should fetch storage addons and update state and selector output', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any[] = [];
        store.dispatch(new GetStorageAddons()).subscribe(() => {
          result = store.selectSnapshot(AddonsSelectors.getStorageAddons);
        });

        const loading = store.selectSignal(AddonsSelectors.getStorageAddonsLoading);
        expect(loading()).toBeTruthy();

        const request = httpMock.expectOne('https://addons.staging4.osf.io/v1/external-storage-services');
        expect(request.request.method).toBe('GET');
        request.flush(getAddonsExternalStorageData());

        expect(result[0]).toEqual(
          Object({
            authUrl: 'https://figshare.com/account/applications/authorize',
            credentialsFormat: 'OAUTH2',
            displayName: 'figshare',
            externalServiceName: 'figshare',
            id: '1d8d9be2-522e-4969-b8fa-bfb45ae13c0d',
            providerName: 'figshare',
            supportedFeatures: ['DOWNLOAD_AS_ZIP', 'FORKING', 'LOGS', 'PERMISSIONS', 'REGISTERING'],
            type: 'external-storage-services',
            wbKey: 'figshare',
          })
        );

        const addon = store.selectSnapshot((state) => AddonsSelectors.getStorageAddon(state.addons, result[0].id));

        expect(addon).toEqual(
          Object({
            authUrl: 'https://figshare.com/account/applications/authorize',
            credentialsFormat: 'OAUTH2',
            displayName: 'figshare',
            externalServiceName: 'figshare',
            id: '1d8d9be2-522e-4969-b8fa-bfb45ae13c0d',
            providerName: 'figshare',
            supportedFeatures: ['DOWNLOAD_AS_ZIP', 'FORKING', 'LOGS', 'PERMISSIONS', 'REGISTERING'],
            type: 'external-storage-services',
            wbKey: 'figshare',
          })
        );
        expect(loading()).toBeFalsy();
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

      const req = httpMock.expectOne('https://addons.staging4.osf.io/v1/external-storage-services');
      expect(req.request.method).toBe('GET');

      req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

      expect(result).toEqual({
        data: [],
        error:
          'Http failure response for https://addons.staging4.osf.io/v1/external-storage-services: 500 Server Error',
        isLoading: false,
        isSubmitting: false,
      });

      expect(loading()).toBeFalsy();
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
          'https://addons.staging4.osf.io/v1/resource-references/reference-id/configured_storage_addons/'
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
            selectedFolderId: '0AIl0aR4C9JAFUk9PVA',
            type: 'configured-storage-addons',
            externalStorageServiceId: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
          })
        );

        expect(loading()).toBeFalsy();
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
          'https://addons.staging4.osf.io/v1/resource-references/reference-id/configured_storage_addons/'
        );
        expect(req.request.method).toBe('GET');

        req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });

        expect(result).toEqual({
          data: [],
          error:
            'Http failure response for https://addons.staging4.osf.io/v1/resource-references/reference-id/configured_storage_addons/: 500 Server Error',
          isLoading: false,
          isSubmitting: false,
        });

        expect(loading()).toBeFalsy();
      }
    ));
  });
});
