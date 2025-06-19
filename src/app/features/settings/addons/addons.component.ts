import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

import { Primitive } from '@osf/core/helpers';
import { UserSelectors } from '@osf/core/store/user';
import {
  LoadingSpinnerComponent,
  SearchInputComponent,
  SelectComponent,
  SubHeaderComponent,
} from '@osf/shared/components';
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
    AutoCompleteModule,
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
  protected readonly tabOptions = ADDON_TAB_OPTIONS;
  protected readonly categoryOptions = ADDON_CATEGORY_OPTIONS;
  protected AddonTabValue = AddonTabValue;
  protected defaultTabValue = AddonTabValue.ALL_ADDONS;
  protected searchControl = new FormControl<string>('');
  protected searchValue = signal<string>('');
  protected selectedCategory = signal<string>(AddonCategory.EXTERNAL_STORAGE_SERVICES);
  protected selectedTab = signal<number>(this.defaultTabValue);

  protected currentUser = select(UserSelectors.getCurrentUser);
  protected addonsUserReference = select(AddonsSelectors.getAddonsUserReference);
  protected storageAddons = select(AddonsSelectors.getStorageAddons);
  protected citationAddons = select(AddonsSelectors.getCitationAddons);
  protected authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  protected authorizedCitationAddons = select(AddonsSelectors.getAuthorizedCitationAddons);

  protected isCurrentUserLoading = select(UserSelectors.getCurrentUserLoading);
  protected isUserReferenceLoading = select(AddonsSelectors.getAddonsUserReferenceLoading);
  protected isStorageAddonsLoading = select(AddonsSelectors.getStorageAddonsLoading);
  protected isCitationAddonsLoading = select(AddonsSelectors.getCitationAddonsLoading);
  protected isAuthorizedStorageAddonsLoading = select(AddonsSelectors.getAuthorizedStorageAddonsLoading);
  protected isAuthorizedCitationAddonsLoading = select(AddonsSelectors.getAuthorizedCitationAddonsLoading);

  protected isAddonsLoading = computed(() => {
    return (
      this.isStorageAddonsLoading() ||
      this.isCitationAddonsLoading() ||
      this.isUserReferenceLoading() ||
      this.isCurrentUserLoading()
    );
  });
  protected isAuthorizedAddonsLoading = computed(() => {
    return (
      this.isAuthorizedStorageAddonsLoading() ||
      this.isAuthorizedCitationAddonsLoading() ||
      this.isUserReferenceLoading() ||
      this.isCurrentUserLoading()
    );
  });

  protected actions = createDispatchMap({
    getStorageAddons: GetStorageAddons,
    getCitationAddons: GetCitationAddons,
    getAuthorizedStorageAddons: GetAuthorizedStorageAddons,
    getAuthorizedCitationAddons: GetAuthorizedCitationAddons,
    createAuthorizedAddon: CreateAuthorizedAddon,
    updateAuthorizedAddon: UpdateAuthorizedAddon,
    getAddonsUserReference: GetAddonsUserReference,
    deleteAuthorizedAddon: DeleteAuthorizedAddon,
  });

  protected readonly allAuthorizedAddons = computed(() => {
    const authorizedAddons = [...this.authorizedStorageAddons(), ...this.authorizedCitationAddons()];

    const searchValue = this.searchValue().toLowerCase();
    return authorizedAddons.filter((card) => card.displayName.includes(searchValue));
  });

  protected readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  protected readonly currentAction = computed(() =>
    this.selectedCategory() === AddonCategory.EXTERNAL_STORAGE_SERVICES
      ? this.actions.getStorageAddons
      : this.actions.getCitationAddons
  );

  protected readonly currentAddonsState = computed(() =>
    this.selectedCategory() === AddonCategory.EXTERNAL_STORAGE_SERVICES ? this.storageAddons() : this.citationAddons()
  );

  protected readonly filteredAddonCards = computed(() => {
    const searchValue = this.searchValue().toLowerCase();
    return this.currentAddonsState().filter((card) => card.externalServiceName.toLowerCase().includes(searchValue));
  });

  protected onCategoryChange(value: Primitive): void {
    if (typeof value === 'string') {
      this.selectedCategory.set(value);
    }
  }

  constructor() {
    effect(() => {
      if (this.currentUser()) {
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
