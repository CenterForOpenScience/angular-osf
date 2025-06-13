import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { IS_MEDIUM } from '@osf/shared/utils';

import {
  CollectionModerationSettingsComponent,
  CollectionModerationSubmissionsComponent,
  CollectionModeratorsComponent,
} from '../../components';
import { COLLECTION_MODERATION_TABS } from '../../constants';
import { CollectionModerationTab } from '../../enums';

@Component({
  selector: 'osf-collection-moderation',
  imports: [
    SubHeaderComponent,
    TabList,
    Tabs,
    Tab,
    TabPanel,
    TabPanels,
    TranslatePipe,
    FormsModule,
    SelectComponent,
    CollectionModerationSettingsComponent,
    CollectionModeratorsComponent,
    CollectionModerationSubmissionsComponent,
  ],
  templateUrl: './collection-moderation.component.html',
  styleUrl: './collection-moderation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionModerationComponent {
  readonly tabOptions = COLLECTION_MODERATION_TABS;
  readonly tabs = CollectionModerationTab;
  readonly isMedium = toSignal(inject(IS_MEDIUM));

  selectedTab = this.tabs.AllItems;

  onTabChange(index: number): void {
    this.selectedTab = index;
  }
}
