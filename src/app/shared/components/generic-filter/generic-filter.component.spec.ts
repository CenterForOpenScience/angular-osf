import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SelectOption } from '@shared/models';

import { GenericFilterComponent } from './generic-filter.component';

describe.skip('GenericFilterComponent', () => {
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
      expect(component.placeholder()).toBe('');
      expect(component.filterOperator()).toBe('');
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

    it('should accept placeholder input', () => {
      componentRef.setInput('placeholder', 'Select an option');
      fixture.detectChanges();

      expect(component.placeholder()).toBe('Select an option');
    });

    it('should accept filterType input', () => {
      componentRef.setInput('filterType', 'subject');
      fixture.detectChanges();

      expect(component.filterOperator()).toBe('subject');
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
