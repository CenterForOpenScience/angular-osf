import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

import { MetadataRecordFormat } from '../enums/metadata-record-format.enum';

import { MetadataRecordsService } from './metadata-records.service';

describe('MetadataRecordsService', () => {
  let service: MetadataRecordsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp()],
    });

    service = TestBed.inject(MetadataRecordsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('returns webUrl from environment', () => {
    const environment = TestBed.inject(ENVIRONMENT);
    expect(service.webUrl).toBe(environment.webUrl);
  });

  it('requests metadata record in text format', () => {
    const osfid = 'ezcuj';
    let responseBody = '';

    service.getMetadataRecord(osfid, MetadataRecordFormat.SchemaDotOrgDataset).subscribe((result) => {
      responseBody = result;
    });

    const request = httpMock.expectOne(
      `http://localhost:4200/metadata/${osfid}/?format=${MetadataRecordFormat.SchemaDotOrgDataset}`
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('text');

    request.flush('{"@context":"https://schema.org"}');

    expect(responseBody).toBe('{"@context":"https://schema.org"}');
  });
});
