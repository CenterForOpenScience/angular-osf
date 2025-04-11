import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { ResourcesComponent } from '@shared/components/resources/resources.component';
import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';
import { Store } from '@ngxs/store';
import { GetResources, SearchSelectors } from '@osf/features/search/store';
import { ResourceFiltersSelectors } from '@shared/components/resources/resource-filters/store';

@Component({
  selector: 'osf-search',
  imports: [
    SearchInputComponent,
    DropdownModule,
    ReactiveFormsModule,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    NgOptimizedImage,
    AutoCompleteModule,
    FormsModule,
    AccordionModule,
    TableModule,
    DataViewModule,
    ResourcesComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  readonly #store = inject(Store);

  protected searchValue = signal('');
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly resources = this.#store.selectSignal(
    SearchSelectors.getResources,
  );
  protected readonly creatorsFilter = this.#store.selectSignal(
    ResourceFiltersSelectors.getCreator,
  );

  protected selectedTab = 0;
  protected readonly ResourceTab = ResourceTab;

  constructor() {
    effect(() => {
      this.creatorsFilter();
      this.#store.dispatch(GetResources);
    });
  }

  ngOnInit() {
    this.#store.dispatch(GetResources);
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }
}
