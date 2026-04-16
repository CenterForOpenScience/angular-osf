import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_DEVELOPER_APP } from '@testing/mocks/developer-app.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { DeleteDeveloperApp, GetDeveloperApps } from '../../store';

import { DeveloperAppsListComponent } from './developer-apps-list.component';

describe('DeveloperAppsListComponent', () => {
  let component: DeveloperAppsListComponent;
  let fixture: ComponentFixture<DeveloperAppsListComponent>;
  let store: Store;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  beforeEach(() => {
    confirmationService = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [DeveloperAppsListComponent],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(ToastService, toastService),
        provideMockStore(),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(DeveloperAppsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetDeveloperApps on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new GetDeveloperApps());
  });

  it('should open delete confirmation when deleteApp is called', () => {
    component.deleteApp(MOCK_DEVELOPER_APP);

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.developerApps.confirmation.delete.title',
      headerParams: { name: MOCK_DEVELOPER_APP.name },
      messageKey: 'settings.developerApps.confirmation.delete.message',
      onConfirm: expect.any(Function),
    });
  });

  it('should dispatch DeleteDeveloperApp and show success toast on confirm', () => {
    (store.dispatch as Mock).mockClear();
    component.deleteApp(MOCK_DEVELOPER_APP);

    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteDeveloperApp(MOCK_DEVELOPER_APP.clientId));
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.developerApps.confirmation.delete.success');
  });
});
