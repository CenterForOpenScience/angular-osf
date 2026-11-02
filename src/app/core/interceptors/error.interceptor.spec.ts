import { MockProvider } from 'ng-mocks';

import { firstValueFrom, throwError } from 'rxjs';

import { HttpContext, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, RESPONSE_INIT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ERROR_MESSAGES } from '@core/constants/error-messages';
import { PREPRINT_PENDING_MODERATION_DETAIL } from '@core/constants/http-error-details.const';
import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { AuthService } from '@core/services/auth.service';
import { MaintenanceModeService } from '@core/services/maintenance-mode.service';
import { UserSelectors } from '@core/store/user';
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
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { errorInterceptor } from './error.interceptor';
import { bypassErrorInterceptorContext } from './error-interceptor.tokens';

describe('errorInterceptor', () => {
  let router: RouterMockType;
  let toastServiceMock: ToastServiceMockType;
  let loaderServiceMock: LoaderServiceMock;
  let authServiceMock: AuthServiceMockType;
  let maintenanceModeServiceMock: MaintenanceModeServiceMockType;
  let viewOnlyHelperMock: ViewOnlyLinkHelperMockType;
  let sentryMock: SentryMockType;
  let responseInit: ResponseInit;

  function setup(
    platformId: 'browser' | 'server' = 'browser',
    viewOnly = false,
    routerUrl = '/dashboard',
    isAuthenticated = false
  ) {
    router = RouterMockBuilder.create().withUrl(routerUrl).withNavigate(vi.fn().mockResolvedValue(true)).build();
    toastServiceMock = ToastServiceMock.simple();
    loaderServiceMock = new LoaderServiceMock();
    authServiceMock = AuthServiceMock.simple();
    maintenanceModeServiceMock = MaintenanceModeServiceMock.simple();
    viewOnlyHelperMock = ViewOnlyLinkHelperMock.simple(viewOnly);
    sentryMock = SentryMock.simple();
    responseInit = {};

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideLoaderServiceMock(loaderServiceMock),
        provideMockStore({
          selectors: [{ selector: UserSelectors.isAuthenticated, value: isAuthenticated }],
        }),
        MockProvider(Router, router),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(AuthService, authServiceMock),
        MockProvider(MaintenanceModeService, maintenanceModeServiceMock),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyHelperMock),
        MockProvider(PLATFORM_ID, platformId),
        { provide: SENTRY_TOKEN, useValue: sentryMock },
        { provide: RESPONSE_INIT, useValue: responseInit },
      ],
    });
  }

  function createRequest(url = '/api/v2/nodes/abc', bypass = false, noAuthRedirect = false) {
    const context = bypass ? bypassErrorInterceptorContext() : new HttpContext();
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

  it('should set SSR response status without navigation on server platform', async () => {
    setup('server');
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 404, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(404);
    expect(responseInit.status).toBe(404);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).not.toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
    expect(sentryMock.captureException).not.toHaveBeenCalled();
  });

  it('should set SSR response status for 401 without navigation', async () => {
    setup('server');
    const request = createRequest('/api/v2/guids/abc');
    const error = new HttpErrorResponse({ status: 401, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(401);
    expect(responseInit.status).toBe(401);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should set SSR response status for pending-moderation 403', async () => {
    setup('server');
    const request = createRequest('/api/v2/preprints/abc');
    const error = new HttpErrorResponse({
      status: 403,
      error: { errors: [{ detail: PREPRINT_PENDING_MODERATION_DETAIL }] },
      url: request.url,
    });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(403);
    expect(responseInit.status).toBe(403);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not set SSR response status for silent 403', async () => {
    setup('server');
    const request = createRequest('/api/v2/nodes/abc', false, true);
    const error = new HttpErrorResponse({ status: 403, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(403);
    expect(responseInit.status).toBeUndefined();
  });

  it('should not set SSR response status for bypassed requests on server platform', async () => {
    setup('server');
    const request = createRequest('/api/v2/nodes/abc', true);
    const error = new HttpErrorResponse({ status: 404, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(404);
    expect(responseInit.status).toBeUndefined();
  });

  it('should keep the first non-OK SSR response status', async () => {
    setup('server');
    responseInit.status = 404;

    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 500, error: {}, url: request.url });

    await runInterceptor(request, error);

    expect(responseInit.status).toBe(404);
  });

  it('should replace an earlier 5xx SSR response status with a resource status', async () => {
    setup('server');
    responseInit.status = 503;

    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 404, error: {}, url: request.url });

    await runInterceptor(request, error);

    expect(responseInit.status).toBe(404);
  });

  it('should map network status 0 to 503 on server platform', async () => {
    setup('server');
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 0, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(0);
    expect(responseInit.status).toBe(503);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not set SSR response status for silent network errors', async () => {
    setup('server');
    const request = createRequest('/api/v2/nodes/abc', false, true);
    const error = new HttpErrorResponse({ status: 0, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(0);
    expect(responseInit.status).toBeUndefined();
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

  it('should navigate to sign in on 401 in browser when anonymous and not view-only', async () => {
    setup('browser', false, '/dashboard', false);
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 401, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(401);
    expect(authServiceMock.navigateToSignIn).toHaveBeenCalled();
    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should logout on 401 in browser when authenticated and not view-only', async () => {
    setup('browser', false, '/dashboard', true);
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 401, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(401);
    expect(authServiceMock.logout).toHaveBeenCalledWith(window.location.href);
    expect(authServiceMock.navigateToSignIn).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should not logout on 401 when view-only mode is active', async () => {
    setup('browser', true);
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 401, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(401);
    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).toHaveBeenCalled();
  });

  it('should navigate to request-access for 403 node URL without toast', async () => {
    setup('browser', false, '/projects/abc');
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 403, error: {}, url: '/api/v2/nodes/abc' });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(403);
    expect(router.navigate).toHaveBeenCalledWith(['/request-access', 'abc']);
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should navigate to forbidden for 403 without a node URL', async () => {
    setup();
    const request = createRequest('/api/v2/users/me/');
    const error = new HttpErrorResponse({ status: 403, error: {}, url: '/api/v2/users/me/' });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(403);
    expect(router.navigate).toHaveBeenCalledWith(['/forbidden']);
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should not redirect on 403 when current route is a draft registry', async () => {
    setup('browser', false, '/registries/drafts/abc');
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 403, error: {}, url: '/api/v2/nodes/abc' });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(403);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
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

  it('should not redirect on 403 for node request-access URL', async () => {
    setup();
    const request = createRequest('/api/v2/nodes/abc/requests/');
    const error = new HttpErrorResponse({ status: 403, error: {}, url: '/api/v2/nodes/abc/requests/' });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(403);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should not redirect on 403 when preprint is pending moderation', async () => {
    setup();
    const request = createRequest('/api/v2/preprints/abc');
    const error = new HttpErrorResponse({
      status: 403,
      error: { errors: [{ detail: PREPRINT_PENDING_MODERATION_DETAIL }] },
      url: request.url,
    });

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

  it('should navigate to not-found for 404 without toast', async () => {
    setup();
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 404, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(404);
    expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should navigate to content-deleted for 410 without toast', async () => {
    setup();
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 410, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(410);
    expect(router.navigate).toHaveBeenCalledWith(['/content-deleted']);
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(toastServiceMock.showError).not.toHaveBeenCalled();
  });

  it('should toast API detail for default status codes', async () => {
    setup();
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({
      status: 400,
      error: { errors: [{ detail: 'Invalid title' }] },
      url: request.url,
    });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(400);
    expect(toastServiceMock.showError).toHaveBeenCalledWith('Invalid title');
    expect(loaderServiceMock.hide).toHaveBeenCalled();
  });

  it('should toast mapped i18n key when no API detail is present', async () => {
    setup();
    const request = createRequest('/api/v2/nodes/abc');
    const error = new HttpErrorResponse({ status: 400, error: {}, url: request.url });

    const caught = await runInterceptor(request, error);

    expect(caught?.status).toBe(400);
    expect(toastServiceMock.showError).toHaveBeenCalledWith(ERROR_MESSAGES[400]);
    expect(loaderServiceMock.hide).toHaveBeenCalled();
  });
});
