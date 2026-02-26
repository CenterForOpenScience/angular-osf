import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, Validators } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { ArrayInputComponent } from './array-input.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ArrayInputComponent', () => {
  let component: ArrayInputComponent;
  let fixture: ComponentFixture<ArrayInputComponent>;
  let formArray: FormArray<FormControl<string>>;

  function setup(overrides?: { withValidators?: boolean; formArray?: FormArray<FormControl<string>> }) {
    TestBed.configureTestingModule({
      imports: [ArrayInputComponent, MockComponent(TextInputComponent), OSFTestingModule],
    });

    fixture = TestBed.createComponent(ArrayInputComponent);
    component = fixture.componentInstance;

    formArray =
      overrides?.formArray ?? new FormArray<FormControl<string>>([new FormControl('test', { nonNullable: true })]);
    fixture.componentRef.setInput('formArray', formArray as FormArray<FormControl>);
    fixture.componentRef.setInput('inputPlaceholder', 'Enter value');
    if (overrides?.withValidators ?? true) {
      fixture.componentRef.setInput('validators', [Validators.required]);
    }

    fixture.detectChanges();
  }

  it('should add new control to form array', () => {
    setup();
    const initialLength = formArray.length;

    component.add();

    expect(formArray.length).toBe(initialLength + 1);
    const newControl = formArray.at(formArray.length - 1);
    expect(newControl.value).toBe('');
    expect(newControl.hasError('required')).toBe(true);
  });

  it('should add control without validators when validators input is not set', () => {
    setup({ withValidators: false });
    component.add();

    const newControl = formArray.at(formArray.length - 1);
    expect(newControl.errors).toBeNull();
  });

  it('should remove control at specified index', () => {
    setup();
    component.add();
    const initialLength = formArray.length;

    component.remove(1);

    expect(formArray.length).toBe(initialLength - 1);
  });

  it('should not remove control if only one control exists', () => {
    const singleControlArray = new FormArray<FormControl<string>>([new FormControl('only', { nonNullable: true })]);
    setup({ formArray: singleControlArray });

    const initialLength = singleControlArray.length;

    component.remove(0);

    expect(singleControlArray.length).toBe(initialLength);
  });
});
