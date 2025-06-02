import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import {
  AddonsSelectors,
  GetAddonsUserReference,
  GetAuthorizedCitationAddons,
  GetAuthorizedStorageAddons,
  GetCitationAddons,
  GetStorageAddons,
} from '@osf/features/settings/addons/store';
import { SearchInputComponent, SubHeaderComponent } from '@shared/components';
import { AddonCardListComponent } from '@shared/components/addons';
import { IS_XSMALL } from '@shared/utils';

import { ADDON_CATEGORY_OPTIONS, ADDON_TAB_OPTIONS, AddonCategoryValue, AddonTabValue } from './addons.constants';

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
  ],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsComponent {
  protected readonly AddonTabValue = AddonTabValue;
  #store = inject(Store);
  protected readonly defaultTabValue = AddonTabValue.ALL_ADDONS;
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly searchValue = signal('');
  protected readonly selectedCategory = signal<string>(AddonCategoryValue.EXTERNAL_STORAGE_SERVICES);
  protected readonly selectedTab = signal<number>(this.defaultTabValue);
  protected readonly currentUser = select(UserSelectors.getCurrentUser);
  protected readonly addonsUserReference = select(AddonsSelectors.getAddonUserReference);
  protected readonly storageAddons = select(AddonsSelectors.getStorageAddons);
  protected readonly citationAddons = select(AddonsSelectors.getCitationAddons);
  protected readonly authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  protected readonly authorizedCitationAddons = this.#store.selectSignal(AddonsSelectors.getAuthorizedCitationAddons);
  protected readonly allAuthorizedAddons = computed(() => {
    const authorizedAddons = [...this.authorizedStorageAddons(), ...this.authorizedCitationAddons()];

    const searchValue = this.searchValue().toLowerCase();
    return authorizedAddons.filter((card) => card.displayName.includes(searchValue));
  });

  protected readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  protected readonly currentAction = computed(() =>
    this.selectedCategory() === AddonCategoryValue.EXTERNAL_STORAGE_SERVICES ? GetStorageAddons : GetCitationAddons
  );

  protected readonly currentAddonsState = computed(() =>
    this.selectedCategory() === AddonCategoryValue.EXTERNAL_STORAGE_SERVICES
      ? this.storageAddons()
      : this.citationAddons()
  );

  protected readonly filteredAddonCards = computed(() => {
    const searchValue = this.searchValue().toLowerCase();
    return this.currentAddonsState().filter((card) => card.externalServiceName.includes(searchValue));
  });

  protected readonly tabOptions = ADDON_TAB_OPTIONS;
  protected readonly categoryOptions = ADDON_CATEGORY_OPTIONS;

  protected onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
  }

  constructor() {
    effect(() => {
      // Only proceed if we have the current user
      if (this.currentUser()) {
        this.#store.dispatch(GetAddonsUserReference);
      }
    });

    effect(() => {
      // Only proceed if we have both current user and user reference
      if (this.currentUser() && this.userReferenceId()) {
        this.#loadAddonsIfNeeded(this.userReferenceId());
      }
    });
  }

  #loadAddonsIfNeeded(userReferenceId: string): void {
    const action = this.currentAction();
    const addons = this.currentAddonsState();

    if (!addons?.length) {
      this.#store.dispatch(action);
      this.#store.dispatch(new GetAuthorizedStorageAddons(userReferenceId));
      this.#store.dispatch(new GetAuthorizedCitationAddons(userReferenceId));
    }
  }
}
