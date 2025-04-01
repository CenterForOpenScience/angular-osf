import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  OnInit,
  inject,
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
import { AddonsState, GetAddons } from '@core/store/settings/addons';

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
export class AddonsComponent implements OnInit {
  #store = inject(Store);
  protected readonly defaultTabValue = 0;
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly searchValue = signal('');
  protected readonly cards = this.#store.selectSignal(AddonsState.getAddons);
  protected readonly tabOptions: SelectOption[] = [
    { label: 'All Add-ons', value: 0 },
    { label: 'Connected Add-ons', value: 1 },
  ];
  protected readonly categoryOptions: SelectOption[] = [
    { label: 'Additional Storage', value: 'storage' },
    { label: 'Citation Manager', value: 'citations' },
  ];
  protected selectedTab = this.defaultTabValue;
  protected selectedCategory = signal<string>('storage');
  protected readonly filteredCards = computed(() => {
    const searchValue = this.searchValue().toLowerCase();
    const selectedCategory = this.selectedCategory();

    return this.cards().filter(
      (card) =>
        card.attributes.name.toLowerCase().includes(searchValue) &&
        (!selectedCategory ||
          card.attributes.categories.includes(selectedCategory)),
    );
  });

  ngOnInit(): void {
    this.#store.dispatch(GetAddons);
  }
}
