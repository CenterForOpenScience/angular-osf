import { Chip } from 'primeng/chip';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { StringOrNull } from '@shared/helpers';
import { DiscoverableFilter, SelectOption } from '@shared/models';

@Component({
  selector: 'osf-filter-chips',
  imports: [CommonModule, Chip],
  templateUrl: './filter-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChipsComponent {
  filterValues = input<Record<string, StringOrNull>>({});
  filterOptionsCache = input<Record<string, SelectOption[]>>({});
  filters = input.required<DiscoverableFilter[]>();

  filterRemoved = output<string>();

  filterLabels = computed(() => {
    return this.filters()
      .filter((filter) => filter.key && filter.label)
      .map((filter) => ({
        key: filter.key,
        label: filter.label,
      }));
  });

  filterOptions = computed(() => {
    return this.filters()
      .filter((filter) => filter.key && filter.options)
      .map((filter) => ({
        key: filter.key,
        options: filter.options!.map((opt) => ({
          id: String(opt.value || ''),
          value: String(opt.value || ''),
          label: opt.label,
        })),
      }));
  });

  chips = computed(() => {
    const values = this.filterValues();
    const labels = this.filterLabels();
    const options = this.filterOptions();

    return Object.entries(values)
      .filter(([, value]) => value !== null && value !== '')
      .map(([key, value]) => {
        const filterLabel = labels.find((l) => l.key === key)?.label || key;
        const filterOptionsList = options.find((o) => o.key === key)?.options || [];
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
}
