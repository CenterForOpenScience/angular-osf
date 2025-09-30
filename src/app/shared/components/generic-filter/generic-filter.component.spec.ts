import { SelectChangeEvent } from 'primeng/select';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SelectOption } from '@shared/models';

import { GenericFilterComponent } from './generic-filter.component';

import { jest } from '@jest/globals';

describe('GenericFilterComponent', () => {
  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  let componentRef: ComponentRef<GenericFilterComponent>;

  const mockOptions: SelectOption[] = [
    { label: 'Option 1', value: 'value1' },
    { label: 'Option 2', value: 'value2' },
    { label: 'Option 3', value: 'value3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericFilterComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should initialize with default values', () => {
      expect(component.options()).toEqual([]);
      expect(component.isLoading()).toBe(false);
      expect(component.selectedValue()).toBeNull();
      expect(component.placeholder()).toBe('');
      expect(component.filterType()).toBe('');
    });

    it('should accept options input', () => {
      componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      expect(component.options()).toEqual(mockOptions);
    });

    it('should accept isLoading input', () => {
      componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      expect(component.isLoading()).toBe(true);
    });

    it('should accept selectedValue input', () => {
      componentRef.setInput('selectedValue', 'value1');
      fixture.detectChanges();

      expect(component.selectedValue()).toBe('value1');
    });

    it('should accept placeholder input', () => {
      componentRef.setInput('placeholder', 'Select an option');
      fixture.detectChanges();

      expect(component.placeholder()).toBe('Select an option');
    });

    it('should accept filterType input', () => {
      componentRef.setInput('filterType', 'subject');
      fixture.detectChanges();

      expect(component.filterType()).toBe('subject');
    });
  });

  describe('Computed Properties', () => {
    it('should return empty array when no options provided', () => {
      expect(component.filterOptions()).toEqual([]);
    });

    it('should filter out options without labels', () => {
      const optionsWithEmpty: SelectOption[] = [
        { label: 'Valid Option', value: 'valid' },
        { label: '', value: 'empty' },
        { label: 'Another Valid', value: 'valid2' },
      ];

      componentRef.setInput('options', optionsWithEmpty);
      fixture.detectChanges();

      const filteredOptions = component.filterOptions();
      expect(filteredOptions).toHaveLength(2);
      expect(filteredOptions[0].label).toBe('Valid Option');
      expect(filteredOptions[1].label).toBe('Another Valid');
    });

    it('should map options correctly', () => {
      componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      const filteredOptions = component.filterOptions();
      expect(filteredOptions[0]).toEqual({ label: 'Option 1', value: 'value1' });
      expect(filteredOptions[1]).toEqual({ label: 'Option 2', value: 'value2' });
      expect(filteredOptions[2]).toEqual({ label: 'Option 3', value: 'value3' });
    });

    it('should sort options alphabetically by label', () => {
      const unsortedOptions: SelectOption[] = [
        { label: 'Zebra', value: 'zebra' },
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
      ];

      componentRef.setInput('options', unsortedOptions);
      fixture.detectChanges();

      const filteredOptions = component.filterOptions();
      expect(filteredOptions[0].label).toBe('Zebra');
      expect(filteredOptions[1].label).toBe('Apple');
      expect(filteredOptions[2].label).toBe('Banana');
    });

    it('should handle dateCreated filter type differently', () => {
      const dateOptions: SelectOption[] = [
        { label: '2023-01-01', value: 'date1' },
        { label: '2023-12-31', value: 'date2' },
        { label: '2023-06-15', value: 'date3' },
      ];

      componentRef.setInput('options', dateOptions);
      componentRef.setInput('filterType', 'dateCreated');
      fixture.detectChanges();

      const filteredOptions = component.filterOptions();
      expect(filteredOptions[0].label).toBe('2023-01-01');
      expect(filteredOptions[1].label).toBe('2023-12-31');
      expect(filteredOptions[2].label).toBe('2023-06-15');
    });
  });

  describe('Current Selected Option Signal', () => {
    beforeEach(() => {
      componentRef.setInput('options', mockOptions);
      fixture.detectChanges();
    });

    it('should set currentSelectedOption to null when no value selected', () => {
      componentRef.setInput('selectedValue', null);
      fixture.detectChanges();

      expect(component.currentSelectedOption()).toBeNull();
    });

    it('should set currentSelectedOption when selectedValue matches an option', () => {
      componentRef.setInput('selectedValue', 'value2');
      fixture.detectChanges();

      const currentOption = component.currentSelectedOption();
      expect(currentOption).toEqual({ label: 'Option 2', value: 'value2' });
    });

    it('should set currentSelectedOption to null when selectedValue does not match any option', () => {
      componentRef.setInput('selectedValue', 'nonexistent');
      fixture.detectChanges();

      expect(component.currentSelectedOption()).toBeNull();
    });

    it('should update currentSelectedOption when selectedValue changes', () => {
      componentRef.setInput('selectedValue', 'value1');
      fixture.detectChanges();

      expect(component.currentSelectedOption()).toEqual({ label: 'Option 1', value: 'value1' });

      componentRef.setInput('selectedValue', 'value3');
      fixture.detectChanges();

      expect(component.currentSelectedOption()).toEqual({ label: 'Option 3', value: 'value3' });
    });
  });

  describe('Template Rendering', () => {
    it('should show loading spinner when isLoading is true', () => {
      componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const loadingSpinner = fixture.debugElement.query(By.css('osf-loading-spinner'));
      const selectElement = fixture.debugElement.query(By.css('p-select'));

      expect(loadingSpinner).toBeTruthy();
      expect(selectElement).toBeFalsy();
    });

    it('should show select component when isLoading is false', () => {
      componentRef.setInput('isLoading', false);
      fixture.detectChanges();

      const loadingSpinner = fixture.debugElement.query(By.css('osf-loading-spinner'));
      const selectElement = fixture.debugElement.query(By.css('p-select'));

      expect(loadingSpinner).toBeFalsy();
      expect(selectElement).toBeTruthy();
    });

    it('should pass correct properties to p-select', () => {
      componentRef.setInput('options', mockOptions);
      componentRef.setInput('selectedValue', 'value1');
      componentRef.setInput('placeholder', 'Choose option');
      componentRef.setInput('filterType', 'subject');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('p-select'));
      expect(selectElement).toBeTruthy();

      expect(selectElement.nativeElement.getAttribute('ng-reflect-id')).toBe('subject');
      expect(selectElement.nativeElement.getAttribute('ng-reflect-style-class')).toBe('w-full');
      expect(selectElement.nativeElement.getAttribute('ng-reflect-append-to')).toBe('body');

      expect(selectElement).toBeTruthy();
    });

    it('should show selected option label as placeholder when option is selected', () => {
      componentRef.setInput('options', mockOptions);
      componentRef.setInput('selectedValue', 'value2');
      componentRef.setInput('placeholder', 'Default placeholder');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('p-select'));
      expect(selectElement.nativeElement.getAttribute('ng-reflect-placeholder')).toBe('Option 2');
    });

    it('should show default placeholder when no option is selected', () => {
      componentRef.setInput('options', mockOptions);
      componentRef.setInput('selectedValue', null);
      componentRef.setInput('placeholder', 'Default placeholder');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('p-select'));
      expect(selectElement.nativeElement.getAttribute('ng-reflect-placeholder')).toBe('Default placeholder');
    });

    it('should not show clear button when no value is selected', () => {
      componentRef.setInput('selectedValue', null);
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('p-select'));

      expect(selectElement).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      componentRef.setInput('options', mockOptions);
      fixture.detectChanges();
    });

    it('should emit valueChanged when onValueChange is called with a value', () => {
      jest.spyOn(component.optionChanged, 'emit');

      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: 'value2',
      };

      component.onOptionChange(mockEvent);

      expect(component.optionChanged.emit).toHaveBeenCalledWith({ label: 'Option 2', value: 'value2' });
    });

    it('should emit null when onValueChange is called with null value', () => {
      jest.spyOn(component.optionChanged, 'emit');

      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: null,
      };

      component.onOptionChange(mockEvent);

      expect(component.optionChanged.emit).toHaveBeenCalledWith(null);
    });

    it('should update currentSelectedOption when onValueChange is called', () => {
      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: 'value3',
      };

      component.onOptionChange(mockEvent);

      expect(component.currentSelectedOption()).toEqual({ label: 'Option 3', value: 'value3' });
    });

    it('should set currentSelectedOption to null when clearing selection', () => {
      componentRef.setInput('selectedValue', 'value1');
      fixture.detectChanges();

      expect(component.currentSelectedOption()).toEqual({ label: 'Option 1', value: 'value1' });

      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: null,
      };

      component.onOptionChange(mockEvent);

      expect(component.currentSelectedOption()).toBeNull();
    });

    it('should trigger onChange event in template', () => {
      jest.spyOn(component, 'onOptionChange');

      const selectElement = fixture.debugElement.query(By.css('p-select'));
      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: 'value1',
      };

      selectElement.triggerEventHandler('onChange', mockEvent);

      expect(component.onOptionChange).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      componentRef.setInput('options', []);
      fixture.detectChanges();

      expect(component.filterOptions()).toEqual([]);
      expect(component.currentSelectedOption()).toBeNull();
    });

    it('should handle options with null or undefined labels', () => {
      const problematicOptions = [
        { label: 'Valid', value: 'valid' },
        { label: null, value: 'null-label' },
        { label: undefined, value: 'undefined-label' },
      ];

      componentRef.setInput('options', problematicOptions);
      fixture.detectChanges();

      const filteredOptions = component.filterOptions();
      expect(filteredOptions).toHaveLength(1);
      expect(filteredOptions[0].label).toBe('Valid');
    });
  });

  describe('Accessibility', () => {
    it('should set proper id attribute for the select element', () => {
      componentRef.setInput('filterType', 'subject-filter');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('p-select'));
      expect(selectElement.nativeElement.getAttribute('ng-reflect-id')).toBe('subject-filter');
    });

    it('should always enable filter', () => {
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('p-select'));
      expect(selectElement).toBeTruthy();
    });
  });
});
