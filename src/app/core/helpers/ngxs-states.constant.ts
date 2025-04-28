import { AuthState } from '@core/store/auth';
import { TokensState } from '@core/store/settings';
import { AddonsState } from '@core/store/settings/addons';
import { UserState } from '@core/store/user';
import { HomeState } from 'src/app/features/home/store';
import { SearchState } from '@osf/features/search/store';

export const STATES = [
  AuthState,
  TokensState,
  AddonsState,
  UserState,
  HomeState,
  SearchState,
];
