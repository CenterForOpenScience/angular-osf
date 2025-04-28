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
  SetFunder,
} from '@shared/components/resources/resource-filters/store';
import { FormsModule } from '@angular/forms';
import { GetAllOptions } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.actions';
import { ResourceFiltersOptionsSelectors } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.selectors';

@Component({
  selector: 'osf-funder-filter',
  imports: [Select, FormsModule],
  templateUrl: './funder-filter.component.html',
  styleUrl: './funder-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunderFilterComponent {
  readonly #store = inject(Store);

  protected funderState = this.#store.selectSignal(
    ResourceFiltersSelectors.getFunder,
  );
  protected availableFunders = this.#store.selectSignal(
    ResourceFiltersOptionsSelectors.getFunders,
  );
  protected inputText = signal<string | null>(null);
  protected fundersOptions = computed(() => {
    if (this.inputText() !== null) {
      const search = this.inputText()!.toLowerCase();
      return this.availableFunders()
        .filter((funder) => funder.label.toLowerCase().includes(search))
        .map((funder) => ({
          labelCount: funder.label + ' (' + funder.count + ')',
          label: funder.label,
          id: funder.id,
        }));
    }

    const res = this.availableFunders().map((funder) => ({
      labelCount: funder.label + ' (' + funder.count + ')',
      label: funder.label,
      id: funder.id,
    }));

    return res;
  });

  constructor() {
    effect(() => {
      const storeValue = this.funderState().label;
      const currentInput = untracked(() => this.inputText());

      if (!storeValue && currentInput !== null) {
        this.inputText.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.inputText.set(storeValue);
      }
    });
  }

  loading = signal<boolean>(false);

  setFunders(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId && event.value) {
      const funder = this.fundersOptions()?.find((funder) =>
        funder.label.includes(event.value),
      );
      if (funder) {
        this.#store.dispatch(new SetFunder(funder.label, funder.id));
        this.#store.dispatch(GetAllOptions);
      }
    } else {
      this.#store.dispatch(new SetFunder('', ''));
      this.#store.dispatch(GetAllOptions);
    }
  }
}
