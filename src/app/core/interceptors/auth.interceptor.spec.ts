import { CookieService } from 'ngx-cookie-service';
import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { EnvironmentModel } from '@osf/shared/models/environment.model';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let cookieService: CookieService;
  let mockHandler: jest.Mock;

  const setup = (platformId = 'browser', environmentOverrides: Partial<EnvironmentModel> = {}) => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(CookieService, { get: jest.fn() }),
        MockProvider(PLATFORM_ID, platformId),
        MockProvider(ENVIRONMENT, { throttleToken: '', ...environmentOverrides } as EnvironmentModel),
      ],
    });

    cookieService = TestBed.inject(CookieService);
  };

  beforeEach(() => {
    mockHandler = jest.fn();
    jest.clearAllMocks();
  });

  const createRequest = (url: string, options?: Partial<HttpRequest<unknown>>): HttpRequest<unknown> => {
    return new HttpRequest('GET', url, options?.body, {
      responseType: options?.responseType || 'json',
      ...options,
    });
  };

  const createHandler = () => {
    const handler = mockHandler.mockReturnValue(of({}));
    return handler;
  };

  it('should skip CrossRef funders API requests', () => {
    setup();
    const request = createRequest('/api.crossref.org/funders/10.13039/100000001');
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest).toBe(request);
  });

  it('should set Accept header to */* for text response type', () => {
    setup();
    const request = createRequest('/api/v2/projects/', { responseType: 'text' });
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.get('Accept')).toBe('*/*');
  });

  it('should set Accept header to API version for json response type', () => {
    setup();
    const request = createRequest('/api/v2/projects/', { responseType: 'json' });
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.get('Accept')).toBe('application/vnd.api+json;version=2.20');
  });

  it('should set Content-Type header when not present', () => {
    setup();
    const request = createRequest('/api/v2/projects/');
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.get('Content-Type')).toBe('application/vnd.api+json');
  });

  it('should not override existing Content-Type header', () => {
    setup();
    const request = createRequest('/api/v2/projects/');
    const requestWithHeaders = request.clone({
      setHeaders: { 'Content-Type': 'application/json' },
    });
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(requestWithHeaders, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.get('Content-Type')).toBe('application/json');
  });

  it('should add CSRF token and withCredentials in browser platform', () => {
    setup();
    jest.spyOn(cookieService, 'get').mockReturnValue('csrf-token-123');

    const request = createRequest('/api/v2/projects/');
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    expect(cookieService.get).toHaveBeenCalledWith('api-csrf');
    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.get('X-CSRFToken')).toBe('csrf-token-123');
    expect(modifiedRequest.withCredentials).toBe(true);
  });

  it('should not add CSRF token when not available in browser platform', () => {
    setup();
    jest.spyOn(cookieService, 'get').mockReturnValue('');

    const request = createRequest('/api/v2/projects/');
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    expect(cookieService.get).toHaveBeenCalledWith('api-csrf');
    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.has('X-CSRFToken')).toBe(false);
    expect(modifiedRequest.withCredentials).toBe(true);
  });

  it('should not add X-Throttle-Token on browser platform', () => {
    setup('browser', { throttleToken: 'test-token' });
    const request = createRequest('/api/v2/projects/');
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.has('X-Throttle-Token')).toBe(false);
  });

  it('should add X-Throttle-Token on server platform when token is present', () => {
    setup('server', { throttleToken: 'test-token' });
    const request = createRequest('/api/v2/projects/');
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.get('X-Throttle-Token')).toBe('test-token');
  });

  it('should not add X-Throttle-Token on server platform when token is empty', () => {
    setup('server', { throttleToken: '' });
    const request = createRequest('/api/v2/projects/');
    const handler = createHandler();

    runInInjectionContext(TestBed, () => authInterceptor(request, handler));

    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.headers.has('X-Throttle-Token')).toBe(false);
  });
});
