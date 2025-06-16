import { Store } from '@ngxs/store';

import { Select, SelectChangeEvent } from 'primeng/select';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  untracked,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  PreprintsResourcesFiltersSelectors,
  SetCreator,
} from '@osf/features/preprints/store/preprints-resources-filters';
import {
  GetAllOptions,
  GetCreatorsOptions,
  PreprintsResourcesFiltersOptionsSelectors,
} from '@osf/features/preprints/store/preprints-resources-filters-options';

@Component({
  selector: 'osf-preprints-creators-filter',
  imports: [Select, ReactiveFormsModule, FormsModule],
  templateUrl: './preprints-creators-filter.component.html',
  styleUrl: './preprints-creators-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsCreatorsFilterComponent implements OnDestroy {
  readonly #store = inject(Store);

  protected searchCreatorsResults = this.#store.selectSignal(PreprintsResourcesFiltersOptionsSelectors.getCreators);
  protected creatorsOptions = computed(() => {
    return this.searchCreatorsResults().map((creator) => ({
      label: creator.name,
      id: creator.id,
    }));
  });
  protected creatorState = this.#store.selectSignal(PreprintsResourcesFiltersSelectors.getCreator);
  readonly #unsubscribe = new Subject<void>();
  protected creatorsInput = signal<string | null>(null);
  protected initialization = true;

  constructor() {
    toObservable(this.creatorsInput)
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.#unsubscribe))
      .subscribe((searchText) => {
        if (!this.initialization) {
          if (searchText) {
            this.#store.dispatch(new GetCreatorsOptions(searchText ?? ''));
          }

          if (!searchText) {
            this.#store.dispatch(new SetCreator('', ''));
            this.#store.dispatch(GetAllOptions);
          }
        } else {
          this.initialization = false;
        }
      });

    effect(() => {
      const storeValue = this.creatorState().label;
      const currentInput = untracked(() => this.creatorsInput());

      if (!storeValue && currentInput !== null) {
        this.creatorsInput.set(null);
      } else if (storeValue && currentInput !== storeValue) {
        this.creatorsInput.set(storeValue);
      }
    });
  }

  ngOnDestroy() {
    this.#unsubscribe.complete();
  }

  setCreator(event: SelectChangeEvent): void {
    if ((event.originalEvent as PointerEvent).pointerId && event.value) {
      const creator = this.creatorsOptions().find((p) => p.label.includes(event.value));
      if (creator) {
        this.#store.dispatch(new SetCreator(creator.label, creator.id));
        this.#store.dispatch(GetAllOptions);
      }
    }
  }
}
