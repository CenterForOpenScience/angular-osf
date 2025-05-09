import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
  effect,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AddonCardListComponent } from '@osf/features/settings/addons/addon-card-list/addon-card-list.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { TranslatePipe } from '@ngx-translate/core';
import {
  GetStorageAddons,
  GetCitationAddons,
  AddonsSelectors,
  GetAuthorizedStorageAddons,
  GetAuthorizedCitationAddons,
  GetAddonsUserReference,
} from '@osf/features/settings/addons/store';
import { SelectOption } from '@shared/entities/select-option.interface';
import { UserSelectors } from '@core/store/user/user.selectors';

@Component({
  selector: 'osf-addons',
  standalone: true,
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
    SelectModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsComponent {
  #store = inject(Store);
  protected readonly defaultTabValue = 0;
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly searchValue = signal('');
  protected readonly selectedCategory = signal<string>(
    'external-storage-services',
  );
  protected readonly selectedTab = signal<number>(this.defaultTabValue);
  protected readonly currentUser = this.#store.selectSignal(
    UserSelectors.getCurrentUser,
  );
  protected readonly addonsUserReference = this.#store.selectSignal(
    AddonsSelectors.getAddonUserReference,
  );
  protected readonly storageAddons = this.#store.selectSignal(
    AddonsSelectors.getStorageAddons,
  );
  protected readonly citationAddons = this.#store.selectSignal(
    AddonsSelectors.getCitationAddons,
  );
  protected readonly authorizedStorageAddons = this.#store.selectSignal(
    AddonsSelectors.getAuthorizedStorageAddons,
  );
  protected readonly authorizedCitationAddons = this.#store.selectSignal(
    AddonsSelectors.getAuthorizedCitationAddons,
  );
  protected readonly allAuthorizedAddons = computed(() => {
    const authorizedAddons = [
      ...this.authorizedStorageAddons(),
      ...this.authorizedCitationAddons(),
    ];

    const searchValue = this.searchValue().toLowerCase();
    return authorizedAddons.filter((card) =>
      card.displayName.includes(searchValue),
    );
  });

  protected readonly userReferenceId = computed(() => {
    return this.addonsUserReference()[0]?.id;
  });

  protected readonly currentAction = computed(() =>
    this.selectedCategory() === 'external-storage-services'
      ? GetStorageAddons
      : GetCitationAddons,
  );

  protected readonly currentAddonsState = computed(() =>
    this.selectedCategory() === 'external-storage-services'
      ? this.storageAddons()
      : this.citationAddons(),
  );

  protected readonly filteredAddonCards = computed(() => {
    const searchValue = this.searchValue().toLowerCase();
    return this.currentAddonsState().filter((card) =>
      card.externalServiceName.includes(searchValue),
    );
  });

  protected readonly tabOptions: SelectOption[] = [
    {
      label: 'settings.addons.tabs.allAddons',
      value: 0,
    },
    {
      label: 'settings.addons.tabs.connectedAddons',
      value: 1,
    },
  ];

  protected readonly categoryOptions: SelectOption[] = [
    {
      label: 'settings.addons.categories.additionalService',
      value: 'external-storage-services',
    },
    {
      label: 'settings.addons.categories.citationManager',
      value: 'external-citation-services',
    },
  ];

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
