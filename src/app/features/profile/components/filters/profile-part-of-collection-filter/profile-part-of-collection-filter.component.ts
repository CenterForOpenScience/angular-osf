import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetAllOptions, ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';

import { ProfileResourceFiltersSelectors, SetPartOfCollection } from '../../profile-resource-filters/store';

@Component({
  selector: 'osf-profile-part-of-collection-filter',
  imports: [Select, FormsModule],
  templateUrl: './profile-part-of-collection-filter.component.html',
  styleUrl: './profile-part-of-collection-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePartOfCollectionFilterComponent {
  readonly store = inject(Store);

  protected availablePartOfCollections = this.store.selectSignal(
    ProfileResourceFiltersOptionsSelectors.getPartOfCollection
  );
  protected partOfCollectionState = this.store.selectSignal(ProfileResourceFiltersSelectors.getPartOfCollection);
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
        this.store.dispatch(new SetPartOfCollection(part.label, part.id));
        this.store.dispatch(GetAllOptions);
      }
    } else {
      this.store.dispatch(new SetPartOfCollection('', ''));
      this.store.dispatch(GetAllOptions);
    }
  }
}
