import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@osf/shared/utils/breakpoints.tokens';
import { TabOption } from '@osf/shared/entities/tab-option.interface';
import { Select } from 'primeng/select';
import { EducationComponent } from '@osf/features/settings/profile-settings/education/education.component';
import { EmploymentComponent } from '@osf/features/settings/profile-settings/employment/employment.component';
import { NameComponent } from '@osf/features/settings/profile-settings/name/name.component';
import { SocialComponent } from '@osf/features/settings/profile-settings/social/social.component';

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
