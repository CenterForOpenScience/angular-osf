import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import {
  LoadingSpinnerComponent,
  SearchInputComponent,
  SelectComponent,
  SubHeaderComponent,
} from '@osf/shared/components';
import { Primitive } from '@osf/shared/helpers';
import { AddonCardListComponent } from '@shared/components/addons';
import { ADDON_CATEGORY_OPTIONS, ADDON_TAB_OPTIONS } from '@shared/constants';
import { AddonCategory, AddonTabValue } from '@shared/enums';
import {
  AddonsSelectors,
  CreateAuthorizedAddon,
  DeleteAuthorizedAddon,
  GetAddonsUserReference,
  GetAuthorizedCitationAddons,
  GetAuthorizedStorageAddons,
  GetCitationAddons,
  GetStorageAddons,
  UpdateAuthorizedAddon,
} from '@shared/stores/addons';

@Component({
  selector: 'osf-addons',
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
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsComponent {
  readonly tabOptions = ADDON_TAB_OPTIONS;
  readonly categoryOptions = ADDON_CATEGORY_OPTIONS;

  AddonTabValue = AddonTabValue;
  defaultTabValue = AddonTabValue.ALL_ADDONS;

  searchControl = new FormControl<string>('');

  searchValue = signal<string>('');
  selectedCategory = signal<string>(AddonCategory.EXTERNAL_STORAGE_SERVICES);
  selectedTab = signal<number>(this.defaultTabValue);

  currentUser = select(UserSelectors.getCurrentUser);
  addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  storageAddons = select(AddonsSelectors.getStorageAddons);
  citationAddons = select(AddonsSelectors.getCitationAddons);
  authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  authorizedCitationAddons = select(AddonsSelectors.getAuthorizedCitationAddons);

  isCurrentUserLoading = select(UserSelectors.getCurrentUserLoading);
  isUserReferenceLoading = select(AddonsSelectors.getAddonsUserReferenceLoading);
  isStorageAddonsLoading = select(AddonsSelectors.getStorageAddonsLoading);
  isCitationAddonsLoading = select(AddonsSelectors.getCitationAddonsLoading);
  isAuthorizedStorageAddonsLoading = select(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  isAuthorizedCitationAddonsLoading = select(AddonsSelectors.getAuthorizedCitationAddonsLoading);

  isAddonsLoading = computed(() => {
    return (
      this.isStorageAddonsLoading() ||
      this.isCitationAddonsLoading() ||
      this.isUserReferenceLoading() ||
      this.isCurrentUserLoading()
    );
  });
  isAuthorizedAddonsLoading = computed(() => {
    return (
      this.isAuthorizedStorageAddonsLoading() ||
      this.isAuthorizedCitationAddonsLoading() ||
      this.isUserReferenceLoading() ||
      this.isCurrentUserLoading()
    );
  });

  actions = createDispatchMap({
    getStorageAddons: GetStorageAddons,
    getCitationAddons: GetCitationAddons,
    getAuthorizedStorageAddons: GetAuthorizedStorageAddons,
    getAuthorizedCitationAddons: GetAuthorizedCitationAddons,
    createAuthorizedAddon: CreateAuthorizedAddon,
    updateAuthorizedAddon: UpdateAuthorizedAddon,
    getAddonsUserReference: GetAddonsUserReference,
    deleteAuthorizedAddon: DeleteAuthorizedAddon,
  });

  readonly allAuthorizedAddons = computed(() => {
    const authorizedAddons = [...this.authorizedStorageAddons(), ...this.authorizedCitationAddons()];

    const searchValue = this.searchValue().toLowerCase();
    return authorizedAddons.filter((card) => card.displayName.includes(searchValue));
  });

  readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  readonly currentAction = computed(() =>
    this.selectedCategory() === AddonCategory.EXTERNAL_STORAGE_SERVICES
      ? this.actions.getStorageAddons
      : this.actions.getCitationAddons
  );

  readonly currentAddonsState = computed(() =>
    this.selectedCategory() === AddonCategory.EXTERNAL_STORAGE_SERVICES ? this.storageAddons() : this.citationAddons()
  );

  readonly filteredAddonCards = computed(() => {
    const searchValue = this.searchValue().toLowerCase();
    return this.currentAddonsState().filter((card) => card.externalServiceName.toLowerCase().includes(searchValue));
  });

  onCategoryChange(value: Primitive): void {
    if (typeof value === 'string') {
      this.selectedCategory.set(value);
    }
  }

  constructor() {
    // TODO There should not be three effects
    effect(() => {
      if (this.currentUser()) {
        this.actions.getAddonsUserReference();
      }
    });

    // TODO There should not be three effects
    effect(() => {
      if (this.currentUser() && this.userReferenceId()) {
        const action = this.currentAction();
        const addons = this.currentAddonsState();

        if (!addons?.length) {
          action();
        }
      }
    });

    // TODO There should not be three effects
    effect(() => {
      if (this.currentUser() && this.userReferenceId()) {
        this.fetchAllAuthorizedAddons(this.userReferenceId());
      }
    });

    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.searchValue.set(value ?? '');
    });
  }

  private fetchAllAuthorizedAddons(userReferenceId: string): void {
    this.actions.getAuthorizedStorageAddons(userReferenceId);
    this.actions.getAuthorizedCitationAddons(userReferenceId);
  }
}
