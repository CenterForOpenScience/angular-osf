import { AuthState } from '@core/store/auth';
import { UserState } from '@core/store/user';
import { MeetingsState } from '@osf/features/meetings/store';
import { ProjectMetadataState } from '@osf/features/project/metadata/store';
import { ProjectOverviewState } from '@osf/features/project/overview/store';
import { RegistrationsState } from '@osf/features/project/registrations/store';
import { AccountSettingsState } from '@osf/features/settings/account-settings/store/account-settings.state';
import { DeveloperAppsState } from '@osf/features/settings/developer-apps/store';
import { NotificationSubscriptionState } from '@osf/features/settings/notifications/store';
import { AddonsState, InstitutionsState, WikiState } from '@shared/stores';
import { LicensesState } from '@shared/stores/licenses';
import { RegionsState } from '@shared/stores/regions';

import { MyResourcesState } from 'src/app/shared/stores/my-resources';

export const STATES = [
  AuthState,
  AddonsState,
  UserState,
  MyResourcesState,
  InstitutionsState,
  DeveloperAppsState,
  AccountSettingsState,
  NotificationSubscriptionState,
  ProjectOverviewState,
  WikiState,
  MeetingsState,
  RegistrationsState,
  ProjectMetadataState,
  LicensesState,
  RegionsState,
];
