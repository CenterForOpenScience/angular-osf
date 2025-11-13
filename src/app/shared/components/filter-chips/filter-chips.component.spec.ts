import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DiscoverableFilter,
  FilterOperatorOption,
  FilterOption,
} from '@osf/shared/models/search/discaverable-filter.model';

import { FilterChipsComponent } from './filter-chips.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FilterChipsComponent', () => {
  let component: FilterChipsComponent;
  let fixture: ComponentFixture<FilterChipsComponent>;

  const mockFilters: DiscoverableFilter[] = [
    {
      key: 'subject',
      label: 'Subject',
      operator: FilterOperatorOption.IsPresent,
      resultCount: 100,
      options: [
        { label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 },
        { label: 'Biology', value: 'biology', cardSearchResultCount: 30 },
      ],
    },
    {
      key: 'resourceType',
      label: 'Resource Type',
      operator: FilterOperatorOption.IsPresent,
      resultCount: 75,
      options: [
        { label: 'Project', value: 'project', cardSearchResultCount: 40 },
        { label: 'Registration', value: 'registration', cardSearchResultCount: 35 },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterChipsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterChipsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept filters as required input', () => {
      fixture.componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();

      expect(component.filters()).toEqual(mockFilters);
    });

    it('should have default empty object for filterOptions', () => {
      fixture.componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();

      expect(component.filterOptions()).toEqual({});
    });

    it('should accept filterOptions input', () => {
      const filterOptions: Record<string, FilterOption[]> = {
        subject: [
          { label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 },
          { label: 'Biology', value: 'biology', cardSearchResultCount: 30 },
        ],
      };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', filterOptions);
      fixture.detectChanges();

      expect(component.filterOptions()).toEqual(filterOptions);
    });
  });

  describe('filterLabels computed', () => {
    it('should create labels from filters', () => {
      fixture.componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();

      const labels = component.filterLabels();
      expect(labels.length).toBe(2);
      expect(labels).toContainEqual({ key: 'subject', label: 'Subject' });
      expect(labels).toContainEqual({ key: 'resourceType', label: 'Resource Type' });
    });

    it('should filter out filters without key or label', () => {
      const filtersWithMissing: DiscoverableFilter[] = [
        ...mockFilters,
        { key: '', label: 'No Key', operator: FilterOperatorOption.IsPresent, resultCount: 10, options: [] },
        { key: 'noLabel', label: '', operator: FilterOperatorOption.IsPresent, resultCount: 10, options: [] },
      ];

      fixture.componentRef.setInput('filters', filtersWithMissing);
      fixture.detectChanges();

      const labels = component.filterLabels();
      expect(labels.length).toBe(2);
      expect(labels.map((l) => l.key)).toEqual(['subject', 'resourceType']);
    });

    it('should return empty array when filters are empty', () => {
      fixture.componentRef.setInput('filters', []);
      fixture.detectChanges();

      const labels = component.filterLabels();
      expect(labels).toEqual([]);
    });
  });

  describe('chips computed', () => {
    it('should create chips from filterOptions', () => {
      const filterOptions: Record<string, FilterOption[]> = {
        subject: [{ label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 }],
        resourceType: [{ label: 'Project', value: 'project', cardSearchResultCount: 40 }],
      };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', filterOptions);
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips.length).toBe(2);
    });

    it('should filter out empty filter options', () => {
      const filterOptions: Record<string, FilterOption[]> = {
        subject: [{ label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 }],
        resourceType: [],
      };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', filterOptions);
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips.length).toBe(1);
      expect(chips[0].key).toBe('subject');
    });

    it('should use filter label from filterLabels', () => {
      const filterOptions: Record<string, FilterOption[]> = {
        subject: [{ label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 }],
      };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', filterOptions);
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips[0].label).toBe('Subject');
    });

    it('should use key as label when filter label not found', () => {
      const filterOptions: Record<string, FilterOption[]> = {
        unknownKey: [{ label: 'Unknown', value: 'unknown', cardSearchResultCount: 10 }],
      };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', filterOptions);
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips[0].label).toBe('unknownKey');
    });

    it('should use option label as displayValue', () => {
      const filterOptions: Record<string, FilterOption[]> = {
        subject: [{ label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 }],
      };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', filterOptions);
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips[0].displayValue).toBe('Psychology');
    });

    it('should use option value as displayValue when label is missing', () => {
      const filterOptions: Record<string, FilterOption[]> = {
        subject: [{ value: 'psychology', cardSearchResultCount: 50 } as FilterOption],
      };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', filterOptions);
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips[0].displayValue).toBe('psychology');
    });

    it('should handle multiple options for single filter', () => {
      const filterOptions: Record<string, FilterOption[]> = {
        subject: [
          { label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 },
          { label: 'Biology', value: 'biology', cardSearchResultCount: 30 },
        ],
      };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', filterOptions);
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips.length).toBe(2);
      expect(chips[0].displayValue).toBe('Psychology');
      expect(chips[1].displayValue).toBe('Biology');
    });

    it('should return empty array when filterOptions is empty', () => {
      fixture.componentRef.setInput('filters', mockFilters);
      fixture.componentRef.setInput('filterOptions', {});
      fixture.detectChanges();

      const chips = component.chips();
      expect(chips).toEqual([]);
    });
  });

  describe('removeFilter', () => {
    it('should emit selectedOptionRemoved with correct data', () => {
      const emitSpy = jest.fn();
      component.selectedOptionRemoved.subscribe(emitSpy);

      const mockOption: FilterOption = { label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();

      component.removeFilter('subject', mockOption);

      expect(emitSpy).toHaveBeenCalledWith({
        filterKey: 'subject',
        optionRemoved: mockOption,
      });
    });

    it('should emit with different filter keys', () => {
      const emitSpy = jest.fn();
      component.selectedOptionRemoved.subscribe(emitSpy);

      const mockOption1: FilterOption = { label: 'Psychology', value: 'psychology', cardSearchResultCount: 50 };
      const mockOption2: FilterOption = { label: 'Project', value: 'project', cardSearchResultCount: 40 };

      fixture.componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();

      component.removeFilter('subject', mockOption1);
      component.removeFilter('resourceType', mockOption2);

      expect(emitSpy).toHaveBeenCalledTimes(2);
      expect(emitSpy).toHaveBeenNthCalledWith(1, {
        filterKey: 'subject',
        optionRemoved: mockOption1,
      });
      expect(emitSpy).toHaveBeenNthCalledWith(2, {
        filterKey: 'resourceType',
        optionRemoved: mockOption2,
      });
    });
  });
});
