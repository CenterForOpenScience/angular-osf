import { Observable, take } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/factory/environment.factory';
import { Identifier } from '@shared/models';
import { DataciteEvent } from '@shared/models/datacite/datacite-event.enum';

import { DataciteService } from './datacite.service';

function buildObservable(doi: string) {
  return new Observable<{ identifiers?: Identifier[] } | null>((subscriber) => {
    subscriber.next({});
    subscriber.next({ identifiers: [] });
    subscriber.next({
      identifiers: [
        {
          category: 'doi',
          value: doi,
          id: '',
          type: 'identifier',
        },
      ],
    });
    subscriber.next({
      identifiers: [
        {
          category: 'doi',
          value: 'other doi',
          id: '',
          type: 'identifier',
        },
      ],
    });
    subscriber.complete();
  });
}

function assertSuccess(
  httpMock: HttpTestingController,
  dataciteTrackerAddress: string,
  dataciteTrackerRepoId: string,
  doi: string,
  event: DataciteEvent
) {
  const req = httpMock.expectOne(dataciteTrackerAddress);
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual({
    n: event,
    u: window.location.href,
    i: dataciteTrackerRepoId,
    p: doi,
  });
  expect(req.request.headers.get('Content-Type')).toBe('application/json');
  req.flush({});
}

describe('DataciteService', () => {
  let service: DataciteService;
  let httpMock: HttpTestingController;

  const dataciteTrackerAddress = 'https://tracker.test';
  const webUrl = 'https://osf.io';
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
              webUrl,
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

    it('logIdentifiableView should POST with correct payload', () => {
      const doi = '10.1234/abcd';
      const observable = buildObservable(doi);
      service.logIdentifiableView(observable).subscribe();
      assertSuccess(httpMock, dataciteTrackerAddress, dataciteTrackerRepoId, doi, DataciteEvent.VIEW);
    });

    it('logIdentifiableView should notPOST without correct payload', () => {
      const doi = '10.1234/abcd';
      const observable = buildObservable(doi).pipe(take(2));
      service.logIdentifiableView(observable).subscribe();
      httpMock.expectNone(dataciteTrackerAddress);
    });

    it('logIdentifiableDownload should POST with correct payload', () => {
      const doi = '10.1234/abcd';
      const observable = buildObservable(doi);
      service.logIdentifiableDownload(observable).subscribe();
      assertSuccess(httpMock, dataciteTrackerAddress, dataciteTrackerRepoId, doi, DataciteEvent.DOWNLOAD);
    });
    it('logFileView should GET identifiers and POST with correct payload', () => {
      const doi = '10.1234/fileview';
      const targetId = 'file-1';
      const targetType = 'files';

      service.logFileView(targetId, targetType).subscribe();

      // First request: GET identifiers
      const reqGet = httpMock.expectOne(`${webUrl}/${targetType}/${targetId}/identifiers`);
      expect(reqGet.request.method).toBe('GET');
      reqGet.flush({
        data: [
          {
            id: 'id-1',
            type: 'identifier',
            attributes: { category: 'doi', value: doi },
          },
        ],
      });

      // Second request: POST to datacite tracker
      assertSuccess(httpMock, dataciteTrackerAddress, dataciteTrackerRepoId, doi, DataciteEvent.VIEW);
    });

    it('logFileDownload should GET identifiers and POST with correct payload', () => {
      const doi = '10.1234/filedownload';
      const targetId = 'file-2';
      const targetType = 'files';

      service.logFileDownload(targetId, targetType).subscribe();

      // First request: GET identifiers
      const reqGet = httpMock.expectOne(`${webUrl}/${targetType}/${targetId}/identifiers`);
      expect(reqGet.request.method).toBe('GET');
      reqGet.flush({
        data: [
          {
            id: 'id-2',
            type: 'identifier',
            attributes: { category: 'doi', value: doi },
          },
        ],
      });

      // Second request: POST to datacite tracker
      assertSuccess(httpMock, dataciteTrackerAddress, dataciteTrackerRepoId, doi, DataciteEvent.DOWNLOAD);
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

    it('logIdentifiableView should POST with correct payload', () => {
      const doi = '10.1234/abcd';
      const observable = buildObservable(doi);
      service.logIdentifiableView(observable).subscribe();
      httpMock.expectNone(dataciteTrackerAddress);
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
