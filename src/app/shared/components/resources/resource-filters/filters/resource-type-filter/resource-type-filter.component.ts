import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetAllOptions } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.actions';
import { ResourceFiltersOptionsSelectors } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.selectors';
import {
  ResourceFiltersSelectors,
  SetResourceType,
} from '@shared/components/resources/resource-filters/store';

@Component({
  selector: 'osf-resource-type-filter',
  imports: [Select, FormsModule],
  templateUrl: './resource-type-filter.component.html',
  styleUrl: './resource-type-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceTypeFilterComponent {
  readonly #store = inject(Store);

  protected availableResourceTypes = this.#store.selectSignal(
    ResourceFiltersOptionsSelectors.getResourceTypes,
  );
  protected resourceTypeState = this.#store.selectSignal(
    ResourceFiltersSelectors.getResourceType,
  );
  protected inputText = signal<string | null>(null);
  protected resourceTypesOptions = computed(() => {
    if (this.inputText() !== null) {
      const search = this.inputText()!.toLowerCase();
      return this.availableResourceTypes()
        .filter((resourceType) =>
          resourceType.label.toLowerCase().includes(search),
        )
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
      const resourceType = this.resourceTypesOptions().find((p) =>
        p.label.includes(event.value),
      );
      if (resourceType) {
        this.#store.dispatch(
          new SetResourceType(resourceType.label, resourceType.id),
        );
        this.#store.dispatch(GetAllOptions);
      }
    } else {
      this.#store.dispatch(new SetResourceType('', ''));
      this.#store.dispatch(GetAllOptions);
    }
  }
}
