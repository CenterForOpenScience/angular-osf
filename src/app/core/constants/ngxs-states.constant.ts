import { AuthState } from '@core/store/auth';
import { UserState } from '@core/store/user';
import { CollectionsState } from '@osf/features/collections/store';
import { InstitutionsState } from '@osf/features/institutions/store';
import { MyProjectsState } from '@osf/features/my-projects/store';
import { AnalyticsState } from '@osf/features/project/analytics/store';
import { ProjectOverviewState } from '@osf/features/project/overview/store';
import { WikiState } from '@osf/features/project/wiki/store/wiki.state';
import { AccountSettingsState } from '@osf/features/settings/account-settings/store/account-settings.state';
import { AddonsState } from '@osf/features/settings/addons/store';
import { DeveloperAppsState } from '@osf/features/settings/developer-apps/store';
import { NotificationSubscriptionState } from '@osf/features/settings/notifications/store';
import { ProfileSettingsState } from '@osf/features/settings/profile-settings/profile-settings.state';
import { TokensState } from '@osf/features/settings/tokens/store';

export const STATES = [
  AuthState,
  TokensState,
  AddonsState,
  UserState,
  MyProjectsState,
  InstitutionsState,
  ProfileSettingsState,
  DeveloperAppsState,
  AccountSettingsState,
  AnalyticsState,
  NotificationSubscriptionState,
  ProjectOverviewState,
  CollectionsState,
  WikiState,
];
