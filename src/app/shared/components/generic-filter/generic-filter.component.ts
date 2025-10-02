import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';
import { SelectLazyLoadEvent } from 'primeng/select';

import { debounceTime, Subject } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { FilterOperator, FilterOption } from '@shared/models';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'osf-generic-filter',
  imports: [MultiSelect, FormsModule, LoadingSpinnerComponent],
  templateUrl: './generic-filter.component.html',
  styleUrls: ['./generic-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFilterComponent {
  private destroyRef = inject(DestroyRef);
  options = input<FilterOption[]>([]);
  searchResults = input<FilterOption[]>([]);
  isLoading = input<boolean>(false);
  isPaginationLoading = input<boolean>(false);
  isSearchLoading = input<boolean>(false);
  selectedOptions = input<FilterOption[]>([]);
  placeholder = input<string>('');
  filterOperator = input<FilterOperator>(FilterOperator.AnyOf);

  selectedOptionsChanged = output<FilterOption[]>();
  searchTextChanged = output<string>();
  loadMoreOptions = output<void>();

  private searchResultOptions = signal<FilterOption[]>([]);
  private isActivelySearching = signal<boolean>(false);
  private stableOptionsArray: FilterOption[] = [];
  private searchSubject = new Subject<string>();

  filterOptions = computed(() => {
    const searchResults = this.searchResultOptions();
    const baseOptions = this.options();
    const isSearching = this.isActivelySearching();

    if (isSearching && this.stableOptionsArray.length > 0) {
      return this.stableOptionsArray;
    }

    let newOptions: FilterOption[];

    if (searchResults.length > 0) {
      const existingValues = new Set(baseOptions.map((opt) => opt.value));
      const newSearchOptions = searchResults.filter((opt) => !existingValues.has(opt.value));
      newOptions = [...newSearchOptions, ...baseOptions];
    } else {
      newOptions = baseOptions;
    }

    this.updateStableArray(newOptions);
    return this.stableOptionsArray;
  });
  selectedOptionValues = computed(() => {
    return this.selectedOptions().map((option) => option.value);
  });

  constructor() {
    effect(() => {
      const searchResults = this.searchResults();
      const current = this.searchResultOptions();
      if (current.length !== searchResults.length || !this.arraysEqual(current, searchResults)) {
        this.searchResultOptions.set(searchResults);
      }
    });

    this.searchSubject.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef)).subscribe((searchText) => {
      this.isActivelySearching.set(false);
      this.searchTextChanged.emit(searchText);
    });
  }

  loadMoreItems(event: SelectLazyLoadEvent): void {
    const totalOptions = this.filterOptions().length;

    if (event.last >= totalOptions - 5) {
      setTimeout(() => {
        this.loadMoreOptions.emit();
      }, 0);
    }
  }

  onFilterChange(event: { filter: string }): void {
    const searchText = event.filter || '';

    if (searchText) {
      this.isActivelySearching.set(true);
    } else {
      this.searchResultOptions.set([]);
      this.isActivelySearching.set(false);
    }

    this.searchSubject.next(searchText);
  }

  onMultiChange(event: MultiSelectChangeEvent): void {
    const values: string[] = Array.isArray(event.value) ? event.value : [];
    const options = this.filterOptions();
    const selectedOptions = values
      .map((v) => options.find((o) => o.value === v))
      .filter((o): o is FilterOption => Boolean(o));
    this.selectedOptionsChanged.emit(selectedOptions);
  }

  private arraysEqual(a: FilterOption[], b: FilterOption[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].value !== b[i].value || a[i].label !== b[i].label) {
        return false;
      }
    }
    return true;
  }

  private updateStableArray(newOptions: FilterOption[]): void {
    if (this.arraysEqual(this.stableOptionsArray, newOptions)) {
      return;
    }

    if (newOptions.length > this.stableOptionsArray.length) {
      const existingValues = new Set(this.stableOptionsArray.map((opt) => opt.value));
      const newItems = newOptions.filter((opt) => !existingValues.has(opt.value));

      if (this.stableOptionsArray.length + newItems.length === newOptions.length) {
        this.stableOptionsArray.push(...newItems);
        return;
      }
    }

    this.stableOptionsArray.length = 0;
    this.stableOptionsArray.push(...newOptions);
  }
}
