import { DialogService } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { RegistrationCardComponent } from '@osf/features/project/registrations/registration-card/registration-card.component';
import { RegistrationCard } from '@osf/features/project/registrations/registration-card/registration-card.interface';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { TabOption } from '@shared/entities/tab-option.interface';
import { IS_MEDIUM, IS_WEB, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-registrations',
  imports: [
    RegistrationCardComponent,
    Select,
    SubHeaderComponent,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    FormsModule,
    Tabs,
  ],
  templateUrl: './registrations.component.html',
  styleUrl: './registrations.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationsComponent {
  protected readonly defaultTabValue = 0;
  protected readonly isDesktop = toSignal(inject(IS_WEB));
  protected readonly isTablet = toSignal(inject(IS_MEDIUM));
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly tabOptions: TabOption[] = [
    { label: 'Drafts', value: 0 },
    { label: 'Submitted', value: 1 },
  ];
  protected readonly selectedTab = signal<number>(this.defaultTabValue);
  draftRegistrations: RegistrationCard[] = [
    {
      title: 'Registration Name Example',
      template: 'Open-Ended Registration',
      registry: 'OSF Registries',
      registeredDate: '6 Feb, 2025 15:30 GMT-0500',
      lastUpdated: '13 Feb, 2025 12:13 GMT-0500',
      contributors: [
        { name: 'Michael Pasek', link: '#' },
        { name: 'Jeremy Ginges', link: '#' },
        { name: 'Crystal Shackleford', link: '#' },
        { name: 'ALLON VISHKIN', link: '#' },
      ],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      status: 'draft',
    },
    {
      title: 'Registration Name Example 2',
      template: 'Open-Ended Registration 2',
      registry: 'OSF Registries 2',
      registeredDate: '6 Feb, 2025 15:30 GMT-0500',
      lastUpdated: '13 Feb, 2025 12:13 GMT-0500',
      contributors: [
        { name: 'Michael Pasek', link: '#' },
        { name: 'Crystal Shackleford', link: '#' },
        { name: 'ALLON VISHKIN', link: '#' },
      ],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      status: 'draft',
    },
  ];

  submittedRegistrations: RegistrationCard[] = [
    {
      title: 'Registration 1',
      template: 'Open-Ended Registration',
      registry: 'OSF Registries',
      registeredDate: '16 Jan, 2022 15:30 GMT-0500',
      lastUpdated: '11 May, 2023 12:13 GMT-0500',
      contributors: [
        { name: 'Crystal Shackleford', link: '#' },
        { name: 'ALLON VISHKIN', link: '#' },
      ],
      description:
        'Lorem ipsum dolor sit amet elit, sed do eiusmod tempor incididunt. Lorem elit, sed do eiusmod tempor incididunt, consectetur adipiscing elit, sed do.',
      status: 'in_progress',
    },
    {
      title: 'Registration Name Example 2',
      template: 'Open-Ended Registration 2',
      registry: 'OSF Registries 2',
      registeredDate: '2 Jan, 2023 11:30 GMT-0500',
      lastUpdated: '4 Mar, 2024 12:55 GMT-0500',
      contributors: [
        { name: 'Crystal Shackleford', link: '#' },
        { name: 'Michael Pasek', link: '#' },
      ],
      description: 'Lorem consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      status: 'withdrawn',
    },
  ];
}
