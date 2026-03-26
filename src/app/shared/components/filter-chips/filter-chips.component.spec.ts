import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DiscoverableFilter,
  FilterOperatorOption,
  FilterOption,
} from '@osf/shared/models/search/discoverable-filter.model';

import { FilterChipsComponent } from './filter-chips.component';

import { provideOSFCore } from '@testing/osf.testing.provider';

describe('FilterChipsComponent', () => {
  let component: FilterChipsComponent;
  let fixture: ComponentFixture<FilterChipsComponent>;

  const mockFilters: DiscoverableFilter[] = [
    {
      key: 'subject',
      label: 'Subject',
      operator: FilterOperatorOption.AnyOf,
      options: [],
    },
    {
      key: 'hasData',
      label: 'Has Data',
      operator: FilterOperatorOption.IsPresent,
      options: [],
    },
  ];

  const biologyOption: FilterOption = {
    label: 'Biology',
    value: 'biology',
    cardSearchResultCount: 10,
  };

  const trueOption: FilterOption = {
    label: '',
    value: 'true',
    cardSearchResultCount: 5,
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FilterChipsComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(FilterChipsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('filterOptions', {});
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should build chips from selected options', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('filterOptions', {
      subject: [biologyOption],
    });
    fixture.detectChanges();

    expect(component.chips()).toEqual([
      {
        key: 'subject',
        label: 'Subject',
        displayValue: 'Biology',
        option: biologyOption,
      },
    ]);
  });

  it('should keep only filters with key and label in filterLabels', () => {
    fixture.componentRef.setInput('filters', [
      ...mockFilters,
      { key: '', label: 'Invalid', operator: FilterOperatorOption.AnyOf, options: [] } as DiscoverableFilter,
      { key: 'invalid', label: '', operator: FilterOperatorOption.AnyOf, options: [] } as DiscoverableFilter,
    ]);
    fixture.componentRef.setInput('filterOptions', {});
    fixture.detectChanges();

    expect(component.filterLabels()).toEqual([
      { key: 'subject', label: 'Subject' },
      { key: 'hasData', label: 'Has Data' },
    ]);
  });

  it('should use filter key when label is missing for a selected option', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('filterOptions', {
      unknownFilter: [biologyOption],
    });
    fixture.detectChanges();

    expect(component.chips()).toEqual([
      {
        key: 'unknownFilter',
        label: 'unknownFilter',
        displayValue: 'Biology',
        option: biologyOption,
      },
    ]);
  });

  it('should use option value when option label is empty', () => {
    const valueOnlyOption: FilterOption = {
      label: '',
      value: 'custom-value',
      cardSearchResultCount: 1,
    };

    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('filterOptions', {
      subject: [valueOnlyOption],
    });
    fixture.detectChanges();

    expect(component.chips()).toEqual([
      {
        key: 'subject',
        label: 'Subject',
        displayValue: 'custom-value',
        option: valueOnlyOption,
      },
    ]);
  });

  it('should ignore filter options with empty arrays', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('filterOptions', {
      subject: [],
      hasData: [trueOption],
    });
    fixture.detectChanges();

    expect(component.chips()).toEqual([
      {
        key: 'hasData',
        label: 'Has Data',
        displayValue: 'true',
        option: trueOption,
      },
    ]);
  });

  it('should render label with displayValue for non-true values', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('filterOptions', {
      subject: [biologyOption],
    });
    fixture.detectChanges();

    const chipLabel = fixture.nativeElement.querySelector('.p-chip-label') as HTMLSpanElement;

    expect(chipLabel.textContent?.trim()).toBe('Subject: Biology');
  });

  it('should render only label when displayValue is true string', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('filterOptions', {
      hasData: [trueOption],
    });
    fixture.detectChanges();

    const chipLabel = fixture.nativeElement.querySelector('.p-chip-label') as HTMLSpanElement;

    expect(chipLabel.textContent?.trim()).toBe('Has Data');
  });

  it('should emit selectedOptionRemoved when removeFilter is called', () => {
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.componentRef.setInput('filterOptions', {});
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.selectedOptionRemoved, 'emit');

    component.removeFilter('subject', biologyOption);

    expect(emitSpy).toHaveBeenCalledWith({
      filterKey: 'subject',
      optionRemoved: biologyOption,
    });
  });
});
