import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mock } from 'vitest';

import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { ViewOnlyLinkHelperMock } from '@testing/providers/view-only-link-helper.mock';

import { viewOnlyInterceptor } from './view-only.interceptor';

describe('viewOnlyInterceptor', () => {
  let viewOnlyHelper: ViewOnlyLinkHelperService;
  let mockHandler: Mock;

  beforeEach(() => {
    mockHandler = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        MockProvider(Router, RouterMockBuilder.create().withUrl('/test').build()),
        MockProvider(ViewOnlyLinkHelperService, ViewOnlyLinkHelperMock.simple()),
      ],
    });

    viewOnlyHelper = TestBed.inject(ViewOnlyLinkHelperService);
  });

  const createRequest = (url: string): HttpRequest<unknown> => {
    return new HttpRequest('GET', url);
  };

  const createHandler = () => {
    const handler = mockHandler.mockReturnValue(of({}));
    return handler;
  };

  it('should add view_only parameter to non-funders API requests when view-only param exists', () => {
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue('abc123');

    const request = createRequest('/api/v2/projects/');
    const handler = createHandler();

    TestBed.runInInjectionContext(() => viewOnlyInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.url).toBe('/api/v2/projects/?view_only=abc123');
  });

  it('should add view_only parameter with & separator when URL already has query params', () => {
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue('xyz789');

    const request = createRequest('/api/v2/projects/?page=1');
    const handler = createHandler();

    TestBed.runInInjectionContext(() => viewOnlyInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.url).toBe('/api/v2/projects/?page=1&view_only=xyz789');
  });

  it('should encode view_only parameter value', () => {
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue('special chars & symbols');

    const request = createRequest('/api/v2/files/');
    const handler = createHandler();

    TestBed.runInInjectionContext(() => viewOnlyInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.url).toBe('/api/v2/files/?view_only=special%20chars%20%26%20symbols');
  });

  it('should not modify request when view_only parameter already exists in URL', () => {
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue('existing');

    const request = createRequest('/api/v2/nodes/?view_only=existing');
    const handler = createHandler();

    TestBed.runInInjectionContext(() => viewOnlyInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.url).toBe('/api/v2/nodes/?view_only=existing');
  });

  it('should not modify request when no view-only param exists', () => {
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue(null);

    const request = createRequest('/api/v2/users/');
    const handler = createHandler();

    TestBed.runInInjectionContext(() => viewOnlyInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.url).toBe('/api/v2/users/');
  });

  it('should not modify funders API requests even when view-only param exists', () => {
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue('funder123');

    const request = createRequest('https://api.ror.org/v2');
    const handler = createHandler();

    TestBed.runInInjectionContext(() => viewOnlyInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.url).toBe('https://api.ror.org/v2');
  });

  it('should handle requests to other external APIs normally', () => {
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue('external123');

    const request = createRequest('https://api.github.com/repos/user/repo');
    const handler = createHandler();

    TestBed.runInInjectionContext(() => viewOnlyInterceptor(request, handler));

    expect(handler).toHaveBeenCalledTimes(1);
    const modifiedRequest = handler.mock.calls[0][0];
    expect(modifiedRequest.url).toBe('https://api.github.com/repos/user/repo?view_only=external123');
  });
});
