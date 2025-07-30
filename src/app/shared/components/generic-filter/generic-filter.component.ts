import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoadingSpinnerComponent } from '@shared/components';
import { SelectOption } from '@shared/models';

@Component({
  selector: 'osf-generic-filter',
  imports: [Select, FormsModule, LoadingSpinnerComponent],
  templateUrl: './generic-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFilterComponent {
  options = input<SelectOption[]>([]);
  isLoading = input<boolean>(false);
  selectedValue = input<string | null>(null);
  placeholder = input<string>('');
  filterType = input<string>('');

  valueChanged = output<string | null>();

  currentSelectedOption = signal<SelectOption | null>(null);

  filterOptions = computed(() => {
    const parentOptions = this.options();
    if (parentOptions.length > 0) {
      if (this.filterType() === 'dateCreated') {
        return parentOptions
          .filter((option) => option?.label)
          .sort((a, b) => b.label.localeCompare(a.label))
          .map((option) => ({
            label: option.label || '',
            value: option.label || '',
          }));
      } else {
        return parentOptions
          .filter((option) => option?.label)
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((option) => ({
            label: option.label || '',
            value: option.value || '',
          }));
      }
    }
    return [];
  });

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
  }

  onValueChange(event: SelectChangeEvent): void {
    const options = this.filterOptions();
    const selectedOption = event.value ? options.find((opt) => opt.value === event.value) : null;
    this.currentSelectedOption.set(selectedOption || null);

    this.valueChanged.emit(event.value || null);
  }
}
