import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileSettingsEmployment, UserSelectors } from '@core/store/user';
import { ToastService } from '@osf/shared/services/toast.service';

import { EmploymentFormComponent } from '../employment-form/employment-form.component';

import { EmploymentComponent } from './employment.component';

import {
  CustomConfirmationServiceMock,
  MockCustomConfirmationServiceProvider,
} from '@testing/mocks/custom-confirmation.service.mock';
import { MOCK_EMPLOYMENT } from '@testing/mocks/employment.mock';

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

    const newEmployment = component.positions.at(initialLength);
    expect(newEmployment).toBeDefined();
    expect(newEmployment.get('title')?.value).toBe('');
    expect(newEmployment.get('institution')?.value).toBe('');
    expect(newEmployment.get('department')?.value).toBe('');
    expect(newEmployment.get('startDate')?.value).toBe(null);
    expect(newEmployment.get('endDate')?.value).toBe(null);
    expect(newEmployment.get('ongoing')?.value).toBe(false);
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

  it('should map form data to correct employment format', () => {
    const employment = component.positions.at(0);
    employment.get('title')?.setValue('Software Engineer Intern');
    employment.get('institution')?.setValue('Test University');
    employment.get('department')?.setValue('Engineering');
    employment.get('startDate')?.setValue(new Date(2020, 0));
    employment.get('endDate')?.setValue(new Date(2024, 5));
    employment.get('ongoing')?.setValue(false);

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
