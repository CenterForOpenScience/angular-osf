import { Chip } from 'primeng/chip';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { DiscoverableFilter, FilterOption } from '@shared/models';

@Component({
  selector: 'osf-filter-chips',
  imports: [CommonModule, Chip],
  templateUrl: './filter-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChipsComponent {
  filterOptions = input<Record<string, FilterOption | null>>({});
  filters = input.required<DiscoverableFilter[]>();

  selectedOptionRemoved = output<string>();

  filterLabels = computed(() => {
    return this.filters()
      .filter((filter) => filter.key && filter.label)
      .map((filter) => ({
        key: filter.key,
        label: filter.label,
      }));
  });

  chips = computed(() => {
    const options = this.filterOptions();
    const labels = this.filterLabels();

    return Object.entries(options)
      .filter(([, value]) => value !== null)
      .map(([key, option]) => {
        const filterLabel = labels.find((l) => l.key === key)?.label || key;
        const displayValue = option?.label || option?.value;

        return {
          key,
          label: filterLabel,
          displayValue,
        };
      });
  });

  removeFilter(filterKey: string): void {
    this.selectedOptionRemoved.emit(filterKey);
  }
}
