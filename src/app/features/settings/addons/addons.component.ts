import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  OnInit,
  untracked,
} from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AddonCardListComponent } from '@osf/features/settings/addons/addon-card-list/addon-card-list.component';
import { AddonCard } from '@shared/entities/addon-card.interface';

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
  ],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsComponent implements OnInit {
  defaultTabValue = 0;
  searchValue = signal('');
  cards = signal<AddonCard[]>([]);
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
