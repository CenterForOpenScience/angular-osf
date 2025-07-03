import { Chip } from 'primeng/chip';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'osf-filter-chips',
  imports: [CommonModule, Chip],
  templateUrl: './filter-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChipsComponent {
  selectedValues = input<Record<string, string | null>>({});
  filterLabels = input<Record<string, string>>({});
  filterOptions = input<Record<string, { id: string; value: string; label: string }[]>>({});

  filterRemoved = output<string>();
  allFiltersCleared = output<void>();

  readonly chips = computed(() => {
    const values = this.selectedValues();
    const labels = this.filterLabels();
    const options = this.filterOptions();

    return Object.entries(values)
      .filter(([key, value]) => value !== null && value !== '')
      .map(([key, value]) => {
        const filterLabel = labels[key] || key;
        const filterOptionsList = options[key] || [];
        const option = filterOptionsList.find((opt) => opt.value === value || opt.id === value);
        const displayValue = option?.label || value || '';

        return {
          key,
          value: value!,
          label: filterLabel,
          displayValue,
        };
      });
  });

  removeFilter(filterKey: string): void {
    this.filterRemoved.emit(filterKey);
  }

  clearAllFilters(): void {
    this.allFiltersCleared.emit();
  }
}
