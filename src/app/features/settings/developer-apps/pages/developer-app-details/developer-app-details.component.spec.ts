import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CopyButtonComponent } from '@osf/shared/components/copy-button/copy-button.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_DEVELOPER_APP } from '@testing/mocks/developer-app.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { DeveloperAppAddEditFormComponent } from '../../components';
import { DeveloperApp } from '../../models';
import { DeleteDeveloperApp, DeveloperAppsSelectors, GetDeveloperAppDetails, ResetClientSecret } from '../../store';

import { DeveloperAppDetailsComponent } from './developer-app-details.component';

describe('DeveloperAppDetailsComponent', () => {
  let component: DeveloperAppDetailsComponent;
  let fixture: ComponentFixture<DeveloperAppDetailsComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  function setup(appInStore?: DeveloperApp) {
    routerMock = RouterMockBuilder.create().build();
    confirmationService = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();
    const routeMock = ActivatedRouteMockBuilder.create().withParams({ id: MOCK_DEVELOPER_APP.clientId }).build();

    const getDetailsById = (id: string): DeveloperApp | undefined =>
      appInStore && id === MOCK_DEVELOPER_APP.clientId ? appInStore : undefined;

    TestBed.configureTestingModule({
      imports: [
        DeveloperAppDetailsComponent,
        ...MockComponents(
          CopyButtonComponent,
          IconComponent,
          LoadingSpinnerComponent,
          DeveloperAppAddEditFormComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          selectors: [{ selector: DeveloperAppsSelectors.getDeveloperAppDetails, value: getDetailsById }],
          signals: [{ selector: DeveloperAppsSelectors.getDeveloperAppDetails, value: getDetailsById }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(DeveloperAppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup(MOCK_DEVELOPER_APP);

    expect(component).toBeTruthy();
  });

  it('should dispatch GetDeveloperAppDetails when app is not in store', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetDeveloperAppDetails(MOCK_DEVELOPER_APP.clientId));
  });

  it('should not dispatch GetDeveloperAppDetails when app exists in store', () => {
    setup(MOCK_DEVELOPER_APP);

    expect(store.dispatch).not.toHaveBeenCalledWith(new GetDeveloperAppDetails(MOCK_DEVELOPER_APP.clientId));
  });

  it('should compute client secret and hidden client secret', () => {
    setup(MOCK_DEVELOPER_APP);

    expect(component.clientSecret()).toBe(MOCK_DEVELOPER_APP.clientSecret);
    expect(component.hiddenClientSecret()).toBe('*'.repeat(MOCK_DEVELOPER_APP.clientSecret.length));
  });

  it('should confirm delete and delete app on confirm', () => {
    setup(MOCK_DEVELOPER_APP);
    (store.dispatch as Mock).mockClear();

    component.deleteApp();

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.developerApps.confirmation.delete.title',
      headerParams: { name: MOCK_DEVELOPER_APP.name },
      messageKey: 'settings.developerApps.confirmation.delete.message',
      onConfirm: expect.any(Function),
    });

    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteDeveloperApp(MOCK_DEVELOPER_APP.clientId));
    expect(routerMock.navigate).toHaveBeenCalledWith(['settings/developer-apps']);
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.developerApps.confirmation.delete.success');
  });

  it('should confirm reset secret and dispatch reset action on confirm', () => {
    setup(MOCK_DEVELOPER_APP);
    (store.dispatch as Mock).mockClear();

    component.resetClientSecret();

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.developerApps.confirmation.resetSecret.title',
      headerParams: { name: MOCK_DEVELOPER_APP.name },
      messageKey: 'settings.developerApps.confirmation.resetSecret.message',
      acceptLabelKey: 'settings.developerApps.details.clientSecret.reset',
      onConfirm: expect.any(Function),
    });

    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new ResetClientSecret(MOCK_DEVELOPER_APP.clientId));
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.developerApps.confirmation.resetSecret.success');
  });
});
