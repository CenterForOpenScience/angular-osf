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
import {
  GetStorageAddons,
  GetCitationAddons,
  AddonsSelectors,
} from '@core/store/settings/addons';

import { SelectOption } from '@shared/entities/select-option.interface';

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

  protected readonly storageAddons = this.#store.selectSignal(
    AddonsSelectors.getStorageAddons,
  );
  protected readonly citationAddons = this.#store.selectSignal(
    AddonsSelectors.getCitationAddons,
  );

  protected readonly currentAddons = computed(() => {
    return this.selectedCategory() === 'external-storage-services'
      ? this.storageAddons()
      : this.citationAddons();
  });

  protected readonly filteredCards = computed(() => {
    const searchValue = this.searchValue().toLowerCase();
    return this.currentAddons().filter((card) =>
      card.externalServiceName.includes(searchValue),
    );
  });
  protected readonly tabOptions: SelectOption[] = [
    { label: 'All Add-ons', value: 0 },
    { label: 'Connected Add-ons', value: 1 },
  ];
  protected readonly categoryOptions: SelectOption[] = [
    { label: 'Additional Storage', value: 'external-storage-services' },
    { label: 'Citation Manager', value: 'external-citation-services' },
  ];
  protected selectedTab = this.defaultTabValue;

  protected onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
  }

  constructor() {
    effect(() => {
      const category = this.selectedCategory();

      this.#store.dispatch(
        category === 'external-storage-services'
          ? GetStorageAddons
          : GetCitationAddons,
      );
    });
  }
}
