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

import { UserSelectors } from '@core/store/user';
import { AddonCardListComponent } from '@osf/shared/components/addons/addon-card-list/addon-card-list.component';
import { AddonsToolbarComponent } from '@osf/shared/components/addons/addons-toolbar/addons-toolbar.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ADDON_CATEGORY_OPTIONS } from '@osf/shared/constants/addons-category-options.const';
import { ADDON_TAB_OPTIONS } from '@osf/shared/constants/addons-tab-options.const';
import { AddonTabValue } from '@osf/shared/enums/addon-tab.enum';
import { AddonCategory } from '@osf/shared/enums/addons-category.enum';
import { createAddonCardModel, sortAddonCardsAlphabetically } from '@osf/shared/helpers/addon-card.helper';
import { isAddonServiceConfigured } from '@osf/shared/helpers/addon-type.helper';
import { AddonCardModel } from '@shared/models/addons/addon-card.model';
import { AddonsQueryParamsService } from '@shared/services/addons-query-params.service';
import {
  AddonsSelectors,
  ClearConfiguredAddons,
  DeleteAuthorizedAddon,
  GetAddonsResourceReference,
  GetAddonsUserReference,
  GetCitationAddons,
  GetConfiguredCitationAddons,
  GetConfiguredLinkAddons,
  GetConfiguredStorageAddons,
  GetLinkAddons,
  GetStorageAddons,
} from '@shared/stores/addons';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';

@Component({
  selector: 'osf-project-addons',
  imports: [
    AddonCardListComponent,
    AddonsToolbarComponent,
    SubHeaderComponent,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    TranslatePipe,
    FormsModule,
    LoadingSpinnerComponent,
    SelectComponent,
  ],
  templateUrl: './project-addons.component.html',
  styleUrl: './project-addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAddonsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private queryParamsService = inject(AddonsQueryParamsService);
  readonly tabOptions = ADDON_TAB_OPTIONS;
  readonly categoryOptions = ADDON_CATEGORY_OPTIONS;
  readonly AddonTabValue = AddonTabValue;
  readonly defaultTabValue = AddonTabValue.ALL_ADDONS;
  searchControl = new FormControl<string>('');
  searchValue = signal<string>('');
  selectedCategory = signal<string>(AddonCategory.EXTERNAL_STORAGE_SERVICES);
  selectedTab = model<number>(this.defaultTabValue);

  currentUser = select(UserSelectors.getCurrentUser);
  hasAdminAccess = select(CurrentResourceSelectors.hasAdminAccess);
  addonsResourceReference = select(AddonsSelectors.getAddonsResourceReference);
  addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  storageAddons = select(AddonsSelectors.getStorageAddons);
  citationAddons = select(AddonsSelectors.getCitationAddons);
  linkAddons = select(AddonsSelectors.getLinkAddons);
  configuredStorageAddons = select(AddonsSelectors.getConfiguredStorageAddons);
  configuredCitationAddons = select(AddonsSelectors.getConfiguredCitationAddons);
  configuredLinkAddons = select(AddonsSelectors.getConfiguredLinkAddons);

  isCurrentUserLoading = select(UserSelectors.getCurrentUserLoading);
  isUserReferenceLoading = select(AddonsSelectors.getAddonsUserReferenceLoading);
  isResourceReferenceLoading = select(AddonsSelectors.getAddonsResourceReferenceLoading);
  isStorageAddonsLoading = select(AddonsSelectors.getStorageAddonsLoading);
  isCitationAddonsLoading = select(AddonsSelectors.getCitationAddonsLoading);
  isConfiguredStorageAddonsLoading = select(AddonsSelectors.getConfiguredStorageAddonsLoading);
  isConfiguredCitationAddonsLoading = select(AddonsSelectors.getConfiguredCitationAddonsLoading);
  isConfiguredLinkAddonsLoading = select(AddonsSelectors.getConfiguredLinkAddonsLoading);
  isAddonsLoading = computed(() => {
    return (
      this.isStorageAddonsLoading() ||
      this.isCitationAddonsLoading() ||
      this.isLinkAddonsLoading() ||
      this.isUserReferenceLoading() ||
      this.isCurrentUserLoading()
    );
  });
  isConfiguredAddonsLoading = computed(() => {
    let categoryLoading;

    switch (this.selectedCategory()) {
      case AddonCategory.EXTERNAL_STORAGE_SERVICES:
        categoryLoading = this.isConfiguredStorageAddonsLoading();
        break;
      case AddonCategory.EXTERNAL_CITATION_SERVICES:
        categoryLoading = this.isConfiguredCitationAddonsLoading();
        break;
      case AddonCategory.EXTERNAL_LINK_SERVICES:
        categoryLoading = this.isConfiguredLinkAddonsLoading();
        break;
      default:
        categoryLoading =
          this.isConfiguredStorageAddonsLoading() ||
          this.isConfiguredCitationAddonsLoading() ||
          this.isConfiguredLinkAddonsLoading();
    }

    return categoryLoading || this.isResourceReferenceLoading() || this.isCurrentUserLoading();
  });

  isLinkAddonsLoading = select(AddonsSelectors.getLinkAddonsLoading);

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

  isAllAddonsTabLoading = computed(() => {
    return this.currentAddonsLoading() || this.isConfiguredAddonsLoading();
  });

  actions = createDispatchMap({
    getStorageAddons: GetStorageAddons,
    getCitationAddons: GetCitationAddons,
    getLinkAddons: GetLinkAddons,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    getConfiguredCitationAddons: GetConfiguredCitationAddons,
    getConfiguredLinkAddons: GetConfiguredLinkAddons,
    getAddonsUserReference: GetAddonsUserReference,
    getAddonsResourceReference: GetAddonsResourceReference,
    deleteAuthorizedAddon: DeleteAuthorizedAddon,
    clearConfiguredAddons: ClearConfiguredAddons,
  });

  readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  allConfiguredAddons = computed(() => {
    let authorizedAddons;

    switch (this.selectedCategory()) {
      case AddonCategory.EXTERNAL_STORAGE_SERVICES:
        authorizedAddons = this.configuredStorageAddons();
        break;
      case AddonCategory.EXTERNAL_CITATION_SERVICES:
        authorizedAddons = this.configuredCitationAddons();
        break;
      case AddonCategory.EXTERNAL_LINK_SERVICES:
        authorizedAddons = this.configuredLinkAddons();
        break;
      default:
        authorizedAddons = [
          ...this.configuredStorageAddons(),
          ...this.configuredCitationAddons(),
          ...this.configuredLinkAddons(),
        ];
    }

    const searchValue = this.searchValue().toLowerCase();
    return authorizedAddons.filter((card) => card.displayName.toLowerCase().includes(searchValue));
  });

  allConfiguredAddonsForCheck = computed(() => {
    switch (this.selectedCategory()) {
      case AddonCategory.EXTERNAL_STORAGE_SERVICES:
        return this.configuredStorageAddons();
      case AddonCategory.EXTERNAL_CITATION_SERVICES:
        return this.configuredCitationAddons();
      case AddonCategory.EXTERNAL_LINK_SERVICES:
        return this.configuredLinkAddons();
      default:
        return [];
    }
  });

  resourceReferenceId = computed(() => {
    return this.addonsResourceReference()[0]?.id;
  });

  currentAction = computed(() => {
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

  currentAddonsState = computed(() => {
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

  filteredAddonCards = computed((): AddonCardModel[] => {
    const searchValue = this.searchValue().toLowerCase();
    const configuredAddons = this.allConfiguredAddonsForCheck();
    const addons = this.currentAddonsState() ?? [];

    const addonCards = addons
      .filter(
        (card) =>
          card.externalServiceName.toLowerCase().includes(searchValue) ||
          card.displayName.toLowerCase().includes(searchValue)
      )
      .map((addon) => {
        const isConfigured = isAddonServiceConfigured(addon, configuredAddons);
        const configuredAddon = configuredAddons.find(
          (config) => config.externalServiceName === addon.externalServiceName
        );

        return createAddonCardModel(addon, isConfigured, configuredAddon);
      });

    return sortAddonCardsAlphabetically(addonCards);
  });

  constructor() {
    this.setupEffects();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.searchValue.set(value ?? ''));

    this.destroyRef.onDestroy(() => {
      this.actions.clearConfiguredAddons();
    });
  }

  ngOnInit(): void {
    const projectId = this.route.parent?.parent?.snapshot.params['id'];

    if (projectId && !this.addonsResourceReference().length) {
      this.actions.getAddonsResourceReference(projectId);
    }

    const params = this.queryParamsService.readQueryParams(this.route);

    if (params.activeTab !== undefined) {
      this.selectedTab.set(params.activeTab);
    }
  }

  private setupEffects() {
    effect(() => {
      if (this.currentUser() && !this.userReferenceId()) {
        this.actions.getAddonsUserReference();
      }
    });

    effect(() => {
      if (this.currentUser()) {
        const action = this.currentAction();
        const addons = this.currentAddonsState();
        const isLoading = this.currentAddonsLoading();

        if (!addons && !isLoading) {
          action();
        }
      }
    });

    effect(() => {
      const resourceReferenceId = this.resourceReferenceId();
      const selectedCategory = this.selectedCategory();
      if (resourceReferenceId) {
        this.fetchConfiguredAddonsByCategory(resourceReferenceId, selectedCategory);
      }
    });

    effect(() => {
      const activeTab = this.selectedTab();
      this.queryParamsService.updateQueryParams(this.route, { activeTab });
    });
  }

  private fetchConfiguredAddonsByCategory(resourceReferenceId: string, category: string): void {
    untracked(() => {
      switch (category) {
        case AddonCategory.EXTERNAL_STORAGE_SERVICES:
          if (!this.configuredStorageAddons().length && !this.isConfiguredStorageAddonsLoading()) {
            this.actions.getConfiguredStorageAddons(resourceReferenceId);
          }
          break;
        case AddonCategory.EXTERNAL_CITATION_SERVICES:
          if (!this.configuredCitationAddons().length && !this.isConfiguredCitationAddonsLoading()) {
            this.actions.getConfiguredCitationAddons(resourceReferenceId);
          }
          break;
        case AddonCategory.EXTERNAL_LINK_SERVICES:
          if (!this.configuredLinkAddons().length && !this.isConfiguredLinkAddonsLoading()) {
            this.actions.getConfiguredLinkAddons(resourceReferenceId);
          }
          break;
      }
    });
  }
}
