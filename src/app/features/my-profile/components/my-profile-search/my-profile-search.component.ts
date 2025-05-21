import { Store } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, skip } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { UserSelectors } from '@core/store/user/user.selectors';
import { GetAllOptions } from '@osf/features/my-profile/components/resources/components/resource-filters/components/filters/store/my-profile-resource-filters-options.actions';
import { MyProfileResourceFiltersSelectors } from '@osf/features/my-profile/components/resources/components/resource-filters/store/my-profile-resource-filters.selectors';
import { MyProfileResourcesComponent } from '@osf/features/my-profile/components/resources/my-profile-resources.component';
import { GetResources, SetResourceTab, SetSearchText } from '@osf/features/my-profile/store/my-profile.actions';
import { MyProfileSelectors } from '@osf/features/my-profile/store/my-profile.selectors';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { ResourceTab } from '@shared/entities/resource-card/resource-tab.enum';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-my-profile-search',
  imports: [
    Button,
    NgOptimizedImage,
    SearchInputComponent,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    MyProfileResourcesComponent,
  ],
  templateUrl: './my-profile-search.component.html',
  styleUrl: './my-profile-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileSearchComponent {
  readonly #store = inject(Store);

  protected searchValue = signal('');
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  protected readonly dateCreatedFilter = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getDateCreated);
  protected readonly funderFilter = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getFunder);
  protected readonly subjectFilter = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getSubject);
  protected readonly licenseFilter = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getLicense);
  protected readonly resourceTypeFilter = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getResourceType);
  protected readonly institutionFilter = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getInstitution);
  protected readonly providerFilter = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getProvider);
  protected readonly partOfCollectionFilter = this.#store.selectSignal(
    MyProfileResourceFiltersSelectors.getPartOfCollection
  );
  protected searchStoreValue = this.#store.selectSignal(MyProfileSelectors.getSearchText);
  protected resourcesTabStoreValue = this.#store.selectSignal(MyProfileSelectors.getResourceTab);
  protected sortByStoreValue = this.#store.selectSignal(MyProfileSelectors.getSortBy);
  readonly isMyProfilePage = this.#store.selectSignal(MyProfileSelectors.getIsMyProfile);
  readonly currentUser = this.#store.select(UserSelectors.getCurrentUser);

  protected selectedTab: ResourceTab = ResourceTab.All;
  protected readonly ResourceTab = ResourceTab;
  protected currentStep = 0;
  private skipInitializationEffects = 0;

  constructor() {
    this.currentUser.subscribe((user) => {
      if (user?.id) {
        this.#store.dispatch(GetAllOptions);
        this.#store.dispatch(GetResources);
      }
    });

    effect(() => {
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
      if (this.skipInitializationEffects > 0) {
        this.#store.dispatch(GetResources);
      }
      this.skipInitializationEffects += 1;
    });

    // put search value in store and update resources, filters
    toObservable(this.searchValue)
      .pipe(skip(1), debounceTime(500))
      .subscribe((searchText) => {
        this.#store.dispatch(new SetSearchText(searchText));
        this.#store.dispatch(GetAllOptions);
      });

    // sync search with query parameters if search is empty and parameters are not
    effect(() => {
      const storeValue = this.searchStoreValue();
      const currentInput = untracked(() => this.searchValue());

      if (storeValue && currentInput !== storeValue) {
        this.searchValue.set(storeValue);
      }
    });

    // sync resource tabs with store
    effect(() => {
      if (this.selectedTab !== this.resourcesTabStoreValue()) {
        this.selectedTab = this.resourcesTabStoreValue();
      }
    });
  }

  onTabChange(index: ResourceTab): void {
    this.#store.dispatch(new SetResourceTab(index));
    this.selectedTab = index;
    this.#store.dispatch(GetAllOptions);
  }
}
