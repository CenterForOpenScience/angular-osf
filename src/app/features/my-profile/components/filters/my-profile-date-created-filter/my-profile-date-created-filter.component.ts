import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MyProfileResourceFiltersSelectors, SetDateCreated } from '../../my-profile-resource-filters/store';
import { GetAllOptions, MyProfileResourceFiltersOptionsSelectors } from '../store';

@Component({
  selector: 'osf-my-profile-date-created-filter',
  imports: [Select, FormsModule],
  templateUrl: './my-profile-date-created-filter.component.html',
  styleUrl: './my-profile-date-created-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileDateCreatedFilterComponent {
  readonly #store = inject(Store);

  protected availableDates = this.#store.selectSignal(MyProfileResourceFiltersOptionsSelectors.getDatesCreated);
  protected dateCreatedState = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getDateCreated);
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
