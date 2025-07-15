import { MenuItem } from 'primeng/api';

export const MENU_ITEMS: MenuItem[] = [
  {
    routerLink: '/home',
    label: 'navigation.home',
    icon: 'osf-icon-home',
    routerLinkActiveOptions: { exact: false },
  },
  {
    routerLink: '/search',
    label: 'navigation.searchOsf',
    icon: 'osf-icon-search',
    routerLinkActiveOptions: { exact: false },
  },
  {
    id: 'my-projects',
    routerLink: '/my-projects',
    label: 'navigation.myProjects',
    icon: 'osf-icon-my-projects',
    routerLinkActiveOptions: { exact: true },
    styleClass: 'mt-5',
  },
  {
    id: 'registries',
    label: 'navigation.registries',
    icon: 'osf-icon-registries',
    routerLinkActiveOptions: { exact: true },
    items: [
      {
        routerLink: '/registries/overview',
        label: 'navigation.registriesSubRoutes.overview',
        routerLinkActiveOptions: { exact: true },
      },
      {
        routerLink: '/registries/my-registrations',
        label: 'navigation.registriesSubRoutes.myRegistrations',
        routerLinkActiveOptions: { exact: true },
      },
      {
        id: 'registry-details',
        routerLink: '/registry-overview',
        label: 'navigation.registriesSubRoutes.registryDetails',
        routerLinkActiveOptions: { exact: true },
      },
    ],
  },
  {
    label: 'navigation.preprints',
    icon: 'osf-icon-preprints',
    routerLinkActiveOptions: { exact: true },
    items: [
      {
        routerLink: '/preprints/overview',
        label: 'navigation.preprintsSubRoutes.overview',
        routerLinkActiveOptions: { exact: false },
      },
      {
        routerLink: 'preprints/my-preprints',
        label: 'navigation.preprintsSubRoutes.myPreprints',
        routerLinkActiveOptions: { exact: false },
      },
      {
        routerLink: '/preprints/my-reviewing',
        label: 'navigation.preprintsSubRoutes.myReviewing',
        routerLinkActiveOptions: { exact: true },
      },
    ],
  },
  {
    routerLink: '/my-profile',
    label: 'navigation.profile',
    icon: 'osf-icon-profile',
    routerLinkActiveOptions: { exact: false },
  },
  {
    routerLink: '/institutions',
    label: 'navigation.institutions',
    icon: 'osf-icon-institutions',
    routerLinkActiveOptions: { exact: false },
  },
  {
    routerLink: '/collections',
    label: 'navigation.collections',
    icon: 'osf-icon-collections',
    routerLinkActiveOptions: { exact: false },
  },
  {
    routerLink: '/meetings',
    label: 'navigation.meetings',
    icon: 'osf-icon-meetings',
    routerLinkActiveOptions: { exact: false },
  },
  {
    label: 'navigation.settings',
    icon: 'osf-icon-settings',
    routerLinkActiveOptions: { exact: true },
    styleClass: 'mt-5',
    items: [
      {
        routerLink: '/settings/profile-settings',
        label: 'navigation.profileSettings',
        routerLinkActiveOptions: { exact: true },
      },
      {
        routerLink: '/settings/account-settings',
        label: 'navigation.accountSettings',
        routerLinkActiveOptions: { exact: true },
      },
      {
        routerLink: '/settings/addons',
        label: 'navigation.configureAddonAccounts',
        routerLinkActiveOptions: { exact: false },
      },
      {
        routerLink: '/settings/notifications',
        label: 'navigation.notifications',
        routerLinkActiveOptions: { exact: true },
      },
      {
        routerLink: '/settings/developer-apps',
        label: 'navigation.developerApps',
        routerLinkActiveOptions: { exact: false },
      },
      {
        routerLink: '/settings/tokens',
        label: 'navigation.personalAccessTokens',
        routerLinkActiveOptions: { exact: false },
      },
    ],
  },
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
      { label: 'navigation.registration.contributors', routerLink: 'contributors' },
      { label: 'navigation.registration.links', routerLink: 'links' },
      { label: 'navigation.registration.analytics', routerLink: 'analytics' },
    ],
  },
];
