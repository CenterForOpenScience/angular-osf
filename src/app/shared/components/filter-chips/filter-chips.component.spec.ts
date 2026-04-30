import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DiscoverableFilter,
  FilterOperatorOption,
  FilterOption,
} from '@osf/shared/models/search/discoverable-filter.model';

import { FilterChipsComponent } from './filter-chips.component';

describe('FilterChipsComponent', () => {
  let fixture: ComponentFixture<FilterChipsComponent>;
  let component: FilterChipsComponent;

  const subjectOption: FilterOption = {
    label: 'Biology',
    value: 'biology',
    cardSearchResultCount: 10,
  };

  const openOption: FilterOption = {
    label: 'Open',
    value: 'true',
    cardSearchResultCount: 6,
  };

  const filters: DiscoverableFilter[] = [
    {
      key: 'subjects',
      label: 'Subject',
      operator: FilterOperatorOption.AnyOf,
    },
    {
      key: 'open',
      label: 'Open Access',
      operator: FilterOperatorOption.AnyOf,
    },
    {
      key: '',
      label: 'Ignored',
      operator: FilterOperatorOption.AnyOf,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterChipsComponent],
    });

    fixture = TestBed.createComponent(FilterChipsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('filters', filters);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should build filterLabels from filters with key and label', () => {
    fixture.componentRef.setInput('filters', filters);
    fixture.componentRef.setInput('filterOptions', { subjects: [subjectOption] });
    fixture.detectChanges();

    expect(component.filterLabels()).toEqual([
      { key: 'subjects', label: 'Subject' },
      { key: 'open', label: 'Open Access' },
    ]);
  });

  it('should build chips from filter options using matching filter label', () => {
    fixture.componentRef.setInput('filters', filters);
    fixture.componentRef.setInput('filterOptions', { subjects: [subjectOption] });
    fixture.detectChanges();

    expect(component.chips()).toEqual([
      {
        key: 'subjects',
        label: 'Subject',
        displayValue: 'Biology',
        option: subjectOption,
      },
    ]);
  });

  it('should fallback chip label to filter key when label is missing', () => {
    fixture.componentRef.setInput('filters', filters);
    fixture.componentRef.setInput('filterOptions', { unknown: [subjectOption] });
    fixture.detectChanges();

    expect(component.chips()).toEqual([
      {
        key: 'unknown',
        label: 'unknown',
        displayValue: 'Biology',
        option: subjectOption,
      },
    ]);
  });

  it('should render chip label without display value when chip value is true', () => {
    fixture.componentRef.setInput('filters', filters);
    fixture.componentRef.setInput('filterOptions', { open: [openOption] });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Open Access');
    expect(fixture.nativeElement.textContent).not.toContain('Open Access: true');
  });

  it('should emit selectedOptionRemoved when removeFilter is called', () => {
    fixture.componentRef.setInput('filters', filters);
    fixture.detectChanges();
    const emitSpy = vi.spyOn(component.selectedOptionRemoved, 'emit');

    component.removeFilter('subjects', subjectOption);

    expect(emitSpy).toHaveBeenCalledWith({
      filterKey: 'subjects',
      optionRemoved: subjectOption,
    });
  });
});
