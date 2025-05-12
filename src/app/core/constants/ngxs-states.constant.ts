import { AuthState } from '@core/store/auth';
import { UserState } from '@core/store/user';
import { InstitutionsState } from '@osf/features/institutions/store';
import { MyProjectsState } from '@osf/features/my-projects/store';
import { SearchState } from '@osf/features/search/store';
import { AddonsState } from '@osf/features/settings/addons/store';
import { DeveloperAppsState } from '@osf/features/settings/developer-apps/store';
import { ProfileSettingsState } from '@osf/features/settings/profile-settings/profile-settings.state';
import { TokensState } from '@osf/features/settings/tokens/store';

export const STATES = [
  AuthState,
  TokensState,
  AddonsState,
  UserState,
  SearchState,
  MyProjectsState,
  InstitutionsState,
  ProfileSettingsState,
  DeveloperAppsState,
];
