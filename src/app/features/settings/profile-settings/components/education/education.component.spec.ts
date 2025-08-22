import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileSettingsEducation, UserSelectors } from '@core/store/user';
import { EducationFormComponent } from '@osf/features/settings/profile-settings/components';
import {
  CustomConfirmationServiceMock,
  MOCK_EDUCATION,
  MockCustomConfirmationServiceProvider,
  TranslateServiceMock,
} from '@osf/shared/mocks';
import { ToastService } from '@shared/services';

import { EducationComponent } from './education.component';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;

  const mockStore = {
    selectSignal: jest.fn().mockImplementation((selector) => {
      if (selector === UserSelectors.getEducation) {
        return () => MOCK_EDUCATION;
      }
      return () => null;
    }),
    dispatch: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationComponent, MockComponent(EducationFormComponent)],
      providers: [
        TranslateServiceMock,
        MockCustomConfirmationServiceProvider,
        MockProvider(ToastService),
        MockProvider(Store, mockStore),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle invalid index in removeEducation method', () => {
    const initialLength = component.educations.length;

    component.removeEducation(100);

    expect(component.educations.length).toBe(initialLength);
  });

  it('should not add education when form is invalid', () => {
    component.educations.at(0).get('institution')?.setValue('');
    component.educations.at(0).get('institution')?.updateValueAndValidity();
    const initialLength = component.educations.length;

    expect(component.educationForm.invalid).toBe(true);

    component.addEducation();

    expect(component.educations.length).toBe(initialLength);
  });

  it('should add new education form when form is valid', () => {
    const initialLength = component.educations.length;

    component.addEducation();

    expect(component.educations.length).toBe(initialLength + 1);

    const newEducation = component.educations.at(initialLength);
    expect(newEducation).toBeDefined();
    expect(newEducation.get('institution')?.value).toBe('');
    expect(newEducation.get('department')?.value).toBe('');
    expect(newEducation.get('degree')?.value).toBe('');
    expect(newEducation.get('startDate')?.value).toBe(null);
    expect(newEducation.get('endDate')?.value).toBe(null);
    expect(newEducation.get('ongoing')?.value).toBe(false);
  });

  it('should detect changes when form field is modified', () => {
    component.educations.at(0).get('institution')?.setValue('New Institution');

    component.discardChanges();

    expect(CustomConfirmationServiceMock.confirmDelete).toHaveBeenCalled();
  });

  it('should mark all fields as touched when form is invalid', () => {
    component.educations.at(0).get('institution')?.setValue('');
    component.educations.at(1).get('degree')?.setValue('');

    component.saveEducation();

    expect(component.educationForm.touched).toBe(true);
    expect(component.educations.at(0).get('institution')?.touched).toBe(true);
    expect(component.educations.at(1).get('degree')?.touched).toBe(true);
  });

  it('should map form data to correct education format', () => {
    const education = component.educations.at(0);
    education.get('institution')?.setValue('Test University');
    education.get('department')?.setValue('Engineering');
    education.get('degree')?.setValue('Bachelor');
    education.get('startDate')?.setValue(new Date(2020, 0));
    education.get('endDate')?.setValue(new Date(2024, 5));
    education.get('ongoing')?.setValue(false);

    component.saveEducation();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      new UpdateProfileSettingsEducation({
        education: [
          {
            institution: 'Test University',
            department: 'Engineering',
            degree: 'Bachelor',
            startYear: 2020,
            startMonth: 0,
            endYear: 2024,
            endMonth: 6,
            ongoing: false,
          },
          {
            institution: 'Advanced University',
            department: 'Software Engineering',
            degree: 'Master of Science',
            startYear: 2020,
            startMonth: 8,
            endYear: null,
            endMonth: null,
            ongoing: false,
          },
        ],
      })
    );
  });
});
