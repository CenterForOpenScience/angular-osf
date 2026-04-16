import { CookieService } from 'ngx-cookie-service';
import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mock } from 'vitest';

import { HttpHandlerFn, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CookieServiceMock, CookieServiceMockType } from '@testing/providers/cookie-service.mock';

import { authInterceptor } from './auth.interceptor';

import { environment } from 'src/environments/environment';

describe('authInterceptor', () => {
  let cookieServiceMock: CookieServiceMockType;
  let next: Mock<HttpHandlerFn>;
  let capturedRequest: HttpRequest<unknown> | undefined;

  function setup(platformId: 'browser' | 'server' = 'browser', throttleToken?: string) {
    cookieServiceMock = CookieServiceMock.simple();
    capturedRequest = undefined;
    next = vi.fn((request: HttpRequest<unknown>) => {
      capturedRequest = request;
      return of(new HttpResponse({ status: 200 })) as unknown as ReturnType<HttpHandlerFn>;
    }) as unknown as Mock<HttpHandlerFn>;

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        MockProvider(CookieService, cookieServiceMock),
        MockProvider(PLATFORM_ID, platformId),
        MockProvider(ENVIRONMENT, { throttleToken }),
      ],
    });
  }

  function runInterceptor(request: HttpRequest<unknown>) {
    return TestBed.runInInjectionContext(() => authInterceptor(request, next as unknown as HttpHandlerFn));
  }

  it('should bypass header modifications for funder API requests', () => {
    setup();
    const request = new HttpRequest('GET', `${environment.funderApiUrl}/organizations`);

    runInterceptor(request).subscribe();

    expect(next).toHaveBeenCalledWith(request);
    expect(cookieServiceMock.get).not.toHaveBeenCalled();
    expect(capturedRequest).toBe(request);
  });

  it('should set default JSON:API headers and withCredentials for regular requests', () => {
    setup();
    const request = new HttpRequest('GET', '/api/v2/nodes');

    runInterceptor(request).subscribe();

    expect(capturedRequest).toBeDefined();
    expect(capturedRequest?.headers.get('Accept')).toBe('application/vnd.api+json;version=2.20');
    expect(capturedRequest?.headers.get('Content-Type')).toBe('application/vnd.api+json');
    expect(capturedRequest?.withCredentials).toBe(true);
  });

  it('should preserve existing Content-Type header', () => {
    setup();
    const request = new HttpRequest(
      'POST',
      '/api/v2/nodes',
      {},
      { headers: new HttpHeaders({ 'Content-Type': 'text/plain' }) }
    );

    runInterceptor(request).subscribe();

    expect(capturedRequest?.headers.get('Content-Type')).toBe('text/plain');
  });

  it('should set Accept to */* for text responseType and include csrf token', () => {
    setup();
    cookieServiceMock.get.mockReturnValue('csrf-token');
    const request = new HttpRequest('GET', '/api/v2/raw', { responseType: 'text' } as unknown);
    const textRequest = request.clone({ responseType: 'text' });

    runInterceptor(textRequest).subscribe();

    expect(cookieServiceMock.get).toHaveBeenCalledWith('api-csrf');
    expect(capturedRequest?.headers.get('Accept')).toBe('*/*');
    expect(capturedRequest?.headers.get('X-CSRFToken')).toBe('csrf-token');
  });

  it('should append throttle token on server when provided', () => {
    setup('server', 'throttle-token');
    const request = new HttpRequest('GET', '/api/v2/nodes');

    runInterceptor(request).subscribe();

    expect(capturedRequest?.headers.get('X-Throttle-Token')).toBe('throttle-token');
  });
});
