import { MockComponent } from 'ng-mocks';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { MOCK_EDUCATION } from '@testing/mocks/user-employment-education.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { EducationFormComponent } from './education-form.component';

describe('EducationFormComponent', () => {
  let component: EducationFormComponent;
  let componentRef: ComponentRef<EducationFormComponent>;
  let fixture: ComponentFixture<EducationFormComponent>;
  let mockFormGroup: FormGroup;

  beforeEach(() => {
    mockFormGroup = new FormGroup({
      institution: new FormControl(MOCK_EDUCATION[0].institution),
      department: new FormControl(MOCK_EDUCATION[0].department),
      degree: new FormControl(MOCK_EDUCATION[0].degree),
      startDate: new FormControl(new Date(2021, 8, 1)),
      endDate: new FormControl(new Date(2025, 4, 1)),
      ongoing: new FormControl(false),
    });

    TestBed.configureTestingModule({
      imports: [EducationFormComponent, MockComponent(TextInputComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(EducationFormComponent);
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
