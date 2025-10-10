import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FilterOperator, FilterOption } from '@shared/models';

import { GenericFilterComponent } from './generic-filter.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('GenericFilterComponent', () => {
  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  let componentRef: ComponentRef<GenericFilterComponent>;

  const mockOptions: FilterOption[] = [
    { label: 'Option 1', value: 'value1', cardSearchResultCount: 10 },
    { label: 'Option 2', value: 'value2', cardSearchResultCount: 20 },
    { label: 'Option 3', value: 'value3', cardSearchResultCount: 30 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFilterComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericFilterComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should initialize with default values', () => {
      expect(component.options()).toEqual([]);
      expect(component.searchResults()).toEqual([]);
      expect(component.isLoading()).toBe(false);
      expect(component.isPaginationLoading()).toBe(false);
      expect(component.isSearchLoading()).toBe(false);
      expect(component.selectedOptions()).toEqual([]);
      expect(component.placeholder()).toBe('');
      expect(component.filterOperator()).toBe(FilterOperator.AnyOf);
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

    it('should accept filterOperator input', () => {
      componentRef.setInput('filterOperator', FilterOperator.Date);
      fixture.detectChanges();

      expect(component.filterOperator()).toBe(FilterOperator.Date);
    });

    it('should accept selectedOptions input', () => {
      const selected = [mockOptions[0]];
      componentRef.setInput('selectedOptions', selected);
      fixture.detectChanges();

      expect(component.selectedOptions()).toEqual(selected);
    });

    it('should accept searchResults input', () => {
      const searchResults = [mockOptions[1]];
      componentRef.setInput('searchResults', searchResults);
      fixture.detectChanges();

      expect(component.searchResults()).toEqual(searchResults);
    });
  });

  describe('Computed Properties', () => {
    it('should return empty array when no options provided', () => {
      expect(component.filterOptions()).toEqual([]);
    });

    it('should return base options when no search results', () => {
      componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      const filteredOptions = component.filterOptions();
      expect(filteredOptions.length).toBe(3);
      expect(filteredOptions).toEqual(mockOptions);
    });

    it('should merge search results with base options', () => {
      const baseOptions = [mockOptions[0]];
      const searchResults = [mockOptions[1]];

      componentRef.setInput('options', baseOptions);
      componentRef.setInput('searchResults', searchResults);
      fixture.detectChanges();

      const filteredOptions = component.filterOptions();
      expect(filteredOptions.length).toBe(2);
    });

    it('should compute selectedOptionValues correctly', () => {
      const selected = [mockOptions[0], mockOptions[2]];
      componentRef.setInput('selectedOptions', selected);
      fixture.detectChanges();

      const values = component.selectedOptionValues();
      expect(values).toEqual(['value1', 'value3']);
    });

    it('should return empty array for selectedOptionValues when no selection', () => {
      expect(component.selectedOptionValues()).toEqual([]);
    });
  });

  describe('Template Rendering', () => {
    it('should show loading spinner when isLoading is true', () => {
      componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const loadingSpinner = fixture.debugElement.query(By.css('osf-loading-spinner'));
      const multiSelectElement = fixture.debugElement.query(By.css('p-multiselect'));

      expect(loadingSpinner).toBeTruthy();
      expect(multiSelectElement).toBeFalsy();
    });

    it('should show multiselect component when isLoading is false', () => {
      componentRef.setInput('isLoading', false);
      fixture.detectChanges();

      const loadingSpinner = fixture.debugElement.query(By.css('osf-loading-spinner'));
      const multiSelectElement = fixture.debugElement.query(By.css('p-multiselect'));

      expect(loadingSpinner).toBeFalsy();
      expect(multiSelectElement).toBeTruthy();
    });
  });

  describe('Event Handlers', () => {
    it('should emit selectedOptionsChanged on multi select change', () => {
      const spy = jest.fn();
      component.selectedOptionsChanged.subscribe(spy);
      componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      component.onMultiChange({ value: ['value1', 'value2'] } as any);

      expect(spy).toHaveBeenCalledWith([mockOptions[0], mockOptions[1]]);
    });

    it('should handle empty value in onMultiChange', () => {
      const spy = jest.fn();
      component.selectedOptionsChanged.subscribe(spy);

      component.onMultiChange({ value: [] } as any);

      expect(spy).toHaveBeenCalledWith([]);
    });
  });
});
