import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/utils';

import {
  CollectionModerationSubmissionsComponent,
  ModeratorsListComponent,
  RegistrySettingsComponent,
  RegistrySubmissionsComponent,
} from '../../components';
import { REGISTRY_MODERATION_TABS } from '../../constants';
import { RegistryModerationTab } from '../../enums';

@Component({
  selector: 'osf-registries-moderation',
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
    RegistrySettingsComponent,
  ],
  templateUrl: './registries-moderation.component.html',
  styleUrl: './registries-moderation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesModerationComponent {
  readonly resourceType = ResourceType.Registration;

  readonly tabOptions = REGISTRY_MODERATION_TABS;
  readonly tabs = RegistryModerationTab;
  readonly isMedium = toSignal(inject(IS_MEDIUM));

  selectedTab = this.tabs.Submitted;

  onTabChange(index: number): void {
    this.selectedTab = index;
  }
}
