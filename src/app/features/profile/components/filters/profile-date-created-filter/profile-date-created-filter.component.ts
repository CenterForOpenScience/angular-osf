import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetAllOptions, ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';

import { ProfileResourceFiltersSelectors, SetDateCreated } from '../../profile-resource-filters/store';

@Component({
  selector: 'osf-profile-date-created-filter',
  imports: [Select, FormsModule],
  templateUrl: './profile-date-created-filter.component.html',
  styleUrl: './profile-date-created-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDateCreatedFilterComponent {
  readonly #store = inject(Store);

  protected availableDates = this.#store.selectSignal(ProfileResourceFiltersOptionsSelectors.getDatesCreated);
  protected dateCreatedState = this.#store.selectSignal(ProfileResourceFiltersSelectors.getDateCreated);
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
