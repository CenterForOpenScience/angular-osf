import { MockComponent } from 'ng-mocks';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { MOCK_EDUCATION, MOCK_EMPLOYMENT } from '@testing/mocks/user-employment-education.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { EmploymentFormComponent } from './employment-form.component';

describe('EmploymentFormComponent', () => {
  let component: EmploymentFormComponent;
  let componentRef: ComponentRef<EmploymentFormComponent>;
  let fixture: ComponentFixture<EmploymentFormComponent>;
  let mockFormGroup: FormGroup;

  beforeEach(() => {
    mockFormGroup = new FormGroup({
      title: new FormControl(MOCK_EMPLOYMENT[0].title),
      institution: new FormControl(MOCK_EDUCATION[0].institution),
      department: new FormControl(MOCK_EDUCATION[0].department),
      startDate: new FormControl(new Date(2021, 8, 1)),
      endDate: new FormControl(new Date(2025, 4, 1)),
      ongoing: new FormControl(false),
    });

    TestBed.configureTestingModule({
      imports: [EmploymentFormComponent, MockComponent(TextInputComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(EmploymentFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('group', mockFormGroup);
    componentRef.setInput('index', 0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
