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
  describe('with proper configuration', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DataciteService,
          provideHttpClient(),
          provideHttpClientTesting(),
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

    it('logView should POST with correct payload', () => {
      const doi = '10.1234/abcd';
      service.logView(doi).subscribe({
        next: (result) => expect(result).toBeUndefined(),
      });

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
      service.logDownload(doi).subscribe({
        next: (result) => expect(result).toBeUndefined(),
      });

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
        next: (result) => expect(result).toBeUndefined(),
        complete: () => done(),
      });
      httpMock.expectNone(dataciteTrackerAddress);
    });
  });

  describe('on local setup (without dataciteTrackerRepoId configured)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DataciteService,
          provideHttpClient(),
          provideHttpClientTesting(),
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

    it('should return EMPTY when dataciteTrackerRepoId is missing', (done: () => void) => {
      service.logView('10.1234/abcd').subscribe({
        next: (result) => expect(result).toBeUndefined(),
        complete: () => done(),
      });
      httpMock.expectNone(dataciteTrackerAddress);
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
