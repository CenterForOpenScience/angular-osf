import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FILTER_PLACEHOLDERS } from '@shared/constants/filter-placeholders';
import { DiscoverableFilter } from '@shared/models';

import { ReusableFilterComponent } from './reusable-filter.component';

describe('ReusableFilterComponent', () => {
  let component: ReusableFilterComponent;
  let fixture: ComponentFixture<ReusableFilterComponent>;
  let componentRef: ComponentRef<ReusableFilterComponent>;

  const mockFilters: DiscoverableFilter[] = [
    {
      key: 'subject',
      label: 'Subject',
      type: 'select',
      operator: 'eq',
      description: 'Filter by subject area',
      helpLink: 'https://help.example.com/subjects',
      helpLinkText: 'Learn about subjects',
      resultCount: 150,
      hasOptions: true,
      options: [
        { label: 'Psychology', value: 'psychology' },
        { label: 'Biology', value: 'biology' },
      ],
    },
    {
      key: 'resourceType',
      label: 'Resource Type',
      type: 'select',
      operator: 'eq',
      options: [
        { label: 'Project', value: 'project' },
        { label: 'Registration', value: 'registration' },
      ],
    },
    {
      key: 'creator',
      label: 'Creator',
      type: 'select',
      operator: 'eq',
      hasOptions: true,
    },
    {
      key: 'accessService',
      label: 'Access Service',
      type: 'select',
      operator: 'eq',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableFilterComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableFilterComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should have default input values', () => {
      expect(component.filters()).toEqual([]);
      expect(component.selectedValues()).toEqual({});
      expect(component.isLoading()).toBe(false);
      expect(component.showEmptyState()).toBe(true);
    });

    it('should have access to FILTER_PLACEHOLDERS constant', () => {
      expect(component.FILTER_PLACEHOLDERS).toBe(FILTER_PLACEHOLDERS);
    });

    it('should initialize with empty expandedFilters signal', () => {
      expect(component['expandedFilters']()).toEqual(new Set());
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      componentRef.setInput('isLoading', true);
      fixture.detectChanges();
    });

    it('should display loading state when isLoading is true', () => {
      const loadingElement = fixture.debugElement.query(By.css('.text-center.text-gray-500 p'));
      expect(loadingElement).toBeTruthy();
      expect(loadingElement.nativeElement.textContent.trim()).toBe('Loading filters...');
    });

    it('should not display filters or empty state when loading', () => {
      const accordion = fixture.debugElement.query(By.css('p-accordion'));
      const emptyState = fixture.debugElement.query(By.css('.text-center.text-gray-500.py-4'));

      expect(accordion).toBeFalsy();
      expect(emptyState).toBeFalsy();
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      componentRef.setInput('filters', []);
      componentRef.setInput('showEmptyState', true);
      fixture.detectChanges();
    });

    it('should display empty state when no filters and showEmptyState is true', () => {
      const emptyState = fixture.debugElement.query(By.css('.text-center.text-gray-500.py-4 p'));
      expect(emptyState).toBeTruthy();
      expect(emptyState.nativeElement.textContent.trim()).toBe('No filters available');
    });

    it('should not display empty state when showEmptyState is false', () => {
      componentRef.setInput('showEmptyState', false);
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('.text-center.text-gray-500.py-4'));
      expect(emptyState).toBeFalsy();
    });
  });

  describe('Filters Display', () => {
    beforeEach(() => {
      componentRef.setInput('filters', mockFilters);
      componentRef.setInput('selectedValues', {
        subject: 'psychology',
        creator: 'John Doe',
      });
      fixture.detectChanges();
    });

    it('should display accordion when filters are visible', () => {
      const accordion = fixture.debugElement.query(By.css('p-accordion'));
      expect(accordion).toBeTruthy();
    });

    it('should display visible filters in accordion panels', () => {
      const panels = fixture.debugElement.queryAll(By.css('p-accordion-panel'));
      expect(panels.length).toBe(3);
    });

    it('should display correct filter labels', () => {
      const headers = fixture.debugElement.queryAll(By.css('p-accordion-header'));
      const headerTexts = headers.map((h) => h.nativeElement.textContent.trim());

      expect(headerTexts).toContain('Subject');
      expect(headerTexts).toContain('Resource Type');
      expect(headerTexts).toContain('Creator');
    });
  });

  describe('shouldShowFilter method', () => {
    it('should return false for null or undefined filter', () => {
      expect(component.shouldShowFilter(null as unknown as DiscoverableFilter)).toBe(false);
      expect(component.shouldShowFilter(undefined as unknown as DiscoverableFilter)).toBe(false);
    });

    it('should return false for filter without key', () => {
      const filter = { label: 'Test' } as DiscoverableFilter;
      expect(component.shouldShowFilter(filter)).toBe(false);
    });

    it('should return true for resourceType/accessService only if they have options', () => {
      const filterWithOptions = {
        key: 'resourceType',
        options: [{ label: 'Test', value: 'test' }],
      } as DiscoverableFilter;
      const filterWithoutOptions = { key: 'resourceType' } as DiscoverableFilter;

      expect(component.shouldShowFilter(filterWithOptions)).toBe(true);
      expect(component.shouldShowFilter(filterWithoutOptions)).toBe(false);
    });

    it('should return true for filters with result count', () => {
      const filter = { key: 'subject', resultCount: 10 } as DiscoverableFilter;
      expect(component.shouldShowFilter(filter)).toBe(true);
    });

    it('should return true for filters with options', () => {
      const filter = { key: 'subject', options: [{ label: 'Test', value: 'test' }] } as DiscoverableFilter;
      expect(component.shouldShowFilter(filter)).toBe(true);
    });

    it('should return true for filters with hasOptions flag', () => {
      const filter = { key: 'subject', hasOptions: true } as DiscoverableFilter;
      expect(component.shouldShowFilter(filter)).toBe(true);
    });

    it('should return true for filters with selected values', () => {
      const filter: DiscoverableFilter = {
        key: 'subject',
        label: 'Subject',
        type: 'select',
        operator: 'eq',
        selectedValues: [{ label: 'Test', value: 'test' }],
      };
      expect(component.shouldShowFilter(filter)).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    it('should compute hasFilters correctly', () => {
      componentRef.setInput('filters', []);
      expect(component.hasFilters()).toBe(false);

      componentRef.setInput('filters', mockFilters);
      expect(component.hasFilters()).toBe(true);
    });

    it('should compute visibleFilters correctly', () => {
      componentRef.setInput('filters', mockFilters);
      const visible = component.visibleFilters();

      expect(visible.length).toBe(3);
      expect(visible.map((f) => f.key)).toEqual(['subject', 'resourceType', 'creator']);
    });

    it('should compute hasVisibleFilters correctly', () => {
      componentRef.setInput('filters', []);
      expect(component.hasVisibleFilters()).toBe(false);

      componentRef.setInput('filters', mockFilters);
      expect(component.hasVisibleFilters()).toBe(true);
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();
    });

    it('should emit loadFilterOptions when accordion is toggled and filter needs options', () => {
      spyOn(component.loadFilterOptions, 'emit');

      const filterNeedingOptions: DiscoverableFilter = {
        key: 'creator',
        label: 'Creator',
        type: 'select',
        operator: 'eq',
        hasOptions: true,
      };
      componentRef.setInput('filters', [filterNeedingOptions]);
      fixture.detectChanges();

      component.onAccordionToggle('creator');

      expect(component.loadFilterOptions.emit).toHaveBeenCalledWith({
        filterType: 'creator',
        filter: filterNeedingOptions,
      });
    });

    it('should not emit loadFilterOptions when filter already has options', () => {
      spyOn(component.loadFilterOptions, 'emit');

      component.onAccordionToggle('subject');

      expect(component.loadFilterOptions.emit).not.toHaveBeenCalled();
    });

    it('should emit filterValueChanged when filter value changes', () => {
      spyOn(component.filterValueChanged, 'emit');

      component.onFilterChanged('subject', 'biology');

      expect(component.filterValueChanged.emit).toHaveBeenCalledWith({
        filterType: 'subject',
        value: 'biology',
      });
    });

    it('should handle array filterKey in onAccordionToggle', () => {
      spyOn(component.loadFilterOptions, 'emit');

      component.onAccordionToggle(['subject', 'other']);

      expect(component['expandedFilters']().has('subject')).toBe(true);
    });

    it('should handle empty filterKey in onAccordionToggle', () => {
      const initialExpanded = new Set(component['expandedFilters']());

      component.onAccordionToggle('');
      component.onAccordionToggle(null as unknown as string);

      expect(component['expandedFilters']()).toEqual(initialExpanded);
    });
  });

  describe('Helper Methods', () => {
    const testFilter: DiscoverableFilter = {
      key: 'subject',
      label: 'Subject',
      type: 'select',
      operator: 'eq',
      description: 'Test description',
      helpLink: 'https://help.test.com',
      helpLinkText: 'Custom help text',
      resultCount: 42,
      options: [{ label: 'Test Option', value: 'test' }],
      isLoading: true,
    };

    it('should return correct filter options', () => {
      expect(component.getFilterOptions(testFilter)).toEqual(testFilter.options || []);
      expect(component.getFilterOptions({} as DiscoverableFilter)).toEqual([]);
    });

    it('should return correct loading state', () => {
      expect(component.isFilterLoading(testFilter)).toBe(true);
      expect(component.isFilterLoading({} as DiscoverableFilter)).toBe(false);
    });

    it('should return correct selected value', () => {
      componentRef.setInput('selectedValues', { subject: 'psychology' });

      expect(component.getSelectedValue('subject')).toBe('psychology');
      expect(component.getSelectedValue('nonexistent')).toBe(null);
    });

    it('should return correct filter placeholder', () => {
      expect(component.getFilterPlaceholder('subject')).toBe('Select subject');
      expect(component.getFilterPlaceholder('unknown')).toBe('Search...');
    });

    it('should return correct filter description', () => {
      expect(component.getFilterDescription(testFilter)).toBe('Test description');
      expect(component.getFilterDescription({} as DiscoverableFilter)).toBe(null);
    });

    it('should return correct filter help link', () => {
      expect(component.getFilterHelpLink(testFilter)).toBe('https://help.test.com');
      expect(component.getFilterHelpLink({} as DiscoverableFilter)).toBe(null);
    });

    it('should return correct filter help link text', () => {
      expect(component.getFilterHelpLinkText(testFilter)).toBe('Custom help text');
      expect(component.getFilterHelpLinkText({} as DiscoverableFilter)).toBe('Learn more');
    });

    it('should return correct filter label with fallbacks', () => {
      expect(component.getFilterLabel(testFilter)).toBe('Subject');
      expect(component.getFilterLabel({ key: 'test' } as DiscoverableFilter)).toBe('test');
      expect(component.getFilterLabel({} as DiscoverableFilter)).toBe('Filter');
    });

    it('should determine filter content correctly', () => {
      expect(component.hasFilterContent(testFilter)).toBe(true);

      const emptyFilter = {} as DiscoverableFilter;
      expect(component.hasFilterContent(emptyFilter)).toBe(false);

      const filterWithOnlyHasOptions = { hasOptions: true } as DiscoverableFilter;
      expect(component.hasFilterContent(filterWithOnlyHasOptions)).toBe(true);
    });
  });

  describe('Expanded Filters State', () => {
    beforeEach(() => {
      componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();
    });

    it('should toggle expanded state correctly', () => {
      expect(component['expandedFilters']().has('subject')).toBe(false);

      component.onAccordionToggle('subject');
      expect(component['expandedFilters']().has('subject')).toBe(true);

      component.onAccordionToggle('subject');
      expect(component['expandedFilters']().has('subject')).toBe(false);
    });

    it('should handle multiple expanded filters', () => {
      component.onAccordionToggle('subject');
      component.onAccordionToggle('creator');

      expect(component['expandedFilters']().has('subject')).toBe(true);
      expect(component['expandedFilters']().has('creator')).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      componentRef.setInput('filters', mockFilters);
      componentRef.setInput('selectedValues', { subject: 'psychology' });
      fixture.detectChanges();
    });

    it('should pass correct props to generic filter components', () => {
      const genericFilters = fixture.debugElement.queryAll(By.css('osf-generic-filter'));
      expect(genericFilters.length).toBeGreaterThan(0);

      const subjectFilter = genericFilters.find((gf) => gf.componentInstance.filterType === 'subject');

      if (subjectFilter) {
        expect(subjectFilter.componentInstance.selectedValue).toBe('psychology');
        expect(subjectFilter.componentInstance.placeholder).toBe('Select subject');
        expect(subjectFilter.componentInstance.editable).toBe(true);
      }
    });

    it('should handle filter value change events from generic filter', () => {
      spyOn(component, 'onFilterChanged');

      const genericFilter = fixture.debugElement.query(By.css('osf-generic-filter'));
      if (genericFilter) {
        genericFilter.componentInstance.valueChanged.emit('new-value');

        expect(component.onFilterChanged).toHaveBeenCalled();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed filter data gracefully', () => {
      const malformedFilters = [
        null,
        undefined,
        { key: null },
        { key: '', label: '' },
        { key: 'valid', options: null },
      ] as unknown as DiscoverableFilter[];

      expect(() => {
        componentRef.setInput('filters', malformedFilters);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle empty selected values', () => {
      componentRef.setInput('selectedValues', {});
      componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();

      expect(component.getSelectedValue('subject')).toBe(null);
    });

    it('should handle filters without required properties', () => {
      const minimalFilter = { key: 'minimal' } as DiscoverableFilter;

      expect(component.getFilterLabel(minimalFilter)).toBe('minimal');
      expect(component.getFilterDescription(minimalFilter)).toBe(null);
      expect(component.hasFilterContent(minimalFilter)).toBe(false);
    });
  });
});
