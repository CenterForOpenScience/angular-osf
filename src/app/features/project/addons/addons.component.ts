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
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { Primitive } from '@osf/shared/helpers';
import { LoadingSpinnerComponent, SearchInputComponent, SelectComponent, SubHeaderComponent } from '@shared/components';
import { AddonCardListComponent } from '@shared/components/addons';
import { ADDON_CATEGORY_OPTIONS, ADDON_TAB_OPTIONS } from '@shared/constants';
import { AddonCategory, AddonTabValue } from '@shared/enums';
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

@Component({
  selector: 'osf-addons',
  imports: [
    AddonCardListComponent,
    SearchInputComponent,
    SelectComponent,
    SubHeaderComponent,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    TranslatePipe,
    FormsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  readonly tabOptions = ADDON_TAB_OPTIONS;
  readonly categoryOptions = ADDON_CATEGORY_OPTIONS;
  readonly AddonTabValue = AddonTabValue;
  readonly defaultTabValue = AddonTabValue.ALL_ADDONS;
  searchControl = new FormControl<string>('');
  searchValue = signal<string>('');
  selectedCategory = signal<string>(AddonCategory.EXTERNAL_STORAGE_SERVICES);
  selectedTab = signal<number>(this.defaultTabValue);

  currentUser = select(UserSelectors.getCurrentUser);
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
    return (
      this.isConfiguredStorageAddonsLoading() ||
      this.isConfiguredCitationAddonsLoading() ||
      this.isConfiguredLinkAddonsLoading() ||
      this.isResourceReferenceLoading() ||
      this.isCurrentUserLoading()
    );
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
    const authorizedAddons = [
      ...this.configuredStorageAddons(),
      ...this.configuredCitationAddons(),
      ...this.configuredLinkAddons(),
    ];

    const searchValue = this.searchValue().toLowerCase();
    return authorizedAddons.filter((card) => card.displayName.toLowerCase().includes(searchValue));
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

  filteredAddonCards = computed(() => {
    const searchValue = this.searchValue().toLowerCase();
    return this.currentAddonsState().filter(
      (card) =>
        card.externalServiceName.toLowerCase().includes(searchValue) ||
        card.displayName.toLowerCase().includes(searchValue)
    );
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
      if (this.currentUser()) {
        const action = this.currentAction();
        const addons = this.currentAddonsState();
        const isLoading = this.currentAddonsLoading();

        if (!addons?.length && !isLoading) {
          action();
        }
      }
    });

    effect(() => {
      const resourceReferenceId = this.resourceReferenceId();
      if (resourceReferenceId) {
        this.fetchAllConfiguredAddons(resourceReferenceId);
      }
    });

    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchValue.set(value ?? '');
    });

    effect(() => {
      this.destroyRef.onDestroy(() => {
        this.actions.clearConfiguredAddons();
      });
    });
  }

  ngOnInit(): void {
    const projectId = this.route.parent?.parent?.snapshot.params['id'];

    if (projectId && !this.addonsResourceReference().length) {
      this.actions.getAddonsResourceReference(projectId);
    }
  }

  private fetchAllConfiguredAddons(resourceReferenceId: string): void {
    this.actions.getConfiguredStorageAddons(resourceReferenceId);
    this.actions.getConfiguredCitationAddons(resourceReferenceId);
    this.actions.getConfiguredLinkAddons(resourceReferenceId);
  }
}
