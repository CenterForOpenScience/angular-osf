import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileSettingsEmployment, UserSelectors } from '@osf/core/store/user';
import { Employment } from '@osf/shared/models/user/employment.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { EmploymentComponent } from './employment.component';

describe('EmploymentComponent', () => {
  let component: EmploymentComponent;
  let fixture: ComponentFixture<EmploymentComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  const initialEmployment: Employment[] = [
    {
      title: 'Engineer',
      institution: 'OSF',
      department: 'Platform',
      startMonth: 1,
      startYear: 2021,
      endMonth: 12,
      endYear: 2023,
      ongoing: false,
    },
  ];

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    confirmationService = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [EmploymentComponent],
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [{ selector: UserSelectors.getEmployment, value: initialEmployment }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(EmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form from selector employment data', () => {
    expect(component.positions.length).toBe(1);
    expect(component.positions.at(0).get('title')?.value).toBe('Engineer');
    expect(component.positions.at(0).get('institution')?.value).toBe('OSF');
  });

  it('should remove position by index', () => {
    component.removePosition(0);

    expect(component.positions.length).toBe(0);
  });

  it('should mark form touched and not add when current form is invalid', () => {
    const initialLength = component.positions.length;
    component.positions.at(0).patchValue({
      title: '',
    });

    component.addPosition();

    expect(component.positions.length).toBe(initialLength);
    expect(component.employmentForm.touched).toBe(true);
  });

  it('should add new position form group when form is valid', () => {
    const initialLength = component.positions.length;

    component.addPosition();

    expect(component.positions.length).toBe(initialLength + 1);
  });

  it('should return false for hasFormChanges when initial and current match', () => {
    expect(component.hasFormChanges()).toBe(false);
  });

  it('should return true for hasFormChanges when item count differs', () => {
    component.addPosition();

    expect(component.hasFormChanges()).toBe(true);
  });

  it('should return true for hasFormChanges when values are changed', () => {
    component.positions.at(0).patchValue({
      title: 'Senior Engineer',
    });

    expect(component.hasFormChanges()).toBe(true);
  });

  it('should skip discard confirmation when there are no changes', () => {
    component.discardChanges();

    expect(confirmationService.confirmDelete).not.toHaveBeenCalled();
  });

  it('should show discard confirmation and reset values on confirm', () => {
    component.positions.at(0).patchValue({
      title: 'Changed',
    });

    component.discardChanges();

    expect(confirmationService.confirmDelete).toHaveBeenCalled();
    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(component.positions.at(0).get('title')?.value).toBe('Engineer');
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.profileSettings.changesDiscarded');
  });

  it('should not save when form is invalid', () => {
    component.positions.at(0).patchValue({
      institution: '',
    });
    (store.dispatch as Mock).mockClear();

    component.saveEmployment();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateProfileSettingsEmployment));
  });

  it('should save employment and show success toast when form is valid', () => {
    (store.dispatch as Mock).mockClear();

    component.saveEmployment();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateProfileSettingsEmployment([
        {
          title: 'Engineer',
          institution: 'OSF',
          department: 'Platform',
          startMonth: 1,
          startYear: 2021,
          endMonth: 12,
          endYear: 2023,
          ongoing: false,
        },
      ])
    );
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.profileSettings.employment.successUpdate');
  });
});
