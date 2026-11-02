import { firstValueFrom } from 'rxjs';

import { HttpContext } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR, bypassErrorInterceptorContext } from '@core/interceptors/error-interceptor.tokens';

import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

import { JsonApiService } from './json-api.service';

describe('JsonApiService', () => {
  let service: JsonApiService;
  let httpMock: HttpTestingController;

  const resource = {
    id: '1',
    type: 'nodes',
    attributes: { title: 'Test' },
  };

  const document = {
    data: resource,
    included: [{ id: '2', type: 'users' }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp(), JsonApiService],
    });

    service = TestBed.inject(JsonApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get the full response document', async () => {
    const resultPromise = firstValueFrom(service.get<typeof document>('/v2/nodes/1/'));

    const req = httpMock.expectOne('/v2/nodes/1/');
    expect(req.request.method).toBe('GET');
    req.flush(document);

    await expect(resultPromise).resolves.toEqual(document);
  });

  it('should append array query params', async () => {
    const resultPromise = firstValueFrom(
      service.get<typeof document>('/v2/nodes/', { 'embed[]': ['bibliographic_contributors', 'parent'] })
    );

    const req = httpMock.expectOne(
      (request) =>
        request.url === '/v2/nodes/' &&
        request.params.getAll('embed[]')?.join(',') === 'bibliographic_contributors,parent'
    );
    expect(req.request.method).toBe('GET');
    req.flush(document);

    await expect(resultPromise).resolves.toEqual(document);
  });

  it('should post the full response document', async () => {
    const body = { data: { type: 'nodes', attributes: { title: 'New' } } };
    const resultPromise = firstValueFrom(service.post<typeof document>('/v2/nodes/', body));

    const req = httpMock.expectOne('/v2/nodes/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(document);

    await expect(resultPromise).resolves.toEqual(document);
  });

  it('should unwrap data from patch responses', async () => {
    const body = { data: resource };
    const resultPromise = firstValueFrom(service.patch<typeof resource>('/v2/nodes/1/', body));

    const req = httpMock.expectOne('/v2/nodes/1/');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);
    req.flush(document);

    await expect(resultPromise).resolves.toEqual(resource);
  });

  it('should return the full document from patchResponse', async () => {
    const body = { data: resource };
    const context = bypassErrorInterceptorContext();
    const resultPromise = firstValueFrom(
      service.patchResponse<typeof document>('/v2/nodes/1/?include=users', body, undefined, undefined, context)
    );

    const req = httpMock.expectOne('/v2/nodes/1/?include=users');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);
    expect(req.request.context.get(BYPASS_ERROR_INTERCEPTOR)).toBe(true);
    req.flush(document);

    await expect(resultPromise).resolves.toEqual(document);
  });

  it('should unwrap data from put responses', async () => {
    const body = { data: resource };
    const resultPromise = firstValueFrom(service.put<typeof resource>('/v2/nodes/1/', body));

    const req = httpMock.expectOne('/v2/nodes/1/');
    expect(req.request.method).toBe('PUT');
    req.flush(document);

    await expect(resultPromise).resolves.toEqual(resource);
  });

  it('should delete with optional body, headers, and context', async () => {
    const body = { data: [{ id: '1', type: 'nodes' }] };
    const headers = { 'Content-Type': 'application/vnd.api+json; ext=bulk' };
    const context = new HttpContext();
    const resultPromise = firstValueFrom(service.delete('/v2/nodes/', body, headers, context));

    const req = httpMock.expectOne('/v2/nodes/');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(body);
    expect(req.request.headers.get('Content-Type')).toBe(headers['Content-Type']);
    expect(req.request.context).toBe(context);
    req.flush(null);

    await expect(resultPromise).resolves.toBeNull();
  });
});
