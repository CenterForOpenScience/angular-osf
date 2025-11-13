import { TranslatePipe } from '@ngx-translate/core';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';

import { EducationComponent, EmploymentComponent, NameComponent, SocialComponent } from './components';
import { PROFILE_SETTINGS_TAB_OPTIONS } from './constants';
import { ProfileSettingsTabOption } from './enums';

@Component({
  selector: 'osf-profile-settings',
  imports: [
    SubHeaderComponent,
    TabList,
    Tabs,
    Tab,
    TabPanel,
    TabPanels,
    ReactiveFormsModule,
    FormsModule,
    EducationComponent,
    EmploymentComponent,
    NameComponent,
    SocialComponent,
    TranslatePipe,
    SelectComponent,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent {
  readonly isMedium = toSignal(inject(IS_MEDIUM));
  readonly tabOptions = PROFILE_SETTINGS_TAB_OPTIONS;
  readonly tabOption = ProfileSettingsTabOption;

  selectedTab = this.tabOption.Name;

  onTabChange(index: number): void {
    this.selectedTab = index;
  }
}
