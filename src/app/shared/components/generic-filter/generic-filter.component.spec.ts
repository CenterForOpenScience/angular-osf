import { Select, SelectChangeEvent } from 'primeng/select';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { LoadingSpinnerComponent } from '@shared/components';
import { SelectOption } from '@shared/models';

import { GenericFilterComponent } from './generic-filter.component';

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
      imports: [GenericFilterComponent, FormsModule, Select, LoadingSpinnerComponent],
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
      expect(component.editable()).toBe(false);
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

    it('should accept editable input', () => {
      componentRef.setInput('editable', true);
      fixture.detectChanges();

      expect(component.editable()).toBe(true);
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
      expect(filteredOptions).toHaveLength(3);
      expect(filteredOptions[0]).toEqual({ label: 'Option 1', value: 'value1' });
      expect(filteredOptions[1]).toEqual({ label: 'Option 2', value: 'value2' });
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

      const loadingSpinner = fixture.debugElement.query(By.directive(LoadingSpinnerComponent));
      const selectElement = fixture.debugElement.query(By.directive(Select));

      expect(loadingSpinner).toBeTruthy();
      expect(selectElement).toBeFalsy();
    });

    it('should show select component when isLoading is false', () => {
      componentRef.setInput('isLoading', false);
      fixture.detectChanges();

      const loadingSpinner = fixture.debugElement.query(By.directive(LoadingSpinnerComponent));
      const selectElement = fixture.debugElement.query(By.directive(Select));

      expect(loadingSpinner).toBeFalsy();
      expect(selectElement).toBeTruthy();
    });

    it('should pass correct properties to p-select', () => {
      componentRef.setInput('options', mockOptions);
      componentRef.setInput('selectedValue', 'value1');
      componentRef.setInput('placeholder', 'Choose option');
      componentRef.setInput('editable', true);
      componentRef.setInput('filterType', 'subject');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.directive(Select));
      const selectComponent = selectElement.componentInstance;

      expect(selectComponent.id).toBe('subject');
      expect(selectComponent.options).toEqual(component.filterOptions());
      expect(selectComponent.optionLabel).toBe('label');
      expect(selectComponent.optionValue).toBe('value');
      expect(selectComponent.ngModel).toBe('value1');
      expect(selectComponent.editable).toBe(true);
      expect(selectComponent.styleClass).toBe('w-full');
      expect(selectComponent.appendTo).toBe('body');
      expect(selectComponent.filter).toBe(true);
      expect(selectComponent.showClear).toBe(true);
    });

    it('should show selected option label as placeholder when option is selected', () => {
      componentRef.setInput('options', mockOptions);
      componentRef.setInput('selectedValue', 'value2');
      componentRef.setInput('placeholder', 'Default placeholder');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.directive(Select));
      const selectComponent = selectElement.componentInstance;

      expect(selectComponent.placeholder).toBe('Option 2');
    });

    it('should show default placeholder when no option is selected', () => {
      componentRef.setInput('options', mockOptions);
      componentRef.setInput('selectedValue', null);
      componentRef.setInput('placeholder', 'Default placeholder');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.directive(Select));
      const selectComponent = selectElement.componentInstance;

      expect(selectComponent.placeholder).toBe('Default placeholder');
    });

    it('should not show clear button when no value is selected', () => {
      componentRef.setInput('selectedValue', null);
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.directive(Select));
      const selectComponent = selectElement.componentInstance;

      expect(selectComponent.showClear).toBe(false);
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      componentRef.setInput('options', mockOptions);
      fixture.detectChanges();
    });

    it('should emit valueChanged when onValueChange is called with a value', () => {
      spyOn(component.valueChanged, 'emit');

      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: 'value2',
      };

      component.onValueChange(mockEvent);

      expect(component.valueChanged.emit).toHaveBeenCalledWith('value2');
    });

    it('should emit null when onValueChange is called with null value', () => {
      spyOn(component.valueChanged, 'emit');

      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: null,
      };

      component.onValueChange(mockEvent);

      expect(component.valueChanged.emit).toHaveBeenCalledWith(null);
    });

    it('should update currentSelectedOption when onValueChange is called', () => {
      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: 'value3',
      };

      component.onValueChange(mockEvent);

      expect(component.currentSelectedOption()).toEqual({ label: 'Option 3', value: 'value3' });
    });

    it('should set currentSelectedOption to null when clearing selection', () => {
      // First select an option
      componentRef.setInput('selectedValue', 'value1');
      fixture.detectChanges();

      expect(component.currentSelectedOption()).toEqual({ label: 'Option 1', value: 'value1' });

      // Then clear it
      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: null,
      };

      component.onValueChange(mockEvent);

      expect(component.currentSelectedOption()).toBeNull();
    });

    it('should trigger onChange event in template', () => {
      spyOn(component, 'onValueChange');

      const selectElement = fixture.debugElement.query(By.directive(Select));
      const selectComponent = selectElement.componentInstance;

      const mockEvent: SelectChangeEvent = {
        originalEvent: new Event('change'),
        value: 'value1',
      };

      selectComponent.onChange.emit(mockEvent);

      expect(component.onValueChange).toHaveBeenCalledWith(mockEvent);
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

    it('should handle selectedValue that becomes invalid when options change', () => {
      componentRef.setInput('options', mockOptions);
      componentRef.setInput('selectedValue', 'value2');
      fixture.detectChanges();

      expect(component.currentSelectedOption()).toEqual({ label: 'Option 2', value: 'value2' });

      // Change options to not include the selected value
      const newOptions: SelectOption[] = [{ label: 'New Option', value: 'new-value' }];
      componentRef.setInput('options', newOptions);
      fixture.detectChanges();

      expect(component.currentSelectedOption()).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should set proper id attribute for the select element', () => {
      componentRef.setInput('filterType', 'subject-filter');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.directive(Select));
      const selectComponent = selectElement.componentInstance;

      expect(selectComponent.id).toBe('subject-filter');
    });

    it('should enable filter when editable is true', () => {
      componentRef.setInput('editable', true);
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.directive(Select));
      const selectComponent = selectElement.componentInstance;

      expect(selectComponent.filter).toBe(true);
    });

    it('should disable filter when editable is false', () => {
      componentRef.setInput('editable', false);
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.directive(Select));
      const selectComponent = selectElement.componentInstance;

      expect(selectComponent.filter).toBe(false);
    });
  });
});
