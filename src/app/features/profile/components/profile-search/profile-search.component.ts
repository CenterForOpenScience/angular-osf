import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { debounceTime, skip } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { ProfileFilterChipsComponent, ProfileResourceFiltersComponent } from '@osf/features/profile/components';
import {
  SearchHelpTutorialComponent,
  SearchInputComponent,
  SearchResultsContainerComponent,
} from '@osf/shared/components';
import { IS_XSMALL, Primitive } from '@osf/shared/helpers';
import { User } from '@osf/shared/models';
import { SEARCH_TAB_OPTIONS } from '@shared/constants';
import { ResourceTab } from '@shared/enums';

import {
  GetResources,
  GetResourcesByLink,
  ProfileSelectors,
  SetResourceTab,
  SetSearchText,
  SetSortBy,
} from '../../store';
import { GetAllOptions } from '../filters/store';
import { ProfileResourceFiltersSelectors } from '../profile-resource-filters/store';

@Component({
  selector: 'osf-profile-search',
  imports: [
    TranslatePipe,
    SearchInputComponent,
    SearchHelpTutorialComponent,
    ProfileFilterChipsComponent,
    ProfileResourceFiltersComponent,
    SearchResultsContainerComponent,
  ],
  templateUrl: './profile-search.component.html',
  styleUrl: './profile-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSearchComponent {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  private readonly actions = createDispatchMap({
    getResourcesByLink: GetResourcesByLink,
    setResourceTab: SetResourceTab,
    setSortBy: SetSortBy,
  });

  currentUser = input<User | null>();

  protected searchControl = new FormControl<string>('');

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
  searchCount = select(ProfileSelectors.getResourcesCount);
  resources = select(ProfileSelectors.getResources);
  first = select(ProfileSelectors.getFirst);
  next = select(ProfileSelectors.getNext);
  prev = select(ProfileSelectors.getPrevious);
  protected filters = select(ProfileResourceFiltersSelectors.getAllFilters);

  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  protected currentStep = signal(0);
  private skipInitializationEffects = 0;

  protected readonly resourceTabOptions = SEARCH_TAB_OPTIONS.filter((x) => x.value !== ResourceTab.Users);
  protected isAnyFilterSelected = computed(() => {
    return (
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

  constructor() {
    effect(() => {
      if (this.currentUser()) {
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
  }

  showTutorial() {
    this.currentStep.set(1);
  }

  onTabChange(index: ResourceTab): void {
    this.actions.setResourceTab(index);
  }

  switchPage(link: string) {
    this.actions.getResourcesByLink(link);
  }

  sortOptionSelected(value: Primitive) {
    this.actions.setSortBy(value as string);
  }
}
