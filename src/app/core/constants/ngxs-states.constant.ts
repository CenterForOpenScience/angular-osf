import { AuthState } from '@core/store/auth';
import { TokensState } from '@core/store/settings';
import { AddonsState } from '@core/store/settings/addons';
import { UserState } from '@core/store/user';
import { MyProjectsState } from '@core/store/my-projects';
import { SearchState } from '@osf/features/search/store';
import { InstitutionsState } from '@core/store/institutions';
import { ProfileSettingsState } from '@osf/features/settings/profile-settings/profile-settings.state';

export const STATES = [
  AuthState,
  TokensState,
  AddonsState,
  UserState,
  SearchState,
  MyProjectsState,
  InstitutionsState,
  ProfileSettingsState,
];
