import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, Tabs } from 'primeng/tabs';

import { debounceTime, skip } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { SearchHelpTutorialComponent, SearchInputComponent } from '@osf/shared/components';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants';
import { ResourceTab } from '@osf/shared/enums';
import { IS_XSMALL } from '@osf/shared/helpers';

import { GetResources, MyProfileSelectors, SetResourceTab, SetSearchText } from '../../store';
import { GetAllOptions } from '../filters/store';
import { MyProfileResourceFiltersSelectors } from '../my-profile-resource-filters/store';
import { MyProfileResourcesComponent } from '../my-profile-resources/my-profile-resources.component';

@Component({
  selector: 'osf-my-profile-search',
  imports: [
    TranslatePipe,
    SearchInputComponent,
    Tab,
    TabList,
    Tabs,
    MyProfileResourcesComponent,
    SearchHelpTutorialComponent,
  ],
  templateUrl: './my-profile-search.component.html',
  styleUrl: './my-profile-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileSearchComponent {
  readonly store = inject(Store);

  protected searchControl = new FormControl<string>('');
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  private readonly destroyRef = inject(DestroyRef);

  protected readonly dateCreatedFilter = select(MyProfileResourceFiltersSelectors.getDateCreated);
  protected readonly funderFilter = select(MyProfileResourceFiltersSelectors.getFunder);
  protected readonly subjectFilter = select(MyProfileResourceFiltersSelectors.getSubject);
  protected readonly licenseFilter = select(MyProfileResourceFiltersSelectors.getLicense);
  protected readonly resourceTypeFilter = select(MyProfileResourceFiltersSelectors.getResourceType);
  protected readonly institutionFilter = select(MyProfileResourceFiltersSelectors.getInstitution);
  protected readonly providerFilter = select(MyProfileResourceFiltersSelectors.getProvider);
  protected readonly partOfCollectionFilter = select(MyProfileResourceFiltersSelectors.getPartOfCollection);
  protected searchStoreValue = select(MyProfileSelectors.getSearchText);
  protected resourcesTabStoreValue = select(MyProfileSelectors.getResourceTab);
  protected sortByStoreValue = select(MyProfileSelectors.getSortBy);
  readonly isMyProfilePage = select(MyProfileSelectors.getIsMyProfile);
  readonly currentUser = this.store.select(UserSelectors.getCurrentUser);

  protected readonly resourceTabOptions = SEARCH_TAB_OPTIONS.filter((x) => x.value !== ResourceTab.Users);
  protected selectedTab: ResourceTab = ResourceTab.All;

  protected currentStep = signal(0);
  private skipInitializationEffects = 0;

  constructor() {
    this.currentUser.subscribe((user) => {
      if (user?.id) {
        this.store.dispatch(GetAllOptions);
        this.store.dispatch(GetResources);
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
        this.store.dispatch(GetResources);
      }
      this.skipInitializationEffects += 1;
    });

    this.searchControl.valueChanges
      .pipe(skip(1), debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchText) => {
        this.store.dispatch(new SetSearchText(searchText ?? ''));
        this.store.dispatch(GetAllOptions);
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
    this.store.dispatch(new SetResourceTab(index));
    this.selectedTab = index;
    this.store.dispatch(GetAllOptions);
  }

  showTutorial() {
    this.currentStep.set(1);
  }
}
