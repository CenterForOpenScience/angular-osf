import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileSettingsUser, UserSelectors } from '@osf/core/store/user';
import { UserModel } from '@osf/shared/models/user/user.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { CitationPreviewComponent } from '../citation-preview/citation-preview.component';
import { NameFormComponent } from '../name-form/name-form.component';

import { NameComponent } from './name.component';

describe('NameComponent', () => {
  let component: NameComponent;
  let fixture: ComponentFixture<NameComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  const initialUser: Partial<UserModel> = MOCK_USER;

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    confirmationService = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [NameComponent, ...MockComponents(CitationPreviewComponent, NameFormComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [{ selector: UserSelectors.getUserNames, value: initialUser }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(NameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form from user selector', () => {
    expect(component.form.getRawValue()).toEqual({
      fullName: 'John Doe',
      givenName: 'John',
      middleNames: '',
      familyName: 'Doe',
      suffix: '',
    });
  });

  it('should update preview user when form values change', () => {
    component.form.patchValue({
      fullName: 'Jane Doe',
      suffix: 'III',
    });

    expect(component.previewUser()).toEqual({
      ...initialUser,
      fullName: 'Jane Doe',
      suffix: 'III',
    });
  });

  it('should return false for hasFormChanges when form matches initial user', () => {
    expect(component.hasFormChanges()).toBe(false);
  });

  it('should return true for hasFormChanges when form value changes', () => {
    component.form.patchValue({
      givenName: 'Johnny',
    });

    expect(component.hasFormChanges()).toBe(true);
  });

  it('should not save when form is invalid', () => {
    (store.dispatch as Mock).mockClear();
    component.form.patchValue({
      fullName: '   ',
    });

    component.saveChanges();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateProfileSettingsUser));
  });

  it('should save changes and show success toast when form is valid', () => {
    (store.dispatch as Mock).mockClear();
    component.form.patchValue({
      fullName: 'Jane Doe',
      givenName: 'Jane',
      middleNames: 'M',
      familyName: 'Doe',
      suffix: 'Sr',
    });

    component.saveChanges();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateProfileSettingsUser({
        fullName: 'Jane Doe',
        givenName: 'Jane',
        middleNames: 'M',
        familyName: 'Doe',
        suffix: 'Sr',
      })
    );
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.profileSettings.name.successUpdate');
  });

  it('should skip discard confirmation when there are no form changes', () => {
    component.discardChanges();

    expect(confirmationService.confirmDelete).not.toHaveBeenCalled();
  });

  it('should reset form and show success toast when discard is confirmed', () => {
    component.form.patchValue({
      fullName: 'Changed Name',
    });

    component.discardChanges();

    expect(confirmationService.confirmDelete).toHaveBeenCalled();
    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(component.form.getRawValue()).toEqual({
      fullName: 'John Doe',
      givenName: 'John',
      middleNames: '',
      familyName: 'Doe',
      suffix: '',
    });
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.profileSettings.changesDiscarded');
  });
});
