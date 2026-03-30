import { MockProvider } from 'ng-mocks';

import { throwError } from 'rxjs';

import { HttpContext, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { AuthService } from '@core/services/auth.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { errorInterceptor } from './error.interceptor';

import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('errorInterceptor', () => {
  let toastService: ToastService;
  let loaderService: LoaderService;
  let router: Router;
  let authService: AuthService;
  let viewOnlyHelper: ViewOnlyLinkHelperService;
  let sentryMock: jest.Mock;

  beforeEach(() => {
    sentryMock = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        MockProvider(ToastService, {
          showError: jest.fn(),
        }),
        MockProvider(LoaderService, {
          hide: jest.fn(),
        }),
        MockProvider(AuthService, {
          logout: jest.fn(),
        }),
        MockProvider(ViewOnlyLinkHelperService, {
          hasViewOnlyParam: jest.fn(),
        }),
        {
          provide: 'PLATFORM_ID',
          useValue: 'browser',
        },
        {
          provide: SENTRY_TOKEN,
          useValue: { captureException: sentryMock },
        },
      ],
    });

    toastService = TestBed.inject(ToastService);
    loaderService = TestBed.inject(LoaderService);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    viewOnlyHelper = TestBed.inject(ViewOnlyLinkHelperService);
    jest.clearAllMocks();
  });

  const createRequest = (url = '/api/v2/test'): HttpRequest<unknown> => {
    return new HttpRequest('GET', url);
  };

  const createErrorHandler = (error: HttpErrorResponse) => {
    const handler = jest.fn();
    handler.mockReturnValue(throwError(() => error));
    return handler;
  };

  it('should bypass error handling when BYPASS_ERROR_INTERCEPTOR is true', () => {
    const error = new HttpErrorResponse({ error: 'test error', status: 500 });
    const request = createRequest().clone({
      context: new HttpContext().set(BYPASS_ERROR_INTERCEPTOR, true),
    });

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(sentryMock).toHaveBeenCalledWith(error);
          expect(toastService.showError).not.toHaveBeenCalled();
          expect(loaderService.hide).not.toHaveBeenCalled();
        },
      });
    });
  });

  it('should handle browser ErrorEvent', () => {
    const errorEvent = new ErrorEvent('test error');
    const error = new HttpErrorResponse({ error: errorEvent, status: 0 });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(toastService.showError).toHaveBeenCalledWith('test error');
          expect(loaderService.hide).toHaveBeenCalled();
        },
      });
    });
  });

  it('should extract error message from API error response', () => {
    const error = new HttpErrorResponse({
      error: { errors: [{ detail: 'Custom API error' }] },
      status: 400,
    });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(toastService.showError).toHaveBeenCalledWith('Custom API error');
          expect(loaderService.hide).toHaveBeenCalled();
        },
      });
    });
  });

  it('should use ERROR_MESSAGES for status codes', () => {
    const error = new HttpErrorResponse({ error: {}, status: 404 });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(toastService.showError).toHaveBeenCalledWith('The requested resource was not found.');
          expect(loaderService.hide).toHaveBeenCalled();
        },
      });
    });
  });

  it('should handle 5xx server errors with custom message', () => {
    const error = new HttpErrorResponse({
      error: { message: 'Database connection failed' },
      status: 500,
    });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(toastService.showError).toHaveBeenCalledWith('Database connection failed');
          expect(loaderService.hide).toHaveBeenCalled();
        },
      });
    });
  });

  it('should re-throw 409 errors without special handling', () => {
    const error = new HttpErrorResponse({ error: {}, status: 409 });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(toastService.showError).not.toHaveBeenCalled();
          expect(loaderService.hide).not.toHaveBeenCalled();
        },
      });
    });
  });

  it('should handle 401 errors with logout for non-view-only requests', () => {
    jest.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(false);

    const error = new HttpErrorResponse({ error: {}, status: 401 });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(authService.logout).toHaveBeenCalled();
          expect(toastService.showError).not.toHaveBeenCalled();
          expect(loaderService.hide).not.toHaveBeenCalled();
        },
      });
    });
  });

  it('should not logout for 401 errors in view-only mode', () => {
    jest.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(true);

    const error = new HttpErrorResponse({ error: {}, status: 401 });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(authService.logout).not.toHaveBeenCalled();
          expect(toastService.showError).not.toHaveBeenCalled();
          expect(loaderService.hide).not.toHaveBeenCalled();
        },
      });
    });
  });

  it('should handle 403 errors for request access URLs', () => {
    const error = new HttpErrorResponse({
      error: {},
      status: 403,
      url: '/api/v2/nodes/project123/requests',
    });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(loaderService.hide).toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          expect(toastService.showError).not.toHaveBeenCalled();
        },
      });
    });
  });

  it('should navigate to request-access page for 403 errors on node URLs', () => {
    const error = new HttpErrorResponse({
      error: {},
      status: 403,
      url: '/api/v2/nodes/project123',
    });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(router.navigate).toHaveBeenCalledWith(['/request-access/project123']);
          expect(loaderService.hide).toHaveBeenCalled();
          expect(toastService.showError).toHaveBeenCalled();
        },
      });
    });
  });

  it('should navigate to forbidden page for other 403 errors', () => {
    const error = new HttpErrorResponse({
      error: {},
      status: 403,
      url: '/api/v2/other/endpoint',
    });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(router.navigate).toHaveBeenCalledWith(['/forbidden']);
          expect(loaderService.hide).toHaveBeenCalled();
          expect(toastService.showError).toHaveBeenCalled();
        },
      });
    });
  });

  it('should not navigate for 403 errors when X-No-Auth-Redirect header is true', () => {
    const error = new HttpErrorResponse({
      error: {},
      status: 403,
      url: '/metadata/abcde/?format=google-dataset-json-ld',
      headers: new HttpHeaders({ 'X-No-Auth-Redirect': 'true' }),
    });
    const request = createRequest();

    runInInjectionContext(TestBed, () => {
      const result = errorInterceptor(request, createErrorHandler(error));
      result.subscribe({
        error: () => {
          expect(router.navigate).not.toHaveBeenCalled();
          expect(loaderService.hide).toHaveBeenCalled();
          expect(toastService.showError).not.toHaveBeenCalled();
        },
      });
    });
  });
});
