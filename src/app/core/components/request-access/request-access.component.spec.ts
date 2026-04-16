import { MockProvider } from 'ng-mocks';

import { Observable, of, throwError } from 'rxjs';

import { Mock } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { RequestAccessService } from '@osf/shared/services/request-access.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';
import { LoaderServiceMock, provideLoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { RequestAccessComponent } from './request-access.component';

describe('RequestAccessComponent', () => {
  let fixture: ComponentFixture<RequestAccessComponent>;
  let component: RequestAccessComponent;
  let routerMock: RouterMockType;
  let requestAccessServiceMock: { requestAccessToProject: Mock };
  let loaderServiceMock: LoaderServiceMock;
  let toastServiceMock: ToastServiceMockType;
  let authServiceMock: AuthServiceMockType;

  function setup(overrides?: {
    routeId?: string;
    requestAccessResult?: Observable<void>;
    requestAccessError?: HttpErrorResponse;
  }) {
    const routeId = overrides?.routeId ?? 'project-1';
    routerMock = RouterMockBuilder.create().withNavigate(vi.fn().mockResolvedValue(true)).build();
    loaderServiceMock = new LoaderServiceMock();
    toastServiceMock = ToastServiceMock.simple();
    authServiceMock = AuthServiceMock.simple();

    requestAccessServiceMock = {
      requestAccessToProject: overrides?.requestAccessError
        ? vi.fn().mockReturnValue(throwError(() => overrides.requestAccessError))
        : vi.fn().mockReturnValue(overrides?.requestAccessResult ?? of(void 0)),
    };

    const activatedRouteMock = ActivatedRouteMockBuilder.create().withParams({ id: routeId }).build();

    TestBed.configureTestingModule({
      imports: [RequestAccessComponent],
      providers: [
        provideOSFCore(),
        provideLoaderServiceMock(loaderServiceMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(Router, routerMock),
        MockProvider(RequestAccessService, requestAccessServiceMock),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(AuthService, authServiceMock),
      ],
    });

    fixture = TestBed.createComponent(RequestAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should expose support email and comment limit', () => {
    setup();
    expect(component.supportEmail).toBe('support@test.com');
    expect(component.commentLimit).toBe(InputLimits.requestAccessComment.maxLength);
  });

  it('should render support email mailto link', () => {
    setup();
    const supportLink = fixture.nativeElement.querySelector('a');
    expect(supportLink.getAttribute('href')).toBe(`mailto:${component.supportEmail}`);
    expect(supportLink.textContent).toContain(component.supportEmail);
  });

  it('should request access and handle success flow', () => {
    setup({ routeId: 'project-123' });
    component.comment.set('please grant access');
    component.requestAccess();

    expect(loaderServiceMock.show).toHaveBeenCalled();
    expect(requestAccessServiceMock.requestAccessToProject).toHaveBeenCalledWith('project-123', 'please grant access');
    expect(loaderServiceMock.hide).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('requestAccess.requestedSuccessMessage');
  });

  it('should show already requested error on 409', () => {
    setup({
      requestAccessError: new HttpErrorResponse({ status: 409 }),
    });
    component.requestAccess();

    expect(loaderServiceMock.show).toHaveBeenCalled();
    expect(toastServiceMock.showError).toHaveBeenCalledWith('requestAccess.alreadyRequestedMessage');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not show duplicate error for non-409 failures', () => {
    setup({
      requestAccessError: new HttpErrorResponse({ status: 500 }),
    });
    component.requestAccess();

    expect(toastServiceMock.showError).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should logout on switch account', () => {
    setup();
    component.switchAccount();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
