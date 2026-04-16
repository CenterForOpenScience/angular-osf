import { of } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { DataciteEvent } from '@osf/shared/enums/datacite/datacite-event.enum';
import { EnvironmentModel } from '@osf/shared/models/environment.model';
import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';
import { IdentifiersResponseJsonApi } from '@osf/shared/models/identifiers/identifier-json-api.model';

import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

import { DataciteService } from './datacite.service';

describe('Service: Datacite', () => {
  let service: DataciteService;
  let httpMock: HttpTestingController;
  let environment: EnvironmentModel;

  const trackerAddress = 'https://analytics.datacite.org/api/metric';
  const trackerRepoId = 'repo-id';
  const doi = '10.1234/example-doi';

  const trackable = (identifiers: IdentifierModel[]) => of<{ identifiers?: IdentifierModel[] } | null>({ identifiers });
  const setSendBeacon = (value: boolean) => {
    const mock = vi.fn().mockReturnValue(value);
    Object.defineProperty(window.navigator, 'sendBeacon', {
      value: mock,
      configurable: true,
      writable: true,
    });
    return mock;
  };

  const setup = (platformId: 'browser' | 'server' = 'browser') => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp(), DataciteService, { provide: PLATFORM_ID, useValue: platformId }],
    });

    service = TestBed.inject(DataciteService);
    httpMock = TestBed.inject(HttpTestingController);
    environment = TestBed.inject(ENVIRONMENT);
    environment.dataciteTrackerAddress = trackerAddress;
    environment.dataciteTrackerRepoId = trackerRepoId;
  };

  afterEach(() => {
    httpMock.verify();
  });

  it('should expose environment values', () => {
    setup();

    expect(service.apiDomainUrl).toBe(environment.apiDomainUrl);
    expect(service.dataciteTrackerAddress).toBe(trackerAddress);
    expect(service.dataciteTrackerRepoId).toBe(trackerRepoId);
  });

  it('should log identifiable view with sendBeacon when doi exists', () => {
    setup();
    const sendBeaconSpy = setSendBeacon(true);

    let emitted = false;
    service
      .logIdentifiableView(
        trackable([
          { id: '1', type: 'identifiers', category: 'doi', value: doi },
          { id: '2', type: 'identifiers', category: 'doi', value: '10.9999/second-doi' },
        ])
      )
      .subscribe(() => {
        emitted = true;
      });

    expect(emitted).toBe(true);
    expect(sendBeaconSpy).toHaveBeenCalledTimes(1);
    expect(sendBeaconSpy).toHaveBeenCalledWith(
      trackerAddress,
      JSON.stringify({
        n: DataciteEvent.VIEW,
        u: window.location.href,
        i: trackerRepoId,
        p: doi,
      })
    );
  });

  it('should fallback to http post when sendBeacon fails', () => {
    setup();
    const sendBeaconSpy = setSendBeacon(false);
    let emitted = false;

    service
      .logIdentifiableDownload(trackable([{ id: '1', type: 'identifiers', category: 'doi', value: doi }]))
      .subscribe(() => {
        emitted = true;
      });

    const req = httpMock.expectOne(trackerAddress);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.context.get(BYPASS_ERROR_INTERCEPTOR)).toBe(true);
    expect(req.request.body).toEqual({
      n: DataciteEvent.DOWNLOAD,
      u: window.location.href,
      i: trackerRepoId,
      p: doi,
    });
    req.flush({});

    expect(sendBeaconSpy).toHaveBeenCalledTimes(1);
    expect(emitted).toBe(true);
  });

  it('should not log when identifiable has no doi', () => {
    setup();
    const sendBeaconSpy = setSendBeacon(true);
    let emitted = false;
    let completed = false;

    service
      .logIdentifiableView(trackable([{ id: '1', type: 'identifiers', category: 'ark', value: 'ark:/99999/x' }]))
      .subscribe({
        next: () => {
          emitted = true;
        },
        complete: () => {
          completed = true;
        },
      });

    expect(emitted).toBe(false);
    expect(completed).toBe(true);
    expect(sendBeaconSpy).not.toHaveBeenCalled();
  });

  it('should fetch file identifiers and log doi on download', () => {
    setup();
    const sendBeaconSpy = setSendBeacon(true);
    let emitted = false;

    service.logFileDownload('file-123', 'files').subscribe(() => {
      emitted = true;
    });

    const req = httpMock.expectOne(`${environment.apiDomainUrl}/v2/files/file-123/identifiers`);
    expect(req.request.method).toBe('GET');
    const response: IdentifiersResponseJsonApi = {
      data: [
        {
          id: 'id-1',
          type: 'identifiers',
          attributes: { category: 'doi', value: doi },
          embeds: null,
          relationships: null,
          links: null,
        },
      ],
      links: {},
      meta: {
        total: 1,
        per_page: 10,
        version: '2.0',
      },
    };
    req.flush(response);

    expect(emitted).toBe(true);
    expect(sendBeaconSpy).toHaveBeenCalledWith(
      trackerAddress,
      JSON.stringify({
        n: DataciteEvent.DOWNLOAD,
        u: window.location.href,
        i: trackerRepoId,
        p: doi,
      })
    );
  });

  it('should not log when tracker repo id is missing', () => {
    setup();
    environment.dataciteTrackerRepoId = null;
    const sendBeaconSpy = setSendBeacon(true);
    let emitted = false;
    let completed = false;

    service.logIdentifiableView(trackable([{ id: '1', type: 'identifiers', category: 'doi', value: doi }])).subscribe({
      next: () => {
        emitted = true;
      },
      complete: () => {
        completed = true;
      },
    });

    expect(emitted).toBe(false);
    expect(completed).toBe(true);
    expect(sendBeaconSpy).not.toHaveBeenCalled();
  });
});
