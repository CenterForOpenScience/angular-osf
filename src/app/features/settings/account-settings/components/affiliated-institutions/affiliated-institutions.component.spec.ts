import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
import { ReadonlyInputComponent } from '@osf/shared/components/readonly-input/readonly-input.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AccountSettingsSelectors, DeleteUserInstitution } from '../../store';

import { AffiliatedInstitutionsComponent } from './affiliated-institutions.component';

describe('AffiliatedInstitutionsComponent', () => {
  let component: AffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<AffiliatedInstitutionsComponent>;
  let store: Store;
  let confirmationService: CustomConfirmationServiceMockType;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;

  beforeEach(() => {
    confirmationService = CustomConfirmationServiceMock.simple();
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [AffiliatedInstitutionsComponent, MockComponent(ReadonlyInputComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
            { selector: AccountSettingsSelectors.getUserInstitutions, value: [MOCK_INSTITUTION] },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(AffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose institutions from selector', () => {
    expect(component.institutions()).toEqual([MOCK_INSTITUTION]);
  });

  it('should open delete confirmation with expected payload', () => {
    component.deleteInstitution(MOCK_INSTITUTION);

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.accountSettings.affiliatedInstitutions.deleteDialog.header',
      messageParams: { name: MOCK_INSTITUTION.name },
      messageKey: 'settings.accountSettings.affiliatedInstitutions.deleteDialog.message',
      onConfirm: expect.any(Function),
    });
  });

  it('should dispatch delete and show success toast when confirm is accepted', () => {
    (store.dispatch as Mock).mockClear();
    component.deleteInstitution(MOCK_INSTITUTION);

    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteUserInstitution(MOCK_INSTITUTION.id, MOCK_USER.id));
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'settings.accountSettings.affiliatedInstitutions.successDelete'
    );
  });

  it('should not dispatch delete when confirmation is not accepted', () => {
    (store.dispatch as Mock).mockClear();
    component.deleteInstitution(MOCK_INSTITUTION);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DeleteUserInstitution));
    expect(loaderService.hide).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
