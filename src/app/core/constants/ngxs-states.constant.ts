import { ProviderState } from '@core/store/provider';
import { UserState } from '@core/store/user';
import { AuthState } from '@osf/features/auth/store';
import { MeetingsState } from '@osf/features/meetings/store';
import { ProjectMetadataState } from '@osf/features/project/metadata/store';
import { ProjectOverviewState } from '@osf/features/project/overview/store';
import { RegistrationsState } from '@osf/features/project/registrations/store';
import { AccountSettingsState } from '@osf/features/settings/account-settings/store/account-settings.state';
import { DeveloperAppsState } from '@osf/features/settings/developer-apps/store';
import { NotificationSubscriptionState } from '@osf/features/settings/notifications/store';
import { AddonsState, InstitutionsState, WikiState } from '@osf/shared/stores';
import { LicensesState } from '@shared/stores/licenses';
import { MyResourcesState } from '@shared/stores/my-resources';
import { RegionsState } from '@shared/stores/regions';

export const STATES = [
  AuthState,
  AddonsState,
  UserState,
  ProviderState,
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
