import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { AccordionModule } from 'primeng/accordion';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { Tab, TabList, Tabs } from 'primeng/tabs';

import { debounceTime, skip } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchHelpTutorialComponent, SearchInputComponent } from '@osf/shared/components';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants';
import { ResourceTab } from '@osf/shared/enums';
import { IS_SMALL } from '@osf/shared/utils';

import { GetAllOptions } from './components/filters/store';
import { ResetFiltersState, ResourceFiltersSelectors } from './components/resource-filters/store';
import { ResourcesWrapperComponent } from './components';
import { GetResources, ResetSearchState, SearchSelectors, SetResourceTab, SetSearchText } from './store';

@Component({
  selector: 'osf-search',
  imports: [
    SearchInputComponent,
    ReactiveFormsModule,
    Tab,
    TabList,
    Tabs,
    TranslatePipe,
    FormsModule,
    AccordionModule,
    TableModule,
    DataViewModule,
    ResourcesWrapperComponent,
    SearchHelpTutorialComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnDestroy {
  readonly store = inject(Store);

  protected searchControl = new FormControl('');
  protected readonly isSmall = toSignal(inject(IS_SMALL));

  private readonly destroyRef = inject(DestroyRef);

  protected readonly creatorsFilter = select(ResourceFiltersSelectors.getCreator);
  protected readonly dateCreatedFilter = select(ResourceFiltersSelectors.getDateCreated);
  protected readonly funderFilter = select(ResourceFiltersSelectors.getFunder);
  protected readonly subjectFilter = select(ResourceFiltersSelectors.getSubject);
  protected readonly licenseFilter = select(ResourceFiltersSelectors.getLicense);
  protected readonly resourceTypeFilter = select(ResourceFiltersSelectors.getResourceType);
  protected readonly institutionFilter = select(ResourceFiltersSelectors.getInstitution);
  protected readonly providerFilter = select(ResourceFiltersSelectors.getProvider);
  protected readonly partOfCollectionFilter = select(ResourceFiltersSelectors.getPartOfCollection);
  protected searchStoreValue = select(SearchSelectors.getSearchText);
  protected resourcesTabStoreValue = select(SearchSelectors.getResourceTab);
  protected sortByStoreValue = select(SearchSelectors.getSortBy);

  protected readonly resourceTabOptions = SEARCH_TAB_OPTIONS;
  protected selectedTab: ResourceTab = ResourceTab.All;

  protected currentStep = signal(0);

  constructor() {
    effect(() => {
      this.creatorsFilter();
      this.dateCreatedFilter();
      this.funderFilter();
      this.subjectFilter();
      this.licenseFilter();
      this.resourceTypeFilter();
      this.institutionFilter();
      this.providerFilter();
      this.partOfCollectionFilter();
      this.searchStoreValue();
      this.resourcesTabStoreValue();
      this.sortByStoreValue();
      this.store.dispatch(GetResources);
    });

    effect(() => {
      const storeValue = this.searchStoreValue();
      const currentInput = untracked(() => this.searchControl.value);

      if (storeValue && currentInput !== storeValue) {
        this.searchControl.setValue(storeValue);
      }
    });

    effect(() => {
      if (this.selectedTab !== this.resourcesTabStoreValue()) {
        this.selectedTab = this.resourcesTabStoreValue();
      }
    });

    this.setSearchSubscription();
  }

  ngOnDestroy(): void {
    this.store.dispatch(ResetFiltersState);
    this.store.dispatch(ResetSearchState);
  }

  onTabChange(index: ResourceTab): void {
    this.store.dispatch(new SetResourceTab(index));
    this.selectedTab = index;
    this.store.dispatch(GetAllOptions);
  }

  showTutorial() {
    this.currentStep.set(1);
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(skip(1), debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchText) => {
        this.store.dispatch(new SetSearchText(searchText ?? ''));
        this.store.dispatch(GetAllOptions);
      });
  }
}
