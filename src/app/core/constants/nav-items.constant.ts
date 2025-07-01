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
    path: '/registries',
    label: 'navigation.registries',
    icon: 'registries',
    isCollapsible: true,
    useExactMatch: false,
    items: [
      {
        path: '/registries',
        label: 'navigation.registriesSubRoutes.overview',
        useExactMatch: false,
      },
      {
        path: '/my-registrations',
        label: 'navigation.registriesSubRoutes.myRegistrations',
        useExactMatch: false,
      },
      {
        path: '/registry-overview',
        label: 'navigation.registriesSubRoutes.registryDetails',
        useExactMatch: false,
      },
    ],
  },
  {
    path: '/preprints',
    label: 'navigation.preprints',
    icon: 'preprints',
    isCollapsible: true,
    useExactMatch: false,
    items: [
      {
        path: '/preprints',
        label: 'navigation.preprintsSubRoutes.overview',
        useExactMatch: false,
      },
      {
        path: '/my-preprints',
        label: 'navigation.preprintsSubRoutes.myPreprints',
        useExactMatch: true,
      },
    ],
  },
  {
    path: '/my-profile',
    label: 'navigation.profile',
    icon: 'profile',
    useExactMatch: true,
  },
  {
    path: '/institutions',
    label: 'navigation.institutions',
    icon: 'institutions',
    useExactMatch: true,
  },

  {
    path: '/collections',
    label: 'navigation.collections',
    icon: 'collections',
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
        label: 'navigation.project.wiki',
        routerLink: 'wiki',
      },
      {
        label: 'navigation.project.registrations',
        routerLink: 'registrations',
      },
      { label: 'navigation.project.contributors', routerLink: 'contributors' },
      { label: 'navigation.project.analytics', routerLink: 'analytics' },
      {
        label: 'navigation.project.addons',
        routerLink: 'addons',
      },
      {
        label: 'navigation.project.settings',
        routerLink: 'settings',
      },
    ],
  },
];

export const REGISTRATION_MENU_ITEMS: MenuItem[] = [
  {
    label: 'navigation.registration.details',
    icon: 'osf-icon-my-projects',
    expanded: true,
    items: [
      { label: 'navigation.registration.overview', routerLink: 'overview' },
      { label: 'navigation.registration.metadata', routerLink: 'metadata' },
      { label: 'navigation.registration.files', routerLink: 'files' },
      { label: 'navigation.registration.resources', routerLink: 'resources' },
      { label: 'navigation.registration.wiki', routerLink: 'wiki' },
      { label: 'navigation.registration.components', routerLink: 'components' },
      { label: 'navigation.registration.links', routerLink: 'links' },
      { label: 'navigation.registration.analytics', routerLink: 'analytics' },
    ],
  },
];
