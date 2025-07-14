import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import {
  CollectionModerationSubmissionsComponent,
  ModeratorsListComponent,
  NotificationSettingsComponent,
  PreprintModerationSettingsComponent,
  RegistrySubmissionsComponent,
} from '@osf/features/moderation/components';
import { PREPRINT_MODERATION_TABS } from '@osf/features/moderation/constants';
import { PreprintModerationTab } from '@osf/features/moderation/enums';
import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/utils';

@Component({
  selector: 'osf-preprint-moderation',
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
    ModeratorsListComponent,
    CollectionModerationSubmissionsComponent,
    RegistrySubmissionsComponent,
    NotificationSettingsComponent,
    PreprintModerationSettingsComponent,
  ],
  templateUrl: './preprint-moderation.component.html',
  styleUrl: './preprint-moderation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintModerationComponent {
  readonly resourceType = ResourceType.Preprint;

  readonly tabOptions = PREPRINT_MODERATION_TABS;
  readonly tabs = PreprintModerationTab;
  readonly isMedium = toSignal(inject(IS_MEDIUM));

  selectedTab = this.tabs.Submissions;

  onTabChange(index: number): void {
    this.selectedTab = index;
  }
}
