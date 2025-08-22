import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AddonsService } from './addons.service';

import { getAddonsExternalStorageData } from '@testing/data/addons/addons.external-storage.data';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Service: Addons', () => {
  let service: AddonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [AddonsService],
    });

    service = TestBed.inject(AddonsService);
  });

  it('should test getAddons', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let results: any[] = [];
    service.getAddons('storage').subscribe((result) => {
      results = result;
    });

    const request = httpMock.expectOne('https://addons.staging4.osf.io/v1/external-storage-services');
    expect(request.request.method).toBe('GET');
    request.flush(getAddonsExternalStorageData());

    expect(results[0]).toEqual(
      Object({
        authUrl: 'https://figshare.com/account/applications/authorize',
        credentialsFormat: 'OAUTH2',
        displayName: 'figshare',
        externalServiceName: 'figshare',
        id: '1d8d9be2-522e-4969-b8fa-bfb45ae13c0d',
        providerName: 'figshare',
        supportedFeatures: ['DOWNLOAD_AS_ZIP', 'FORKING', 'LOGS', 'PERMISSIONS', 'REGISTERING'],
        type: 'external-storage-services',
      })
    );
  }));
});
