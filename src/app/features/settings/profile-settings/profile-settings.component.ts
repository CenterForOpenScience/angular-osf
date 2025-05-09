import { TranslatePipe } from '@ngx-translate/core';

import { DropdownModule } from 'primeng/dropdown';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EducationComponent } from '@osf/features/settings/profile-settings/education/education.component';
import { EmploymentComponent } from '@osf/features/settings/profile-settings/employment/employment.component';
import { NameComponent } from '@osf/features/settings/profile-settings/name/name.component';
import { SocialComponent } from '@osf/features/settings/profile-settings/social/social.component';
import { TabOption } from '@osf/shared/entities/tab-option.interface';
import { IS_XSMALL } from '@osf/shared/utils/breakpoints.tokens';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

@Component({
  selector: 'osf-profile-settings',
  imports: [
    SubHeaderComponent,
    TabList,
    Tabs,
    Tab,
    TabPanel,
    TabPanels,
    DropdownModule,
    ReactiveFormsModule,
    Select,
    FormsModule,
    EducationComponent,
    EmploymentComponent,
    NameComponent,
    SocialComponent,
    TranslatePipe,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent {
  protected defaultTabValue = 0;
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly tabOptions: TabOption[] = [
    { label: 'Name', value: 0 },
    { label: 'Social', value: 1 },
    { label: 'Employment', value: 2 },
    { label: 'Education', value: 3 },
  ];
  protected selectedTab = this.defaultTabValue;

  onTabChange(index: number): void {
    this.selectedTab = index;
  }
}
