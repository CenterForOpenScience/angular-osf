import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyInputComponent } from './readonly-input.component';

describe('ReadonlyInputComponent', () => {
  let component: ReadonlyInputComponent;
  let fixture: ComponentFixture<ReadonlyInputComponent>;
  let componentRef: ComponentRef<ReadonlyInputComponent>;

  const mockValue = 'test value';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadonlyInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadonlyInputComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display value when input is provided', () => {
    componentRef.setInput('value', mockValue);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.value).toBe(mockValue);
  });

  it('should be readonly by default', () => {
    componentRef.setInput('value', mockValue);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.readOnly).toBe(true);
  });

  it('should not be readonly when readonly input is false', () => {
    componentRef.setInput('value', mockValue);
    componentRef.setInput('readonly', false);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.readOnly).toBe(false);
  });

  it('should be disabled when disabled input is true', () => {
    componentRef.setInput('value', mockValue);
    componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.disabled).toBe(true);
  });

  it('should emit deleteItem when remove icon is clicked', () => {
    componentRef.setInput('value', mockValue);
    fixture.detectChanges();

    const deleteSpy = jest.spyOn(component.deleteItem, 'emit');
    const removeIcon = fixture.nativeElement.querySelector('.remove-icon');

    removeIcon.click();

    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should have remove icon with correct classes', () => {
    componentRef.setInput('value', mockValue);
    fixture.detectChanges();

    const removeIcon = fixture.nativeElement.querySelector('.remove-icon');
    expect(removeIcon).toBeTruthy();
    expect(removeIcon.classList.contains('fas')).toBe(true);
    expect(removeIcon.classList.contains('fa-close')).toBe(true);
    expect(removeIcon.classList.contains('cursor-pointer')).toBe(true);
  });

  it('should have disabled class on remove icon when disabled', () => {
    componentRef.setInput('value', mockValue);
    componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const removeIcon = fixture.nativeElement.querySelector('.remove-icon');
    expect(removeIcon.classList.contains('disabled')).toBe(true);
  });

  it('should display placeholder when provided', () => {
    const placeholder = 'Enter value';
    componentRef.setInput('value', mockValue);
    componentRef.setInput('placeholder', placeholder);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.placeholder).toBe(placeholder);
  });
});
