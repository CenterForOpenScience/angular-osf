import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceFiltersComponent } from '@shared/components/resources/resource-filters/resource-filters.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { ResourceCardComponent } from '@shared/components/resources/resource-card/resource-card.component';
import { Store } from '@ngxs/store';
import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';
import {
  GetResourcesByLink,
  SearchSelectors,
  SetSortBy,
} from '@osf/features/search/store';
import { FilterChipsComponent } from '@shared/components/resources/filter-chips/filter-chips.component';
import { ResourceFiltersSelectors } from '@shared/components/resources/resource-filters/store';
import { Select } from 'primeng/select';

@Component({
  selector: 'osf-resources',
  imports: [
    DropdownModule,
    FormsModule,
    ResourceFiltersComponent,
    ReactiveFormsModule,
    AutoCompleteModule,
    AccordionModule,
    TableModule,
    DataViewModule,
    ResourceCardComponent,
    FilterChipsComponent,
    Select,
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesComponent {
  readonly #store = inject(Store);
  selectedTab = input.required<ResourceTab>();
  searchCount = this.#store.selectSignal(SearchSelectors.getResourcesCount);
  resources = this.#store.selectSignal(SearchSelectors.getResources);
  sortBy = this.#store.selectSignal(SearchSelectors.getSortBy);
  first = this.#store.selectSignal(SearchSelectors.getFirst);
  next = this.#store.selectSignal(SearchSelectors.getNext);
  prev = this.#store.selectSignal(SearchSelectors.getPrevious);

  protected filters = this.#store.selectSignal(
    ResourceFiltersSelectors.getAllFilters,
  );
  protected isAnyFilterSelected = computed(() => {
    return (
      this.filters().creator.value ||
      this.filters().dateCreated.value ||
      this.filters().funder.value ||
      this.filters().subject.value ||
      this.filters().license.value ||
      this.filters().resourceType.value ||
      this.filters().institution.value ||
      this.filters().provider.value ||
      this.filters().partOfCollection.value
    );
  });

  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  protected selectedSort = signal('');

  protected readonly sortTabOptions = [
    { label: 'Relevance', value: '-relevance' },
    { label: 'Date created (newest)', value: '-dateCreated' },
    { label: 'Date created (oldest)', value: 'dateCreated' },
    { label: 'Date modified (newest)', value: '-dateModified' },
    { label: 'Date modified (oldest)', value: 'dateModified' },
  ];

  constructor() {
    // if new value for sorting in store, update value in dropdown
    effect(() => {
      const storeValue = this.sortBy();
      const currentInput = untracked(() => this.selectedSort());

      if (storeValue && currentInput !== storeValue) {
        this.selectedSort.set(storeValue);
      }
    });

    // if the sorting was changed, set new value to store
    effect(() => {
      const chosenValue = this.selectedSort();
      const storeValue = untracked(() => this.sortBy());

      if (chosenValue !== storeValue) {
        this.#store.dispatch(new SetSortBy(chosenValue));
      }
    });
  }

  // pagination
  switchPage(link: string) {
    this.#store.dispatch(new GetResourcesByLink(link));
  }
}
