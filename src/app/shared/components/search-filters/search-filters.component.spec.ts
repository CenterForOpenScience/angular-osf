import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FILTER_PLACEHOLDERS } from '@shared/constants/filter-placeholders';
import { DiscoverableFilter, FilterOperator, FilterOption } from '@shared/models';

import { SearchFiltersComponent } from './search-filters.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('SearchFiltersComponent', () => {
  let component: SearchFiltersComponent;
  let fixture: ComponentFixture<SearchFiltersComponent>;

  const mockFilters: DiscoverableFilter[] = [
    {
      key: 'subject',
      label: 'Subject',
      operator: FilterOperator.IsPresent,
      resultCount: 150,
      options: [
        { label: 'Psychology', value: 'psychology', cardSearchResultCount: 10 },
        { label: 'Biology', value: 'biology', cardSearchResultCount: 20 },
      ],
    },
    {
      key: 'resourceType',
      label: 'Resource Type',
      operator: FilterOperator.IsPresent,
      resultCount: 100,
      options: [
        { label: 'Project', value: 'project', cardSearchResultCount: 50 },
        { label: 'Registration', value: 'registration', cardSearchResultCount: 30 },
      ],
    },
    {
      key: 'hasData',
      label: 'Has Data',
      operator: FilterOperator.IsPresent,
      resultCount: 75,
    },
  ];

  const mockSelectedOptions: Record<string, FilterOption[]> = {
    subject: [{ label: 'Psychology', value: 'psychology', cardSearchResultCount: 10 }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFiltersComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFiltersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('filters', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    fixture.detectChanges();

    expect(component.filters()).toEqual([]);
    expect(component.selectedOptions()).toEqual({});
    expect(component.filterSearchResults()).toEqual({});
    expect(component.isLoading()).toBe(false);
    expect(component.showEmptyState()).toBe(true);
    expect(component.plainStyle()).toBe(false);
  });

  it('should have access to FILTER_PLACEHOLDERS constant', () => {
    fixture.componentRef.setInput('filters', []);
    fixture.detectChanges();

    expect(component.FILTER_PLACEHOLDERS).toEqual(FILTER_PLACEHOLDERS);
  });

  it('should compute visibleFilters correctly', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const visibleFilters = component.visibleFilters();

    expect(visibleFilters.length).toBe(3);
  });

  it('should filter out invalid filters in visibleFilters', () => {
    const filtersWithInvalid = [
      ...mockFilters,
      { key: '', label: 'Invalid', operator: FilterOperator.IsPresent } as DiscoverableFilter,
      {
        key: 'noCount',
        label: 'No Count',
        operator: FilterOperator.IsPresent,
        resultCount: 0,
        options: [],
      } as DiscoverableFilter,
    ];

    fixture.componentRef.setInput('filters', filtersWithInvalid);
    fixture.detectChanges();

    const visibleFilters = component.visibleFilters();

    expect(visibleFilters.length).toBe(3);
  });

  it('should compute splitFilters correctly', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const splitFilters = component.splitFilters();

    expect(splitFilters.individual.length).toBe(0);
    expect(splitFilters.grouped.length).toBe(3);
    expect(splitFilters.grouped[0].operator).toBe(FilterOperator.IsPresent);
  });

  it('should compute selectedOptionValues from selectedOptions', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('selectedOptions', mockSelectedOptions);
    fixture.detectChanges();

    const selectedValues = component.selectedOptionValues();

    expect(selectedValues).toEqual({ subject: 'psychology' });
  });

  it('should emit loadFilterOptions when onAccordionToggle is called', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.loadFilterOptions, 'emit');

    component.onAccordionToggle('subject');

    expect(emitSpy).toHaveBeenCalledWith(mockFilters[0]);
  });

  it('should not emit loadFilterOptions when filter not found', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.loadFilterOptions, 'emit');

    component.onAccordionToggle('nonexistent');

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit filterOptionSelected when onSelectedFilterOptionsChanged is called', () => {
    const filter = mockFilters[0];
    const options = [{ label: 'Test', value: 'test', cardSearchResultCount: 5 }];

    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.filterOptionSelected, 'emit');

    component.onSelectedFilterOptionsChanged(filter, options);

    expect(emitSpy).toHaveBeenCalledWith({ filter, filterOption: options });
  });

  it('should emit filterOptionsSearch when onSearchFilterOptions is called', () => {
    const filter = mockFilters[0];
    const searchText = 'test search';

    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.filterOptionsSearch, 'emit');

    component.onSearchFilterOptions(filter, searchText);

    expect(emitSpy).toHaveBeenCalledWith({ filter, searchText });
  });

  it('should emit loadMoreFilterOptions when onLoadMoreFilterOptions is called', () => {
    const filter = mockFilters[0];

    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.loadMoreFilterOptions, 'emit');

    component.onLoadMoreFilterOptions(filter);

    expect(emitSpy).toHaveBeenCalledWith(filter);
  });

  it('should emit filterOptionSelected when onCheckboxChange is called with checked', () => {
    const filter = mockFilters[2];
    const event = { checked: true } as any;

    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.filterOptionSelected, 'emit');

    component.onCheckboxChange(event, filter);

    expect(emitSpy).toHaveBeenCalledWith({
      filter,
      filterOption: [{ label: '', value: 'true', cardSearchResultCount: NaN }],
    });
  });

  it('should emit filterOptionSelected when onCheckboxChange is called with unchecked', () => {
    const filter = mockFilters[2];
    const event = { checked: false } as any;

    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.filterOptionSelected, 'emit');

    component.onCheckboxChange(event, filter);

    expect(emitSpy).toHaveBeenCalledWith({ filter, filterOption: [] });
  });

  it('should handle empty filters array', () => {
    fixture.componentRef.setInput('filters', []);
    fixture.detectChanges();

    expect(component.visibleFilters()).toEqual([]);
    expect(component.splitFilters().individual).toEqual([]);
    expect(component.splitFilters().grouped).toEqual([]);
  });

  it('should handle empty selectedOptions', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('selectedOptions', {});
    fixture.detectChanges();

    expect(component.selectedOptionValues()).toEqual({});
  });
});
