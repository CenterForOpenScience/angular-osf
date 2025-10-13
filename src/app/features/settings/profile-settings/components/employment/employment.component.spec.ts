import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileSettingsEmployment, UserSelectors } from '@core/store/user';
import { EmploymentFormComponent } from '@osf/features/settings/profile-settings/components';
import { ToastService } from '@shared/services';

import { EmploymentComponent } from './employment.component';

import { CustomConfirmationServiceMock, MOCK_EMPLOYMENT, MockCustomConfirmationServiceProvider } from '@testing/mocks';

describe('EmploymentComponent', () => {
  let component: EmploymentComponent;
  let fixture: ComponentFixture<EmploymentComponent>;

  const mockStore = {
    selectSignal: jest.fn().mockImplementation((selector) => {
      if (selector === UserSelectors.getEmployment) {
        return () => MOCK_EMPLOYMENT;
      }
      return () => null;
    }),
    dispatch: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentComponent, MockPipe(TranslatePipe), MockComponent(EmploymentFormComponent)],
      providers: [
        MockCustomConfirmationServiceProvider,
        MockProvider(ToastService),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(TranslatePipe),
        MockProvider(Store, mockStore),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle invalid index in removePosition method', () => {
    const initialLength = component.positions.length;

    component.removePosition(100);

    expect(component.positions.length).toBe(initialLength);
  });

  it('should not add position when form is invalid', () => {
    component.positions.at(0).get('title')?.setValue('');
    component.positions.at(0).get('title')?.updateValueAndValidity();
    const initialLength = component.positions.length;

    expect(component.employmentForm.invalid).toBe(true);

    component.addPosition();

    expect(component.positions.length).toBe(initialLength);
  });

  it('should add new employment form when form is valid', () => {
    const initialLength = component.positions.length;

    component.addPosition();

    expect(component.positions.length).toBe(initialLength + 1);

    const newEducation = component.positions.at(initialLength);
    expect(newEducation).toBeDefined();
    expect(newEducation.get('title')?.value).toBe('');
    expect(newEducation.get('institution')?.value).toBe('');
    expect(newEducation.get('department')?.value).toBe('');
    expect(newEducation.get('startDate')?.value).toBe(null);
    expect(newEducation.get('endDate')?.value).toBe(null);
    expect(newEducation.get('ongoing')?.value).toBe(false);
  });

  it('should detect changes when form field is modified', () => {
    component.positions.at(0).get('institution')?.setValue('New Institution');

    component.discardChanges();

    expect(CustomConfirmationServiceMock.confirmDelete).toHaveBeenCalled();
  });

  it('should mark all fields as touched when form is invalid', () => {
    component.positions.at(0).get('institution')?.setValue('');
    component.positions.at(1).get('title')?.setValue('');

    component.saveEmployment();

    expect(component.employmentForm.touched).toBe(true);
    expect(component.positions.at(0).get('institution')?.touched).toBe(true);
    expect(component.positions.at(1).get('title')?.touched).toBe(true);
  });

  it('should map form data to correct education format', () => {
    const education = component.positions.at(0);
    education.get('title')?.setValue('Software Engineer Intern');
    education.get('institution')?.setValue('Test University');
    education.get('department')?.setValue('Engineering');
    education.get('startDate')?.setValue(new Date(2020, 0));
    education.get('endDate')?.setValue(new Date(2024, 5));
    education.get('ongoing')?.setValue(false);

    component.saveEmployment();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      new UpdateProfileSettingsEmployment([
        {
          title: 'Software Engineer Intern',
          institution: 'Test University',
          department: 'Engineering',
          startYear: 2020,
          startMonth: 1,
          endYear: 2024,
          endMonth: 6,
          ongoing: false,
        },
        expect.any(Object),
      ])
    );
  });
});
