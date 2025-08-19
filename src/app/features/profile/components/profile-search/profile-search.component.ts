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

import { GetResources, ProfileSelectors, SetResourceTab, SetSearchText } from '../../store';
import { GetAllOptions } from '../filters/store';
import { ProfileResourceFiltersSelectors } from '../profile-resource-filters/store';
import { ProfileResourcesComponent } from '../profile-resources/profile-resources.component';

@Component({
  selector: 'osf-profile-search',
  imports: [
    TranslatePipe,
    SearchInputComponent,
    Tab,
    TabList,
    Tabs,
    ProfileResourcesComponent,
    SearchHelpTutorialComponent,
  ],
  templateUrl: './profile-search.component.html',
  styleUrl: './profile-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSearchComponent {
  readonly store = inject(Store);

  protected searchControl = new FormControl<string>('');
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  private readonly destroyRef = inject(DestroyRef);

  protected readonly dateCreatedFilter = select(ProfileResourceFiltersSelectors.getDateCreated);
  protected readonly funderFilter = select(ProfileResourceFiltersSelectors.getFunder);
  protected readonly subjectFilter = select(ProfileResourceFiltersSelectors.getSubject);
  protected readonly licenseFilter = select(ProfileResourceFiltersSelectors.getLicense);
  protected readonly resourceTypeFilter = select(ProfileResourceFiltersSelectors.getResourceType);
  protected readonly institutionFilter = select(ProfileResourceFiltersSelectors.getInstitution);
  protected readonly providerFilter = select(ProfileResourceFiltersSelectors.getProvider);
  protected readonly partOfCollectionFilter = select(ProfileResourceFiltersSelectors.getPartOfCollection);
  protected searchStoreValue = select(ProfileSelectors.getSearchText);
  protected resourcesTabStoreValue = select(ProfileSelectors.getResourceTab);
  protected sortByStoreValue = select(ProfileSelectors.getSortBy);
  readonly isMyProfilePage = select(ProfileSelectors.getIsMyProfile);
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
