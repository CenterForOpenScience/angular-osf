import { createDispatchMap, select } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  PreprintsResourcesFiltersSelectors,
  SetDateCreated,
} from '@osf/features/preprints/store/preprints-resources-filters';
import {
  GetAllOptions,
  PreprintsResourcesFiltersOptionsSelectors,
} from '@osf/features/preprints/store/preprints-resources-filters-options';

@Component({
  selector: 'osf-preprints-date-created-filter',
  imports: [Select, FormsModule],
  templateUrl: './preprints-date-created-filter.component.html',
  styleUrl: './preprints-date-created-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsDateCreatedFilterComponent {
  private readonly actions = createDispatchMap({
    setDateCreated: SetDateCreated,
    getAllOptions: GetAllOptions,
  });

  dateCreatedState = select(PreprintsResourcesFiltersSelectors.getDateCreated);
  inputDate = signal<string | null>(null);

  availableDates = select(PreprintsResourcesFiltersOptionsSelectors.getDatesCreated);
  datesOptions = computed(() => {
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
    if (!(event.originalEvent as PointerEvent).pointerId) {
      return;
    }

    this.actions.setDateCreated(event.value);
    this.actions.getAllOptions();
  }
}
