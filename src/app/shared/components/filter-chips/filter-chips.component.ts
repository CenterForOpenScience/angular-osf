import { Chip } from 'primeng/chip';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { DiscoverableFilter, FilterOption } from '@osf/shared/models/search/discaverable-filter.model';

@Component({
  selector: 'osf-filter-chips',
  imports: [CommonModule, Chip],
  templateUrl: './filter-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChipsComponent {
  filterOptions = input<Record<string, FilterOption[]>>({});
  filters = input.required<DiscoverableFilter[]>();

  selectedOptionRemoved = output<{ filterKey: string; optionRemoved: FilterOption }>();

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
      .filter(([, value]) => (value?.length ?? 0) > 0)
      .flatMap(([key, option]) => {
        const filterLabel = labels.find((l) => l.key === key)?.label || key;
        const optionArray = option as FilterOption[];

        return optionArray.map((opt) => ({
          key,
          label: filterLabel,
          displayValue: opt?.label || opt?.value,
          option: opt,
        }));
      });
  });

  removeFilter(filterKey: string, option: FilterOption): void {
    this.selectedOptionRemoved.emit({
      filterKey,
      optionRemoved: option,
    });
  }
}
