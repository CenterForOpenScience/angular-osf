import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyInputComponent } from './readonly-input.component';

describe('ReadonlyInputComponent', () => {
  let component: ReadonlyInputComponent;
  let fixture: ComponentFixture<ReadonlyInputComponent>;

  const mockValue = 'test value';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadonlyInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadonlyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display value when input is provided', () => {
    fixture.componentRef.setInput('value', mockValue);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.value).toBe(mockValue);
  });

  it('should be readonly by default', () => {
    fixture.componentRef.setInput('value', mockValue);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.readOnly).toBe(true);
  });

  it('should not be readonly when readonly input is false', () => {
    fixture.componentRef.setInput('value', mockValue);
    fixture.componentRef.setInput('readonly', false);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.readOnly).toBe(false);
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('value', mockValue);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.disabled).toBe(true);
  });

  it('should emit deleteItem when remove icon is clicked', () => {
    fixture.componentRef.setInput('value', mockValue);
    fixture.detectChanges();

    const deleteSpy = jest.spyOn(component.deleteItem, 'emit');
    const removeIcon = fixture.nativeElement.querySelector('.remove-icon');

    removeIcon.click();

    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should not emit deleteItem when disabled', () => {
    fixture.componentRef.setInput('value', mockValue);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const deleteSpy = jest.spyOn(component.deleteItem, 'emit');
    const removeIcon = fixture.nativeElement.querySelector('.remove-icon');

    removeIcon.click();

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should have remove icon with correct classes', () => {
    fixture.componentRef.setInput('value', mockValue);
    fixture.detectChanges();

    const removeIcon = fixture.nativeElement.querySelector('.remove-icon');
    expect(removeIcon).toBeTruthy();
    expect(removeIcon.classList.contains('fas')).toBe(true);
    expect(removeIcon.classList.contains('fa-close')).toBe(true);
    expect(removeIcon.classList.contains('cursor-pointer')).toBe(true);
  });

  it('should have disabled class on remove icon when disabled', () => {
    fixture.componentRef.setInput('value', mockValue);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const removeIcon = fixture.nativeElement.querySelector('.remove-icon');
    expect(removeIcon.classList.contains('disabled')).toBe(true);
  });

  it('should display placeholder when provided', () => {
    const placeholder = 'Enter value';
    fixture.componentRef.setInput('value', mockValue);
    fixture.componentRef.setInput('placeholder', placeholder);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.placeholder).toBe(placeholder);
  });
});
