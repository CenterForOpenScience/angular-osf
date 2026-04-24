import { MockProvider } from 'ng-mocks';

import { firstValueFrom, throwError } from 'rxjs';

import { HttpContext, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { AuthService } from '@core/services/auth.service';
import { MaintenanceModeService } from '@core/services/maintenance-mode.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';
import { LoaderServiceMock, provideLoaderServiceMock } from '@testing/providers/loader-service.mock';
import {
  MaintenanceModeServiceMock,
  MaintenanceModeServiceMockType,
} from '@testing/providers/maintenance-mode.service.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { SentryMock, SentryMockType } from '@testing/providers/sentry-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { errorInterceptor } from './error.interceptor';
import { BYPASS_ERROR_INTERCEPTOR } from './error-interceptor.tokens';

describe('errorInterceptor', () => {
  let router: RouterMockType;
  let toastServiceMock: ToastServiceMockType;
  let loaderServiceMock: LoaderServiceMock;
  let authServiceMock: AuthServiceMockType;
  let maintenanceModeServiceMock: MaintenanceModeServiceMockType;
  let viewOnlyHelperMock: ViewOnlyLinkHelperMockType;
  let sentryMock: SentryMockType;

  function setup(platformId: 'browser' | 'server' = 'browser', viewOnly = false, routerUrl = '/dashboard') {
    router = RouterMockBuilder.create().withUrl(routerUrl).withNavigate(vi.fn().mockResolvedValue(true)).build();
    toastServiceMock = ToastServiceMock.simple();
    loaderServiceMock = new LoaderServiceMock();
    authServiceMock = AuthServiceMock.simple();
    maintenanceModeServiceMock = MaintenanceModeServiceMock.simple();
    viewOnlyHelperMock = ViewOnlyLinkHelperMock.simple(viewOnly);
    sentryMock = SentryMock.simple();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideLoaderServiceMock(loaderServiceMock),
        MockProvider(Router, router),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(AuthService, authServiceMock),
        MockProvider(MaintenanceModeService, maintenanceModeServiceMock),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyHelperMock),
        MockProvider(PLATFORM_ID, platformId),
        { provide: SENTRY_TOKEN, useValue: sentryMock },
      ],
    });
  }

  function createRequest(url = '/api/v2/nodes/abc', bypass = false, noAuthRedirect = false) {
    const context = bypass ? new HttpContext().set(BYPASS_ERROR_INTERCEPTOR, true) : new HttpContext();
    const headers = noAuthRedirect ? new HttpHeaders({ 'X-No-Auth-Redirect': 'true' }) : new HttpHeaders();
    return new HttpRequest('GET', url, { context, headers } as unknown);
  }

  async function runInterceptor(request: HttpRequest<unknown>, error: HttpErrorResponse) {
    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(request, () => throwError(() => error)));

    try {
      await firstValueFrom(result$);
      return null;
    } catch (caught) {
      return caught as HttpErrorResponse;
    }
  }

  it('should capture exception and bypass handling when context flag is set', async () => {
    setup();
    const request = createRequest('/api/v2/nodes/abc', true);
    const error = new HttpErrorResponse({ status: 500, error: { message: 'boom' }, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(500);
    expect(sentryMock.captureException).toHaveBeenCalledWith(error);
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).not.toHaveBeenCalled();
  });

  it('should handle server errors with server message and hide loader', async () => {
    setup();
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 500, error: { message: 'server failed' }, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(500);
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).toHaveBeenCalledWith('server failed');
  });

  it('should rethrow 409 without toast or loader handling', async () => {
    setup();
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 409, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(409);
    expect(loaderServiceMock.hide).not.toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should logout on 401 in browser when not view-only', async () => {
    setup('browser', false);
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 401, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(401);
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(loaderServiceMock.hide).not.toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should not logout on 401 when view-only mode is active', async () => {
    setup('browser', true);
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 401, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(401);
    expect(authServiceMock.logout).not.toHaveBeenCalled();
  });

  it('should navigate to request-access for 403 node URL', async () => {
    setup('browser', false, '/projects/abc');
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 403, error: {}, url: '/api/v2/nodes/abc' });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(403);
    expect(router.navigate).toHaveBeenCalledWith(['/request-access/abc']);
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).toHaveBeenCalled();
  });

  it('should not redirect on 403 when no-auth-redirect header is present', async () => {
    setup();
    const request = createRequest('/api/v2/metadata/abc', false, true);
    const error = new HttpErrorResponse({ status: 403, error: {}, url: '/api/v2/metadata/abc' });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(403);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should activate maintenance mode on 503 maintenance response', async () => {
    setup('browser', false);
    const request = createRequest('/api/v2/');
    const error = new HttpErrorResponse({
      status: 503,
      error: { meta: { maintenance_mode: true } },
      url: request.url,
    });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(503);
    expect(maintenanceModeServiceMock.activate).toHaveBeenCalled();
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });
});
