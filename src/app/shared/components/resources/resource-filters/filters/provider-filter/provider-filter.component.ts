import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Store } from '@ngxs/store';
import {
  ResourceFiltersSelectors,
  SetProvider,
} from '@shared/components/resources/resource-filters/store';
import { FormsModule } from '@angular/forms';
import { GetAllOptions } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.actions';
import { ResourceFiltersOptionsSelectors } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.selectors';

@Component({
  selector: 'osf-provider-filter',
  imports: [Select, FormsModule],
  templateUrl: './provider-filter.component.html',
  styleUrl: './provider-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderFilterComponent {
  readonly #store = inject(Store);

  protected availableProviders = this.#store.selectSignal(
    ResourceFiltersOptionsSelectors.getProviders,
  );
  protected providerState = this.#store.selectSignal(
    ResourceFiltersSelectors.getProvider,
  );
  protected inputText = signal<string | null>(null);
  protected providersOptions = computed(() => {
    if (this.inputText() !== null) {
      const search = this.inputText()!.toLowerCase();
      return this.availableProviders()
        .filter((provider) => provider.label.toLowerCase().includes(search))
        .map((provider) => ({
          labelCount: provider.label + ' (' + provider.count + ')',
          label: provider.label,
          id: provider.id,
        }));
    }

    return this.availableProviders().map((provider) => ({
      labelCount: provider.label + ' (' + provider.count + ')',
      label: provider.label,
      id: provider.id,
    }));
  });

  loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const storeValue = this.providerState().label;
      const currentInput = untracked(() => this.inputText());

      if (!storeValue && currentInput !== null) {
        this.inputText.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.inputText.set(storeValue);
      }
    });
  }

  setProviders(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId && event.value) {
      const provider = this.providersOptions().find((p) =>
        p.label.includes(event.value),
      );
      if (provider) {
        this.#store.dispatch(new SetProvider(provider.label, provider.id));
        this.#store.dispatch(GetAllOptions);
      }
    } else {
      this.#store.dispatch(new SetProvider('', ''));
      this.#store.dispatch(GetAllOptions);
    }
  }
}
