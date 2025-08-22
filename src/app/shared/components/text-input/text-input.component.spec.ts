import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
import { TextInputComponent } from '@shared/components';
import { TranslateServiceMock } from '@shared/mocks';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set control input correctly', () => {
    const mockControl = new FormControl('test value');
    fixture.componentRef.setInput('control', mockControl);
    expect(component.control()).toBe(mockControl);
  });

  it('should set label input correctly', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    expect(component.label()).toBe('Test Label');
  });

  it('should set placeholder input correctly', () => {
    fixture.componentRef.setInput('placeholder', 'Enter text here');
    expect(component.placeholder()).toBe('Enter text here');
  });

  it('should set helpText input correctly', () => {
    fixture.componentRef.setInput('helpText', 'This is help text');
    expect(component.helpText()).toBe('This is help text');
  });

  it('should set type input correctly', () => {
    fixture.componentRef.setInput('type', 'email');
    expect(component.type()).toBe('email');
  });

  it('should set minLength input correctly', () => {
    fixture.componentRef.setInput('minLength', 5);
    expect(component.minLength()).toBe(5);
  });

  it('should set maxLength input correctly', () => {
    fixture.componentRef.setInput('maxLength', 100);
    expect(component.maxLength()).toBe(100);
  });

  it('should have getErrorMessage method accessible', () => {
    expect(component.getErrorMessage).toBeDefined();
    expect(typeof component.getErrorMessage).toBe('function');
  });

  it('should return empty key when control has no errors', () => {
    const mockControl = new FormControl('valid value');
    fixture.componentRef.setInput('control', mockControl);

    const result = component.getErrorMessage();
    expect(result).toEqual({ key: '' });
  });

  it('should return required error message', () => {
    const mockControl = new FormControl('', [Validators.required]);
    mockControl.markAsTouched();
    fixture.componentRef.setInput('control', mockControl);

    const result = component.getErrorMessage();
    expect(result).toEqual({ key: INPUT_VALIDATION_MESSAGES.required });
  });

  it('should return email error message', () => {
    const mockControl = new FormControl('invalid-email', [Validators.email]);
    mockControl.markAsTouched();
    fixture.componentRef.setInput('control', mockControl);

    const result = component.getErrorMessage();
    expect(result).toEqual({ key: INPUT_VALIDATION_MESSAGES.email });
  });

  it('should return link error message', () => {
    const mockControl = new FormControl('invalid-link');
    mockControl.setErrors({ link: true });
    fixture.componentRef.setInput('control', mockControl);

    const result = component.getErrorMessage();
    expect(result).toEqual({ key: INPUT_VALIDATION_MESSAGES.link });
  });

  it('should return maxlength error message with params', () => {
    const mockControl = new FormControl('very long text that exceeds limit');
    mockControl.setErrors({ maxlength: { requiredLength: 10, actualLength: 35 } });
    fixture.componentRef.setInput('control', mockControl);

    const result = component.getErrorMessage();
    expect(result).toEqual({
      key: INPUT_VALIDATION_MESSAGES.maxLength,
      params: { length: 10 },
    });
  });

  it('should return minlength error message with params', () => {
    const mockControl = new FormControl('short');
    mockControl.setErrors({ minlength: { requiredLength: 10, actualLength: 5 } });
    fixture.componentRef.setInput('control', mockControl);

    const result = component.getErrorMessage();
    expect(result).toEqual({
      key: INPUT_VALIDATION_MESSAGES.minLength,
      params: { length: 10 },
    });
  });

  it('should handle control with null errors', () => {
    const mockControl = new FormControl('test');
    mockControl.setErrors(null);
    fixture.componentRef.setInput('control', mockControl);

    const result = component.getErrorMessage();
    expect(result).toEqual({ key: '' });
  });

  it('should handle control with empty errors object', () => {
    const mockControl = new FormControl('test');
    mockControl.setErrors({});
    fixture.componentRef.setInput('control', mockControl);

    const result = component.getErrorMessage();
    expect(result).toEqual({ key: INPUT_VALIDATION_MESSAGES.invalidInput });
  });

  it('should handle long label text', () => {
    const longLabel =
      'This is a very long label that might be used for displaying detailed information about the input field';
    fixture.componentRef.setInput('label', longLabel);
    expect(component.label()).toBe(longLabel);
  });

  it('should handle long placeholder text', () => {
    const longPlaceholder =
      'This is a very long placeholder text that provides detailed instructions about what should be entered in this input field';
    fixture.componentRef.setInput('placeholder', longPlaceholder);
    expect(component.placeholder()).toBe(longPlaceholder);
  });

  it('should handle long help text', () => {
    const longHelpText =
      'This is a very long help text that provides detailed information about the input field, its purpose, and how to use it correctly';
    fixture.componentRef.setInput('helpText', longHelpText);
    expect(component.helpText()).toBe(longHelpText);
  });

  it('should handle empty strings in inputs', () => {
    fixture.componentRef.setInput('label', '');
    fixture.componentRef.setInput('placeholder', '');
    fixture.componentRef.setInput('helpText', '');

    expect(component.label()).toBe('');
    expect(component.placeholder()).toBe('');
    expect(component.helpText()).toBe('');
  });

  it('should handle different input types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'];

    types.forEach((type) => {
      fixture.componentRef.setInput('type', type);
      expect(component.type()).toBe(type);
    });
  });

  it('should handle numeric minLength values', () => {
    const values = [0, 1, 10, 100, 1000];

    values.forEach((value) => {
      fixture.componentRef.setInput('minLength', value);
      expect(component.minLength()).toBe(value);
    });
  });

  it('should handle numeric maxLength values', () => {
    const values = [1, 10, 100, 1000, 10000];

    values.forEach((value) => {
      fixture.componentRef.setInput('maxLength', value);
      expect(component.maxLength()).toBe(value);
    });
  });

  it('should handle rapid input changes', () => {
    fixture.componentRef.setInput('label', 'Label 1');
    expect(component.label()).toBe('Label 1');

    fixture.componentRef.setInput('label', 'Label 2');
    expect(component.label()).toBe('Label 2');

    fixture.componentRef.setInput('label', 'Label 3');
    expect(component.label()).toBe('Label 3');
  });

  it('should handle rapid type changes', () => {
    fixture.componentRef.setInput('type', 'text');
    expect(component.type()).toBe('text');

    fixture.componentRef.setInput('type', 'email');
    expect(component.type()).toBe('email');

    fixture.componentRef.setInput('type', 'password');
    expect(component.type()).toBe('password');
  });
});
