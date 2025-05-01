import { AuthState } from '@core/store/auth';
import { TokensState } from '@core/store/settings';
import { AddonsState } from '@core/store/settings/addons';
import { UserState } from '@core/store/user';
import { HomeState } from '@osf/features/home/store';
import { MyProjectsState } from '@core/store/my-projects';
import { SearchState } from '@osf/features/search/store';

export const STATES = [
  AuthState,
  TokensState,
  AddonsState,
  UserState,
  HomeState,
  SearchState,
  MyProjectsState,
];
