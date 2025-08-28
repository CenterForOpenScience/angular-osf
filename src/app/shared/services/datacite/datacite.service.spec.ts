import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/constants/environment.token';
import { DataciteEvent } from '@shared/models/datacite/datacite-event.enum';

import { DataciteService } from './datacite.service';

describe('DataciteService', () => {
  let service: DataciteService;
  let httpMock: HttpTestingController;

  const dataciteTrackerAddress = 'https://tracker.test';
  const dataciteTrackerRepoId = 'repo-123';
  describe('proper configuration', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DataciteService,
          provideHttpClient(), // new style http provider
          provideHttpClientTesting(), // testing provider
          {
            provide: ENVIRONMENT,
            useValue: {
              dataciteTrackerRepoId,
              dataciteTrackerAddress,
            },
          },
        ],
      });

      service = TestBed.inject(DataciteService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('logView should POST with correct payload', () => {
      const doi = '10.1234/abcd';
      service.logView(doi).subscribe();

      const req = httpMock.expectOne(dataciteTrackerAddress);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        n: DataciteEvent.VIEW,
        u: window.location.href,
        i: dataciteTrackerRepoId,
        p: doi,
      });
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({});
    });

    it('logDownload should POST with correct payload', () => {
      const doi = '10.1234/abcd';
      service.logDownload(doi).subscribe();

      const req = httpMock.expectOne(dataciteTrackerAddress);
      expect(req.request.body).toEqual({
        n: DataciteEvent.DOWNLOAD,
        u: window.location.href,
        i: dataciteTrackerRepoId,
        p: doi,
      });
      req.flush({});
    });

    it('should return EMPTY when doi is missing', (done: () => void) => {
      service.logView('').subscribe({
        complete: () => done(),
      });
      httpMock.expectNone(dataciteTrackerAddress);
    });

    it('should return EMPTY when doi is missing', (done: () => void) => {
      service.logView('').subscribe({
        complete: () => done(),
      });
      httpMock.expectNone(dataciteTrackerAddress);
    });
  });

  describe('', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DataciteService,
          provideHttpClient(), // new style http provider
          provideHttpClientTesting(), // testing provider
          {
            provide: ENVIRONMENT,
            useValue: {
              dataciteTrackerRepoId: null,
              dataciteTrackerAddress: dataciteTrackerAddress,
            },
          },
        ],
      });

      service = TestBed.inject(DataciteService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it('should return EMPTY when dataciteTrackerdataciteTrackerRepoId is missing', (done: () => void) => {
      service.logView('10.1234/abcd').subscribe({
        complete: () => done(),
      });
      httpMock.expectNone(dataciteTrackerAddress);
    });
  });
});
