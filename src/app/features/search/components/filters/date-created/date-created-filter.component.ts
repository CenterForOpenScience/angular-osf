import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResourceFiltersSelectors, SetDateCreated } from '../../resource-filters/store';
import { GetAllOptions, ResourceFiltersOptionsSelectors } from '../store';

@Component({
  selector: 'osf-date-created-filter',
  imports: [ReactiveFormsModule, Select, FormsModule],
  templateUrl: './date-created-filter.component.html',
  styleUrl: './date-created-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateCreatedFilterComponent {
  readonly #store = inject(Store);

  protected availableDates = this.#store.selectSignal(ResourceFiltersOptionsSelectors.getDatesCreated);
  protected dateCreatedState = this.#store.selectSignal(ResourceFiltersSelectors.getDateCreated);
  protected inputDate = signal<string | null>(null);
  protected datesOptions = computed(() => {
    return this.availableDates().map((date) => ({
      label: date.value + ' (' + date.count + ')',
      value: date.value,
    }));
  });

  constructor() {
    effect(() => {
      const storeValue = this.dateCreatedState().label;
      const currentInput = untracked(() => this.inputDate());

      if (!storeValue && currentInput !== null) {
        this.inputDate.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.inputDate.set(storeValue);
      }
    });
  }

  setDateCreated(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId) {
      this.#store.dispatch(new SetDateCreated(event.value));
      this.#store.dispatch(GetAllOptions);
    }
  }
}
