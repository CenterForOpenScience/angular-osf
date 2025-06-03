import { Store } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, skip } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { SearchInputComponent } from '@osf/shared/components';
import { ResourceTab } from '@osf/shared/enums';
import { IS_XSMALL } from '@osf/shared/utils';

import { GetResources, MyProfileSelectors, SetResourceTab, SetSearchText } from '../../store';
import { GetAllOptions } from '../filters/store';
import { MyProfileResourceFiltersSelectors } from '../my-profile-resource-filters/store';
import { MyProfileResourcesComponent } from '../my-profile-resources/my-profile-resources.component';

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

  protected searchControl = new FormControl<string>('');
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  private readonly destroyRef = inject(DestroyRef);

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

    this.searchControl.valueChanges
      .pipe(skip(1), debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchText) => {
        this.#store.dispatch(new SetSearchText(searchText ?? ''));
        this.#store.dispatch(GetAllOptions);
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
  }

  onTabChange(index: ResourceTab): void {
    this.#store.dispatch(new SetResourceTab(index));
    this.selectedTab = index;
    this.#store.dispatch(GetAllOptions);
  }
}
