import { RegistrationModel, RegistrationStatus } from './models';

export const draftRegistrations: unknown = [
  {
    title: 'Registration Name Example',
    template: 'Open-Ended Registration',
    registry: 'OSF Registries',
    registeredDate: '6 Feb, 2025 15:30 GMT-0500',
    lastUpdated: '13 Feb, 2025 12:13 GMT-0500',
    contributors: [
      { name: 'Michael Pasek', link: '' },
      { name: 'Jeremy Ginges', link: '' },
      { name: 'Crystal Shackleford', link: '' },
      { name: 'ALLON VISHKIN', link: '' },
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
      { name: 'Michael Pasek', link: '' },
      { name: 'Crystal Shackleford', link: '' },
      { name: 'ALLON VISHKIN', link: '' },
    ],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
    status: 'draft',
  },
];

export const submittedRegistrations: RegistrationModel[] = [
  {
    id: '1',
    type: 'registration',
    withdrawn: false,
    title: 'Registration 1',
    registrationSupplement: 'Open-Ended Registration',
    registry: 'OSF Registries',
    dateRegistered: '16 Jan, 2022 15:30 GMT-0500',
    dateModified: '11 May, 2023 12:13 GMT-0500',
    contributors: [
      { name: 'Crystal Shackleford', link: '' },
      { name: 'ALLON VISHKIN', link: '' },
    ],
    description:
      'Lorem ipsum dolor sit amet elit, sed do eiusmod tempor incididunt. Lorem elit, sed do eiusmod tempor incididunt, consectetur adipiscing elit, sed do.',
    status: RegistrationStatus.IN_PROGRESS,
  },
  {
    id: '2',
    type: 'registration',
    withdrawn: true,
    title: 'Registration Name Example 2',
    registrationSupplement: 'Open-Ended Registration 2',
    registry: 'OSF Registries 2',
    dateRegistered: '2 Jan, 2023 11:30 GMT-0500',
    dateModified: '4 Mar, 2024 12:55 GMT-0500',
    contributors: [
      { name: 'Crystal Shackleford', link: '' },
      { name: 'Michael Pasek', link: '' },
    ],
    description: 'Lorem consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    status: RegistrationStatus.WITHDRAWN,
  },
];
