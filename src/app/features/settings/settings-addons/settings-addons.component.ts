import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import {
  LoadingSpinnerComponent,
  SearchInputComponent,
  SelectComponent,
  SubHeaderComponent,
} from '@osf/shared/components';
import { Primitive, sortAddonCardsAlphabetically } from '@osf/shared/helpers';
import { AddonCardListComponent } from '@shared/components/addons';
import { ADDON_CATEGORY_OPTIONS, ADDON_TAB_OPTIONS } from '@shared/constants';
import { AddonCategory, AddonTabValue } from '@shared/enums';
import {
  AddonsSelectors,
  CreateAuthorizedAddon,
  DeleteAuthorizedAddon,
  GetAddonsUserReference,
  GetAuthorizedCitationAddons,
  GetAuthorizedLinkAddons,
  GetAuthorizedStorageAddons,
  GetCitationAddons,
  GetLinkAddons,
  GetStorageAddons,
  UpdateAuthorizedAddon,
} from '@shared/stores/addons';

@Component({
  selector: 'osf-settings-addons',
  imports: [
    SubHeaderComponent,
    TabList,
    Tabs,
    Tab,
    TabPanel,
    TabPanels,
    SearchInputComponent,
    AddonCardListComponent,
    SelectComponent,
    FormsModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './settings-addons.component.html',
  styleUrl: './settings-addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAddonsComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly tabOptions = ADDON_TAB_OPTIONS;
  readonly categoryOptions = ADDON_CATEGORY_OPTIONS;
  readonly AddonTabValue = AddonTabValue;
  readonly defaultTabValue = AddonTabValue.ALL_ADDONS;
  searchControl = new FormControl<string>('');
  searchValue = signal<string>('');
  selectedCategory = signal<string>(AddonCategory.EXTERNAL_STORAGE_SERVICES);
  selectedTab = signal<number>(this.defaultTabValue);

  currentUser = select(UserSelectors.getCurrentUser);
  addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  storageAddons = select(AddonsSelectors.getStorageAddons);
  citationAddons = select(AddonsSelectors.getCitationAddons);
  linkAddons = select(AddonsSelectors.getLinkAddons);
  authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  authorizedCitationAddons = select(AddonsSelectors.getAuthorizedCitationAddons);
  authorizedLinkAddons = select(AddonsSelectors.getAuthorizedLinkAddons);

  isCurrentUserLoading = select(UserSelectors.getCurrentUserLoading);
  isUserReferenceLoading = select(AddonsSelectors.getAddonsUserReferenceLoading);
  isStorageAddonsLoading = select(AddonsSelectors.getStorageAddonsLoading);
  isCitationAddonsLoading = select(AddonsSelectors.getCitationAddonsLoading);
  isLinkAddonsLoading = select(AddonsSelectors.getLinkAddonsLoading);
  isAuthorizedStorageAddonsLoading = select(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  isAuthorizedCitationAddonsLoading = select(AddonsSelectors.getAuthorizedCitationAddonsLoading);
  isAuthorizedLinkAddonsLoading = select(AddonsSelectors.getAuthorizedLinkAddonsLoading);

  isAddonsLoading = computed(() => {
    return (
      this.isStorageAddonsLoading() ||
      this.isCitationAddonsLoading() ||
      this.isLinkAddonsLoading() ||
      this.isUserReferenceLoading() ||
      this.isCurrentUserLoading()
    );
  });
  isAuthorizedAddonsLoading = computed(() => {
    return (
      this.isAuthorizedStorageAddonsLoading() ||
      this.isAuthorizedCitationAddonsLoading() ||
      this.isAuthorizedLinkAddonsLoading() ||
      this.isUserReferenceLoading() ||
      this.isCurrentUserLoading()
    );
  });

  actions = createDispatchMap({
    getStorageAddons: GetStorageAddons,
    getCitationAddons: GetCitationAddons,
    getLinkAddons: GetLinkAddons,
    getAuthorizedStorageAddons: GetAuthorizedStorageAddons,
    getAuthorizedCitationAddons: GetAuthorizedCitationAddons,
    getAuthorizedLinkAddons: GetAuthorizedLinkAddons,
    createAuthorizedAddon: CreateAuthorizedAddon,
    updateAuthorizedAddon: UpdateAuthorizedAddon,
    getAddonsUserReference: GetAddonsUserReference,
    deleteAuthorizedAddon: DeleteAuthorizedAddon,
  });

  readonly allAuthorizedAddons = computed(() => {
    const authorizedAddons = [
      ...this.authorizedStorageAddons(),
      ...this.authorizedCitationAddons(),
      ...this.authorizedLinkAddons(),
    ];

    const searchValue = this.searchValue().toLowerCase();
    const filteredAddons = authorizedAddons.filter((card) => card.displayName.toLowerCase().includes(searchValue));

    return sortAddonCardsAlphabetically(filteredAddons);
  });

  readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  readonly currentAction = computed(() => {
    switch (this.selectedCategory()) {
      case AddonCategory.EXTERNAL_STORAGE_SERVICES:
        return this.actions.getStorageAddons;
      case AddonCategory.EXTERNAL_CITATION_SERVICES:
        return this.actions.getCitationAddons;
      case AddonCategory.EXTERNAL_LINK_SERVICES:
        return this.actions.getLinkAddons;
      default:
        return this.actions.getStorageAddons;
    }
  });

  readonly currentAddonsState = computed(() => {
    switch (this.selectedCategory()) {
      case AddonCategory.EXTERNAL_STORAGE_SERVICES:
        return this.storageAddons();
      case AddonCategory.EXTERNAL_CITATION_SERVICES:
        return this.citationAddons();
      case AddonCategory.EXTERNAL_LINK_SERVICES:
        return this.linkAddons();
      default:
        return this.storageAddons();
    }
  });

  readonly filteredAddonCards = computed(() => {
    const searchValue = this.searchValue().toLowerCase();
    const filteredAddons = this.currentAddonsState().filter(
      (card) =>
        card.externalServiceName.toLowerCase().includes(searchValue) ||
        card.displayName.toLowerCase().includes(searchValue)
    );

    return sortAddonCardsAlphabetically(filteredAddons);
  });

  onCategoryChange(value: Primitive): void {
    if (typeof value === 'string') {
      this.selectedCategory.set(value);
    }
  }

  constructor() {
    effect(() => {
      if (this.currentUser() && !this.userReferenceId()) {
        this.actions.getAddonsUserReference();
      }
    });

    effect(() => {
      if (this.currentUser() && this.userReferenceId()) {
        const action = this.currentAction();
        const addons = this.currentAddonsState();

        if (!addons?.length) {
          action();
        }
      }
    });

    effect(() => {
      const userReferenceId = this.userReferenceId();
      if (userReferenceId) {
        this.fetchAllAuthorizedAddons(userReferenceId);
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.searchValue.set(value ?? ''));
  }

  private fetchAllAuthorizedAddons(userReferenceId: string): void {
    this.actions.getAuthorizedStorageAddons(userReferenceId);
    this.actions.getAuthorizedCitationAddons(userReferenceId);
    this.actions.getAuthorizedLinkAddons(userReferenceId);
  }
}
