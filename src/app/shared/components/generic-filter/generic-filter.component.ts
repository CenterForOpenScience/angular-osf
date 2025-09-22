import { Select, SelectChangeEvent, SelectLazyLoadEvent } from 'primeng/select';

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

import { FilterOption } from '@shared/models';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'osf-generic-filter',
  imports: [Select, FormsModule, LoadingSpinnerComponent],
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
  selectedValue = input<string | null>(null);
  placeholder = input<string>('');
  filterType = input<string>('');

  valueChanged = output<string | null>();
  searchTextChanged = output<string>();
  loadMoreOptions = output<void>();

  currentSelectedOption = signal<FilterOption | null>(null);
  private searchSubject = new Subject<string>();
  private currentSearchText = signal<string>('');
  private searchResultOptions = signal<FilterOption[]>([]);
  private isActivelySearching = signal<boolean>(false);
  private stableOptionsArray: FilterOption[] = [];

  filterOptions = computed(() => {
    const searchResults = this.searchResultOptions();
    const parentOptions = this.options();
    const isSearching = this.isActivelySearching();

    if (isSearching && this.stableOptionsArray.length > 0) {
      return this.stableOptionsArray;
    }

    const baseOptions = this.formatOptions(parentOptions);
    let newOptions: FilterOption[];

    if (searchResults.length > 0) {
      const searchFormatted = this.formatOptions(searchResults);
      const existingValues = new Set(baseOptions.map((opt) => opt.value));
      const newSearchOptions = searchFormatted.filter((opt) => !existingValues.has(opt.value));
      newOptions = [...newSearchOptions, ...baseOptions];
    } else {
      newOptions = baseOptions;
    }

    this.updateStableArray(newOptions);
    return this.stableOptionsArray;
  });

  private formatOptions(options: FilterOption[]): FilterOption[] {
    if (options.length > 0) {
      if (this.filterType() === 'dateCreated') {
        return options
          .filter((option) => option?.label)
          .map((option) => ({
            ...option,
            label: option.label || '',
            value: option.label || '',
          }));
      } else {
        return options
          .filter((option) => option?.label)
          .sort((a, b) => b.cardSearchResultCount - a.cardSearchResultCount)
          .map((option) => ({
            ...option,
            label: option.label || '',
            value: option.value || '',
          }));
      }
    }
    return [];
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

  constructor() {
    effect(() => {
      const selectedValue = this.selectedValue();
      const options = this.filterOptions();

      if (!selectedValue) {
        this.currentSelectedOption.set(null);
      } else {
        const option = options.find((opt) => opt.value === selectedValue);
        this.currentSelectedOption.set(option || null);
      }
    });

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

  onValueChange(event: SelectChangeEvent): void {
    const options = this.filterOptions();
    const selectedOption = event.value ? options.find((opt) => opt.value === event.value) : null;
    this.currentSelectedOption.set(selectedOption || null);

    this.valueChanged.emit(event.value || null);
  }

  onFilterChange(event: { filter: string }): void {
    const searchText = event.filter || '';
    this.currentSearchText.set(searchText);

    if (searchText) {
      this.isActivelySearching.set(true);
    } else {
      this.searchResultOptions.set([]);
      this.isActivelySearching.set(false);
    }

    this.searchSubject.next(searchText);
  }
}
