import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { NameForm } from '@osf/features/settings/profile-settings/models';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { NameFormComponent } from './name-form.component';

describe('NameFormComponent', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;
  let mockForm: FormGroup<NameForm>;

  beforeEach(() => {
    mockForm = new FormGroup<NameForm>({
      fullName: new FormControl('John Doe', { nonNullable: true }),
      givenName: new FormControl('John', { nonNullable: true }),
      middleNames: new FormControl('William', { nonNullable: true }),
      familyName: new FormControl('Doe', { nonNullable: true }),
      suffix: new FormControl('Jr.', { nonNullable: true }),
    });

    TestBed.configureTestingModule({
      imports: [NameFormComponent, MockComponent(TextInputComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(NameFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('form', mockForm);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
