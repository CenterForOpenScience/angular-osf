import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, Validators } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { ArrayInputComponent } from './array-input.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ArrayInputComponent', () => {
  let component: ArrayInputComponent;
  let fixture: ComponentFixture<ArrayInputComponent>;
  let formArray: FormArray<FormControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrayInputComponent, MockComponent(TextInputComponent), OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ArrayInputComponent);
    component = fixture.componentInstance;

    formArray = new FormArray<FormControl>([new FormControl('test')]);
    fixture.componentRef.setInput('formArray', formArray);
    fixture.componentRef.setInput('inputPlaceholder', 'Enter value');
    fixture.componentRef.setInput('validators', [Validators.required]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct input values', () => {
    expect(component.formArray()).toBe(formArray);
    expect(component.inputPlaceholder()).toBe('Enter value');
    expect(component.validators()).toEqual([Validators.required]);
  });

  it('should add new control to form array', () => {
    const initialLength = formArray.length;

    component.add();

    expect(formArray.length).toBe(initialLength + 1);
    expect(formArray.at(formArray.length - 1)).toBeInstanceOf(FormControl);
  });

  it('should add control with correct validators', () => {
    component.add();

    const newControl = formArray.at(formArray.length - 1);
    expect(newControl.hasError('required')).toBe(true);
  });

  it('should remove control at specified index', () => {
    component.add();
    component.add();
    const initialLength = formArray.length;

    component.remove(1);

    expect(formArray.length).toBe(initialLength - 1);
  });

  it('should not remove control if only one control exists', () => {
    const singleControlArray = new FormArray<FormControl>([new FormControl('only')]);
    fixture.componentRef.setInput('formArray', singleControlArray);
    fixture.detectChanges();

    const initialLength = singleControlArray.length;

    component.remove(0);

    expect(singleControlArray.length).toBe(initialLength);
  });

  it('should handle multiple add and remove operations', () => {
    const initialLength = formArray.length;

    component.add();
    component.add();
    component.add();

    expect(formArray.length).toBe(initialLength + 3);

    component.remove(1);
    component.remove(2);

    expect(formArray.length).toBe(initialLength + 1);
  });

  it('should create controls with nonNullable true', () => {
    component.add();

    const newControl = formArray.at(formArray.length - 1);
    expect(newControl.value).toBe('');
    expect(newControl.hasError('required')).toBe(true);
  });
});
