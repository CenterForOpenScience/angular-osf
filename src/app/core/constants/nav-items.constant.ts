import { MenuItem } from 'primeng/api';

import { NavItem } from '@osf/shared/models/nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  {
    path: '/home',
    label: 'navigation.home',
    icon: 'home',
    useExactMatch: true,
  },
  {
    path: '/search',
    label: 'navigation.searchOsf',
    icon: 'search',
    useExactMatch: true,
  },
  // [NS] TODO: Hidden until development
  // {
  //   path: '/support',
  //   label: 'navigation.support',
  //   icon: 'support',
  //   useExactMatch: true,
  // },
  {
    path: '/my-projects',
    label: 'navigation.myProjects',
    icon: 'my-projects',
    useExactMatch: true,
  },
  {
    path: '/my-profile',
    label: 'navigation.profile',
    icon: 'profile',
    useExactMatch: true,
  },
  {
    path: '/meetings',
    label: 'navigation.meetings',
    icon: 'meetings',
    useExactMatch: true,
  },
  {
    path: '/settings',
    label: 'navigation.settings',
    icon: 'settings',
    isCollapsible: true,
    useExactMatch: true,
    items: [
      {
        path: '/settings/profile-settings',
        label: 'navigation.profileSettings',
        useExactMatch: true,
      },
      {
        path: '/settings/account-settings',
        label: 'navigation.accountSettings',
        useExactMatch: true,
      },
      {
        path: '/settings/addons',
        label: 'navigation.configureAddonAccounts',
        useExactMatch: false,
      },
      {
        path: '/settings/notifications',
        label: 'navigation.notifications',
        useExactMatch: true,
      },
      {
        path: '/settings/developer-apps',
        label: 'navigation.developerApps',
        useExactMatch: true,
      },
      {
        path: '/settings/tokens',
        label: 'navigation.personalAccessTokens',
        useExactMatch: true,
      },
    ],
  },

  //[NS] TODO: Hidden until development
  // {
  //   path: '/donate',
  //   label: 'navigation.donate',
  //   icon: 'donate',
  //   useExactMatch: true,
  // },
];

export const PROJECT_MENU_ITEMS: MenuItem[] = [
  {
    label: 'navigation.project.details',
    icon: 'osf-icon-my-projects',
    expanded: true,
    items: [
      { label: 'navigation.project.overview', routerLink: 'overview' },
      { label: 'navigation.project.metadata', routerLink: 'metadata' },
      { label: 'navigation.project.files', routerLink: 'files' },
      {
        label: 'navigation.project.registrations',
        routerLink: 'registrations',
      },
      { label: 'navigation.project.contributors', routerLink: 'contributors' },
      { label: 'navigation.project.analytics', routerLink: 'analytics' },
      {
        label: 'navigation.project.settings',
        routerLink: 'settings',
      },
    ],
  },
];
