import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetAllOptions, ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';

import { ProfileResourceFiltersSelectors, SetResourceType } from '../../profile-resource-filters/store';

@Component({
  selector: 'osf-profile-resource-type-filter',
  imports: [Select, FormsModule],
  templateUrl: './profile-resource-type-filter.component.html',
  styleUrl: './profile-resource-type-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileResourceTypeFilterComponent {
  readonly store = inject(Store);

  protected availableResourceTypes = this.store.selectSignal(ProfileResourceFiltersOptionsSelectors.getResourceTypes);
  protected resourceTypeState = this.store.selectSignal(ProfileResourceFiltersSelectors.getResourceType);
  protected inputText = signal<string | null>(null);
  protected resourceTypesOptions = computed(() => {
    if (this.inputText() !== null) {
      const search = this.inputText()!.toLowerCase();
      return this.availableResourceTypes()
        .filter((resourceType) => resourceType.label.toLowerCase().includes(search))
        .map((resourceType) => ({
          labelCount: resourceType.label + ' (' + resourceType.count + ')',
          label: resourceType.label,
          id: resourceType.id,
        }));
    }

    return this.availableResourceTypes().map((resourceType) => ({
      labelCount: resourceType.label + ' (' + resourceType.count + ')',
      label: resourceType.label,
      id: resourceType.id,
    }));
  });

  loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const storeValue = this.resourceTypeState().label;
      const currentInput = untracked(() => this.inputText());

      if (!storeValue && currentInput !== null) {
        this.inputText.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.inputText.set(storeValue);
      }
    });
  }

  setResourceTypes(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId && event.value) {
      const resourceType = this.resourceTypesOptions().find((p) => p.label.includes(event.value));
      if (resourceType) {
        this.store.dispatch(new SetResourceType(resourceType.label, resourceType.id));
        this.store.dispatch(GetAllOptions);
      }
    } else {
      this.store.dispatch(new SetResourceType('', ''));
      this.store.dispatch(GetAllOptions);
    }
  }
}
