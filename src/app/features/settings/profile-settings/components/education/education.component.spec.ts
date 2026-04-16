import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileSettingsEducation, UserSelectors } from '@osf/core/store/user';
import { Education } from '@osf/shared/models/user/education.model';
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

import { EducationComponent } from './education.component';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  const initialEducation: Education[] = [
    {
      institution: 'Test University',
      department: 'Computer Science',
      degree: 'MSc',
      startMonth: 9,
      startYear: 2020,
      endMonth: 6,
      endYear: 2022,
      ongoing: false,
    },
  ];

  describe('with default education data', () => {
    beforeEach(() => {
      loaderService = new LoaderServiceMock();
      confirmationService = CustomConfirmationServiceMock.simple();
      toastService = ToastServiceMock.simple();

      TestBed.configureTestingModule({
        imports: [EducationComponent],
        providers: [
          provideOSFCore(),
          MockProvider(LoaderService, loaderService),
          MockProvider(CustomConfirmationService, confirmationService),
          MockProvider(ToastService, toastService),
          provideMockStore({
            signals: [{ selector: UserSelectors.getEducation, value: initialEducation }],
          }),
        ],
      });

      store = TestBed.inject(Store);
      fixture = TestBed.createComponent(EducationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form from selector education data', () => {
      expect(component.educations.length).toBe(1);
      expect(component.educations.at(0).get('institution')?.value).toBe('Test University');
      expect(component.educations.at(0).get('degree')?.value).toBe('MSc');
    });

    it('should remove education by index', () => {
      component.removeEducation(0);

      expect(component.educations.length).toBe(0);
    });

    it('should mark form touched and not add when current form is invalid', () => {
      const initialLength = component.educations.length;
      component.educations.at(0).patchValue({
        institution: '',
      });

      component.addEducation();

      expect(component.educations.length).toBe(initialLength);
      expect(component.educationForm.touched).toBe(true);
    });

    it('should add new education form group when form is valid', () => {
      const initialLength = component.educations.length;

      component.addEducation();

      expect(component.educations.length).toBe(initialLength + 1);
    });

    it('should return true for hasFormChanges when item count differs', () => {
      component.addEducation();

      expect(component.hasFormChanges()).toBe(true);
    });

    it('should skip discard confirmation when there are no changes', () => {
      component.discardChanges();

      expect(confirmationService.confirmDelete).not.toHaveBeenCalled();
    });

    it('should show discard confirmation and reset values on confirm', () => {
      component.educations.at(0).patchValue({
        institution: 'Changed University',
      });

      component.discardChanges();

      expect(confirmationService.confirmDelete).toHaveBeenCalled();
      const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
      onConfirm();

      expect(component.educations.at(0).get('institution')?.value).toBe('Test University');
      expect(toastService.showSuccess).toHaveBeenCalledWith('settings.profileSettings.changesDiscarded');
    });

    it('should not save when form is invalid', () => {
      component.educations.at(0).patchValue({
        institution: '',
      });
      (store.dispatch as Mock).mockClear();

      component.saveEducation();

      expect(loaderService.show).not.toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateProfileSettingsEducation));
    });

    it('should save education and show success toast when form is valid', () => {
      (store.dispatch as Mock).mockClear();

      component.saveEducation();

      expect(loaderService.show).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UpdateProfileSettingsEducation([
          {
            institution: 'Test University',
            department: 'Computer Science',
            degree: 'MSc',
            startMonth: 9,
            startYear: 2020,
            endMonth: 6,
            endYear: 2022,
            ongoing: false,
          },
        ])
      );
      expect(loaderService.hide).toHaveBeenCalled();
      expect(toastService.showSuccess).toHaveBeenCalledWith('settings.profileSettings.education.successUpdate');
    });
  });

  describe('with empty education data', () => {
    beforeEach(() => {
      loaderService = new LoaderServiceMock();
      confirmationService = CustomConfirmationServiceMock.simple();
      toastService = ToastServiceMock.simple();

      TestBed.configureTestingModule({
        imports: [EducationComponent],
        providers: [
          provideOSFCore(),
          MockProvider(LoaderService, loaderService),
          MockProvider(CustomConfirmationService, confirmationService),
          MockProvider(ToastService, toastService),
          provideMockStore({
            signals: [{ selector: UserSelectors.getEducation, value: [] }],
          }),
        ],
      });

      store = TestBed.inject(Store);
      fixture = TestBed.createComponent(EducationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should return false for hasFormChanges when initial and current are empty', () => {
      expect(component.hasFormChanges()).toBe(false);
    });

    it('should return true for hasFormChanges when user adds values and initial is empty', () => {
      component.addEducation();
      component.educations.at(0).patchValue({
        institution: 'New University',
        startDate: new Date(2022, 1, 1),
        endDate: new Date(2023, 1, 1),
      });

      expect(component.hasFormChanges()).toBe(true);
    });
  });
});
