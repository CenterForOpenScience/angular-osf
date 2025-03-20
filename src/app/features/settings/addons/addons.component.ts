import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  OnInit,
  untracked,
  inject,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AddonCardListComponent } from '@osf/features/settings/addons/addon-card-list/addon-card-list.component';
import { AddonCard } from '@shared/entities/addon-card.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

interface TabOption {
  label: string;
  value: number;
}

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
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsComponent implements OnInit {
  defaultTabValue = 0;
  isMobile = toSignal(inject(IS_XSMALL));
  searchValue = signal('');
  cards = signal<AddonCard[]>([]);
  selectedTab = this.defaultTabValue;

  tabOptions: TabOption[] = [
    { label: 'All Add-ons', value: 0 },
    { label: 'Connected Add-ons', value: 1 },
  ];

  filteredCards = computed((): AddonCard[] => {
    const searchValue = this.searchValue();

    return untracked(() =>
      this.cards().filter((card) =>
        card.title.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    );
  });

  ngOnInit(): void {
    this.cards.set([
      {
        title: 'Bitbucket',
        img: 'bitbucket',
      },
      {
        title: 'Github',
        img: 'github',
      },
      {
        title: 'Dropbox',
        img: 'dropbox',
      },
      {
        title: 'Figshare',
        img: 'figshare',
      },
      {
        title: 'OneDrive',
        img: 'onedrive',
      },
      {
        title: 'S3',
        img: 's3',
      },
      {
        title: 'OwnCloud',
        img: 'owncloud',
      },
    ]);
  }
}
