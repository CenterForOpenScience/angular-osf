import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { PasswordInputHintComponent } from './password-input-hint.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PasswordInputHintComponent', () => {
  let component: PasswordInputHintComponent;
  let fixture: ComponentFixture<PasswordInputHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputHintComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputHintComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default control input value as null', () => {
    expect(component.control()).toBeNull();
  });

  it('should set control input correctly', () => {
    const mockControl = new FormControl('');
    fixture.componentRef.setInput('control', mockControl);
    expect(component.control()).toBe(mockControl);
  });

  it('should return null for validationError when control is null', () => {
    fixture.componentRef.setInput('control', null);
    expect(component.validationError).toBeNull();
  });

  it('should return null for validationError when control has no errors', () => {
    const mockControl = new FormControl('valid');
    fixture.componentRef.setInput('control', mockControl);
    expect(component.validationError).toBeNull();
  });

  it('should return null for validationError when control is not touched', () => {
    const mockControl = new FormControl('', Validators.required);
    mockControl.setErrors({ required: true });
    fixture.componentRef.setInput('control', mockControl);
    expect(component.validationError).toBeNull();
  });

  it('should return required for validationError when errors.required exists and control is touched', () => {
    const mockControl = new FormControl('', Validators.required);
    mockControl.markAsTouched();
    fixture.componentRef.setInput('control', mockControl);
    expect(component.validationError).toBe('required');
  });

  it('should return minlength for validationError when errors.minlength exists and control is touched', () => {
    const mockControl = new FormControl('ab', Validators.minLength(5));
    mockControl.markAsTouched();
    fixture.componentRef.setInput('control', mockControl);
    expect(component.validationError).toBe('minlength');
  });

  it('should return pattern for validationError when errors.pattern exists and control is touched', () => {
    const mockControl = new FormControl('invalid', Validators.pattern(/[A-Z]/));
    mockControl.markAsTouched();
    fixture.componentRef.setInput('control', mockControl);
    expect(component.validationError).toBe('pattern');
  });

  it('should return null for validationError when control has other errors and is touched', () => {
    const mockControl = new FormControl('');
    mockControl.setErrors({ customError: true });
    mockControl.markAsTouched();
    fixture.componentRef.setInput('control', mockControl);
    expect(component.validationError).toBeNull();
  });
});
