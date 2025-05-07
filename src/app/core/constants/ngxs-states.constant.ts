import { AuthState } from '@core/store/auth';
import { TokensState } from '@osf/features/settings/tokens/store';
import { AddonsState } from '@osf/features/settings/addons/store';
import { UserState } from '@core/store/user';
import { MyProjectsState } from '@osf/features/my-projects/store';
import { SearchState } from '@osf/features/search/store';
import { InstitutionsState } from '@osf/features/institutions/store';

export const STATES = [
  AuthState,
  TokensState,
  AddonsState,
  UserState,
  SearchState,
  MyProjectsState,
  InstitutionsState,
];
