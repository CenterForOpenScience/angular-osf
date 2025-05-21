import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetAllOptions } from '@osf/features/my-profile/components/resources/components/resource-filters/components/filters/store/my-profile-resource-filters-options.actions';
import { MyProfileResourceFiltersOptionsSelectors } from '@osf/features/my-profile/components/resources/components/resource-filters/components/filters/store/my-profile-resource-filters-options.selectors';
import { SetPartOfCollection } from '@osf/features/my-profile/components/resources/components/resource-filters/store/my-profile-resource-filters.actions';
import { MyProfileResourceFiltersSelectors } from '@osf/features/my-profile/components/resources/components/resource-filters/store/my-profile-resource-filters.selectors';

@Component({
  selector: 'osf-my-profile-part-of-collection-filter',
  imports: [Select, FormsModule],
  templateUrl: './my-profile-part-of-collection-filter.component.html',
  styleUrl: './my-profile-part-of-collection-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfilePartOfCollectionFilterComponent {
  readonly #store = inject(Store);

  protected availablePartOfCollections = this.#store.selectSignal(
    MyProfileResourceFiltersOptionsSelectors.getPartOfCollection
  );
  protected partOfCollectionState = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getPartOfCollection);
  protected inputText = signal<string | null>(null);
  protected partOfCollectionsOptions = computed(() => {
    return this.availablePartOfCollections().map((partOfCollection) => ({
      labelCount: partOfCollection.label + ' (' + partOfCollection.count + ')',
      label: partOfCollection.label,
      id: partOfCollection.id,
    }));
  });

  loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const storeValue = this.partOfCollectionState().label;
      const currentInput = untracked(() => this.inputText());

      if (!storeValue && currentInput !== null) {
        this.inputText.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.inputText.set(storeValue);
      }
    });
  }

  setPartOfCollections(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId && event.value) {
      const part = this.partOfCollectionsOptions().find((p) => p.label.includes(event.value));
      if (part) {
        this.#store.dispatch(new SetPartOfCollection(part.label, part.id));
        this.#store.dispatch(GetAllOptions);
      }
    } else {
      this.#store.dispatch(new SetPartOfCollection('', ''));
      this.#store.dispatch(GetAllOptions);
    }
  }
}
