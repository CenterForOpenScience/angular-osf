import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  PreprintsResourcesFiltersSelectors,
  SetInstitution,
} from '@osf/features/preprints/store/preprints-resources-filters';
import {
  GetAllOptions,
  PreprintsResourcesFiltersOptionsSelectors,
} from '@osf/features/preprints/store/preprints-resources-filters-options';

@Component({
  selector: 'osf-preprints-institution-filter',
  imports: [Select, FormsModule],
  templateUrl: './preprints-institution-filter.component.html',
  styleUrl: './preprints-institution-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsInstitutionFilterComponent {
  readonly #store = inject(Store);

  protected institutionState = this.#store.selectSignal(PreprintsResourcesFiltersSelectors.getInstitution);
  protected availableInstitutions = this.#store.selectSignal(PreprintsResourcesFiltersOptionsSelectors.getInstitutions);
  protected inputText = signal<string | null>(null);
  protected institutionsOptions = computed(() => {
    if (this.inputText() !== null) {
      const search = this.inputText()!.toLowerCase();
      return this.availableInstitutions()
        .filter((institution) => institution.label.toLowerCase().includes(search))
        .map((institution) => ({
          labelCount: institution.label + ' (' + institution.count + ')',
          label: institution.label,
          id: institution.id,
        }));
    }

    return this.availableInstitutions().map((institution) => ({
      labelCount: institution.label + ' (' + institution.count + ')',
      label: institution.label,
      id: institution.id,
    }));
  });

  constructor() {
    effect(() => {
      const storeValue = this.institutionState().label;
      const currentInput = untracked(() => this.inputText());

      if (!storeValue && currentInput !== null) {
        this.inputText.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.inputText.set(storeValue);
      }
    });
  }

  loading = signal<boolean>(false);

  setInstitutions(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId && event.value) {
      const institution = this.institutionsOptions()?.find((institution) => institution.label.includes(event.value));
      if (institution) {
        this.#store.dispatch(new SetInstitution(institution.label, institution.id));
        this.#store.dispatch(GetAllOptions);
      }
    } else {
      this.#store.dispatch(new SetInstitution('', ''));
      this.#store.dispatch(GetAllOptions);
    }
  }
}
