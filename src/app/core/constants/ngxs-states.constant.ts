import { AuthState } from '@core/store/auth';
import { UserState } from '@core/store/user';
import { CollectionsState } from '@osf/features/collections/store';
import { MeetingsState } from '@osf/features/meetings/store';
import { MyProjectsState } from '@osf/features/my-projects/store';
import { ProjectMetadataState } from '@osf/features/project/metadata/store';
import { ProjectOverviewState } from '@osf/features/project/overview/store';
import { RegistrationsState } from '@osf/features/project/registrations/store';
import { WikiState } from '@osf/features/project/wiki/store/wiki.state';
import { AccountSettingsState } from '@osf/features/settings/account-settings/store/account-settings.state';
import { DeveloperAppsState } from '@osf/features/settings/developer-apps/store';
import { NotificationSubscriptionState } from '@osf/features/settings/notifications/store';
import { ProfileSettingsState } from '@osf/features/settings/profile-settings/store/profile-settings.state';
import { AddonsState, InstitutionsState } from '@shared/stores';
import { LicensesState } from '@shared/stores/licenses';
import { RegionsState } from '@shared/stores/regions';

export const STATES = [
  AuthState,
  AddonsState,
  UserState,
  MyProjectsState,
  InstitutionsState,
  ProfileSettingsState,
  DeveloperAppsState,
  AccountSettingsState,
  NotificationSubscriptionState,
  ProjectOverviewState,
  CollectionsState,
  WikiState,
  MeetingsState,
  RegistrationsState,
  ProjectMetadataState,
  LicensesState,
  RegionsState,
];
