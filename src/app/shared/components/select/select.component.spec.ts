import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Primitive } from '@shared/helpers';
import { SelectOption } from '@shared/models/select-option.model';

import { SelectComponent } from './select.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  const mockOptions: SelectOption[] = [
    { label: 'Option 1', value: 'value1' },
    { label: 'Option 2', value: 'value2' },
    { label: 'Option 3', value: 'value3' },
  ];

  const mockNumericOptions: SelectOption[] = [
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set placeholder input correctly', () => {
    fixture.componentRef.setInput('placeholder', 'Select an option');
    expect(component.placeholder()).toBe('Select an option');
  });

  it('should set appendTo input correctly', () => {
    fixture.componentRef.setInput('appendTo', 'body');
    expect(component.appendTo()).toBe('body');
  });

  it('should set fullWidth input correctly', () => {
    fixture.componentRef.setInput('fullWidth', true);
    expect(component.fullWidth()).toBe(true);
  });

  it('should set noBorder input correctly', () => {
    fixture.componentRef.setInput('noBorder', true);
    expect(component.noBorder()).toBe(true);
  });

  it('should set disabled input correctly', () => {
    fixture.componentRef.setInput('disabled', true);
    expect(component.disabled()).toBe(true);
  });

  it('should have changeValue output', () => {
    expect(component.changeValue).toBeDefined();
  });

  it('should emit changeValue when triggered', () => {
    const changeValueSpy = jest.fn();
    component.changeValue.subscribe(changeValueSpy);

    const testValue: Primitive = 'new-value';
    (component as any).changeValue.emit(testValue);

    expect(changeValueSpy).toHaveBeenCalledWith(testValue);
  });

  it('should handle string selectedValue', () => {
    fixture.componentRef.setInput('selectedValue', 'test-string');
    expect(component.selectedValue()).toBe('test-string');
  });

  it('should handle number selectedValue', () => {
    fixture.componentRef.setInput('selectedValue', 123);
    expect(component.selectedValue()).toBe(123);
  });

  it('should handle boolean selectedValue', () => {
    fixture.componentRef.setInput('selectedValue', true);
    expect(component.selectedValue()).toBe(true);
  });

  it('should handle null selectedValue', () => {
    fixture.componentRef.setInput('selectedValue', null);
    expect(component.selectedValue()).toBe(null);
  });

  it('should handle undefined selectedValue', () => {
    fixture.componentRef.setInput('selectedValue', undefined);
    expect(component.selectedValue()).toBe(undefined);
  });

  it('should handle string value options', () => {
    fixture.componentRef.setInput('options', mockOptions);
    expect(component.options()).toEqual(mockOptions);
  });

  it('should handle numeric value options', () => {
    fixture.componentRef.setInput('options', mockNumericOptions);
    expect(component.options()).toEqual(mockNumericOptions);
  });

  it('should handle boolean value options', () => {
    const booleanOptions: SelectOption[] = [
      { label: 'True', value: true },
      { label: 'False', value: false },
    ];
    fixture.componentRef.setInput('options', booleanOptions);
    expect(component.options()).toEqual(booleanOptions);
  });

  it('should handle empty options array', () => {
    fixture.componentRef.setInput('options', []);
    expect(component.options()).toEqual([]);
  });
});
