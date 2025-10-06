import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  model,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { LoadingSpinnerComponent, SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { sortAddonCardsAlphabetically } from '@osf/shared/helpers';
import { AddonCardListComponent, AddonsToolbarComponent } from '@shared/components/addons';
import { ADDON_CATEGORY_OPTIONS, ADDON_TAB_OPTIONS } from '@shared/constants';
import { AddonCategory, AddonTabValue } from '@shared/enums';
import { AddonsQueryParamsService } from '@shared/services/addons-query-params.service';
import {
  AddonsSelectors,
  ClearAuthorizedAddons,
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
    AddonsToolbarComponent,
    AddonCardListComponent,
    FormsModule,
    TranslatePipe,
    LoadingSpinnerComponent,
    SelectComponent,
  ],
  templateUrl: './settings-addons.component.html',
  styleUrl: './settings-addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAddonsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly queryParamsService = inject(AddonsQueryParamsService);
  readonly tabOptions = ADDON_TAB_OPTIONS;
  readonly categoryOptions = ADDON_CATEGORY_OPTIONS;
  readonly AddonTabValue = AddonTabValue;
  readonly defaultTabValue = AddonTabValue.ALL_ADDONS;
  searchControl = new FormControl<string>('');
  searchValue = signal<string>('');
  selectedCategory = signal<string>(AddonCategory.EXTERNAL_STORAGE_SERVICES);
  selectedTab = model<number>(this.defaultTabValue);

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

  currentAddonsLoading = computed(() => {
    switch (this.selectedCategory()) {
      case AddonCategory.EXTERNAL_STORAGE_SERVICES:
        return this.isStorageAddonsLoading();
      case AddonCategory.EXTERNAL_CITATION_SERVICES:
        return this.isCitationAddonsLoading();
      case AddonCategory.EXTERNAL_LINK_SERVICES:
        return this.isLinkAddonsLoading();
      default:
        return this.isStorageAddonsLoading();
    }
  });

  isAddonsLoading = computed(() => {
    return this.currentAddonsLoading() || this.isUserReferenceLoading() || this.isCurrentUserLoading();
  });

  isAuthorizedAddonsLoading = computed(() => {
    let categoryLoading;

    switch (this.selectedCategory()) {
      case AddonCategory.EXTERNAL_STORAGE_SERVICES:
        categoryLoading = this.isAuthorizedStorageAddonsLoading();
        break;
      case AddonCategory.EXTERNAL_CITATION_SERVICES:
        categoryLoading = this.isAuthorizedCitationAddonsLoading();
        break;
      case AddonCategory.EXTERNAL_LINK_SERVICES:
        categoryLoading = this.isAuthorizedLinkAddonsLoading();
        break;
      default:
        categoryLoading =
          this.isAuthorizedStorageAddonsLoading() ||
          this.isAuthorizedCitationAddonsLoading() ||
          this.isAuthorizedLinkAddonsLoading();
    }

    return categoryLoading || this.isUserReferenceLoading() || this.isCurrentUserLoading();
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
    clearAuthorizedAddons: ClearAuthorizedAddons,
  });

  readonly allAuthorizedAddons = computed(() => {
    let authorizedAddons;

    switch (this.selectedCategory()) {
      case AddonCategory.EXTERNAL_STORAGE_SERVICES:
        authorizedAddons = this.authorizedStorageAddons();
        break;
      case AddonCategory.EXTERNAL_CITATION_SERVICES:
        authorizedAddons = this.authorizedCitationAddons();
        break;
      case AddonCategory.EXTERNAL_LINK_SERVICES:
        authorizedAddons = this.authorizedLinkAddons();
        break;
      default:
        authorizedAddons = [
          ...this.authorizedStorageAddons(),
          ...this.authorizedCitationAddons(),
          ...this.authorizedLinkAddons(),
        ];
    }

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

  constructor() {
    this.setupEffects();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.searchValue.set(value ?? ''));

    this.destroyRef.onDestroy(() => {
      this.actions.clearAuthorizedAddons();
    });
  }

  ngOnInit(): void {
    const params = this.queryParamsService.readQueryParams(this.route);

    if (params.activeTab !== undefined) {
      this.selectedTab.set(params.activeTab);
    }
  }

  private setupEffects() {
    effect(() => {
      const activeTab = this.selectedTab();
      this.queryParamsService.updateQueryParams(this.route, { activeTab });
    });

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
      const selectedCategory = this.selectedCategory();
      if (userReferenceId) {
        this.fetchAuthorizedAddonsByCategory(userReferenceId, selectedCategory);
      }
    });
  }

  private fetchAuthorizedAddonsByCategory(userReferenceId: string, category: string): void {
    untracked(() => {
      switch (category) {
        case AddonCategory.EXTERNAL_STORAGE_SERVICES:
          if (!this.authorizedStorageAddons().length && !this.isAuthorizedStorageAddonsLoading()) {
            this.actions.getAuthorizedStorageAddons(userReferenceId);
          }
          break;
        case AddonCategory.EXTERNAL_CITATION_SERVICES:
          if (!this.authorizedCitationAddons().length && !this.isAuthorizedCitationAddonsLoading()) {
            this.actions.getAuthorizedCitationAddons(userReferenceId);
          }
          break;
        case AddonCategory.EXTERNAL_LINK_SERVICES:
          if (!this.authorizedLinkAddons().length && !this.isAuthorizedLinkAddonsLoading()) {
            this.actions.getAuthorizedLinkAddons(userReferenceId);
          }
          break;
      }
    });
  }
}
