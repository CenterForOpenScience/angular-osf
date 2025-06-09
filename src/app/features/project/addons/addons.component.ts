import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { LoadingSpinnerComponent, SearchInputComponent, SubHeaderComponent } from '@shared/components';
import { AddonCardListComponent } from '@shared/components/addons';
import { ADDON_CATEGORY_OPTIONS, ADDON_TAB_OPTIONS } from '@shared/constants';
import { AddonCategory, AddonTabValue } from '@shared/enums';
import {
  AddonsSelectors,
  DeleteAuthorizedAddon,
  GetAddonsResourceReference,
  GetAddonsUserReference,
  GetCitationAddons,
  GetConfiguredCitationAddons,
  GetConfiguredStorageAddons,
  GetStorageAddons,
} from '@shared/stores/addons';
import { IS_XSMALL } from '@shared/utils';

@Component({
  selector: 'osf-addons',
  imports: [
    AddonCardListComponent,
    SearchInputComponent,
    Select,
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
  protected readonly tabOptions = ADDON_TAB_OPTIONS;
  protected readonly categoryOptions = ADDON_CATEGORY_OPTIONS;
  protected isMobile = toSignal(inject(IS_XSMALL));
  protected AddonTabValue = AddonTabValue;
  protected defaultTabValue = AddonTabValue.ALL_ADDONS;
  protected searchControl = new FormControl<string>('');
  protected selectedCategory = signal<string>(AddonCategory.EXTERNAL_STORAGE_SERVICES);
  protected selectedTab = signal<number>(this.defaultTabValue);

  protected currentUser = select(UserSelectors.getCurrentUser);
  protected addonsResourceReference = select(AddonsSelectors.getAddonsResourceReference);
  protected addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  protected storageAddons = select(AddonsSelectors.getStorageAddons);
  protected citationAddons = select(AddonsSelectors.getCitationAddons);
  protected configuredStorageAddons = select(AddonsSelectors.getConfiguredStorageAddons);
  protected configuredCitationAddons = select(AddonsSelectors.getConfiguredCitationAddons);

  protected isCurrentUserLoading = select(UserSelectors.getCurrentUserLoading);
  protected isUserReferenceLoading = select(AddonsSelectors.getAddonsUserReferenceLoading);
  protected isResourceReferenceLoading = select(AddonsSelectors.getAddonsResourceReferenceLoading);
  protected isStorageAddonsLoading = select(AddonsSelectors.getStorageAddonsLoading);
  protected isCitationAddonsLoading = select(AddonsSelectors.getCitationAddonsLoading);
  protected isConfiguredStorageAddonsLoading = select(AddonsSelectors.getConfiguredStorageAddonsLoading);
  protected isConfiguredCitationAddonsLoading = select(AddonsSelectors.getConfiguredCitationAddonsLoading);
  protected isAddonsLoading = computed(() => {
    return (
      this.isStorageAddonsLoading() ||
      this.isCitationAddonsLoading() ||
      this.isUserReferenceLoading() ||
      this.isResourceReferenceLoading() ||
      this.isCurrentUserLoading()
    );
  });

  protected actions = createDispatchMap({
    getStorageAddons: GetStorageAddons,
    getCitationAddons: GetCitationAddons,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    getConfiguredCitationAddons: GetConfiguredCitationAddons,
    getAddonsUserReference: GetAddonsUserReference,
    getAddonsResourceReference: GetAddonsResourceReference,
    deleteAuthorizedAddon: DeleteAuthorizedAddon,
  });

  protected readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  protected allConfiguredAddons = computed(() => {
    const authorizedAddons = [...this.configuredStorageAddons(), ...this.configuredCitationAddons()];

    const searchValue = this.searchControl.value?.toLowerCase() ?? '';
    return authorizedAddons.filter((card) => card.displayName.includes(searchValue));
  });

  protected resourceReferenceId = computed(() => {
    return this.addonsResourceReference()[0]?.id;
  });

  protected currentAction = computed(() =>
    this.selectedCategory() === AddonCategory.EXTERNAL_STORAGE_SERVICES
      ? this.actions.getStorageAddons
      : this.actions.getCitationAddons
  );

  protected currentAddonsState = computed(() =>
    this.selectedCategory() === AddonCategory.EXTERNAL_STORAGE_SERVICES ? this.storageAddons() : this.citationAddons()
  );

  protected filteredAddonCards = computed(() => {
    const searchValue = this.searchControl.value?.toLowerCase() ?? '';
    return this.currentAddonsState().filter(
      (card) =>
        card.externalServiceName.toLowerCase().includes(searchValue) ||
        card.displayName.toLowerCase().includes(searchValue)
    );
  });

  protected onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
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
      const resourceReferenceId = this.resourceReferenceId();
      if (resourceReferenceId) {
        this.fetchAllConfiguredAddons(resourceReferenceId);
      }
    });
  }

  ngOnInit(): void {
    const projectId = this.route.parent?.parent?.snapshot.params['id'];

    if (projectId && !this.addonsResourceReference()) {
      this.actions.getAddonsResourceReference(projectId);
    }
  }

  private fetchAllConfiguredAddons(resourceReferenceId: string): void {
    this.actions.getConfiguredStorageAddons(resourceReferenceId);
    this.actions.getConfiguredCitationAddons(resourceReferenceId);
  }
}
