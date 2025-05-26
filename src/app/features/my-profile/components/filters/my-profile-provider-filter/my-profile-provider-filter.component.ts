import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MyProfileResourceFiltersSelectors, SetProvider } from '../../my-profile-resource-filters/store';
import { GetAllOptions, MyProfileResourceFiltersOptionsSelectors } from '../store';

@Component({
  selector: 'osf-my-profile-provider-filter',
  imports: [Select, FormsModule],
  templateUrl: './my-profile-provider-filter.component.html',
  styleUrl: './my-profile-provider-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileProviderFilterComponent {
  readonly #store = inject(Store);

  protected availableProviders = this.#store.selectSignal(MyProfileResourceFiltersOptionsSelectors.getProviders);
  protected providerState = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getProvider);
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
      const provider = this.providersOptions().find((p) => p.label.includes(event.value));
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
