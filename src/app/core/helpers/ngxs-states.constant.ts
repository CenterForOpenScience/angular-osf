import { AuthState } from '@core/store/auth';
import { TokensState } from '@core/store/settings';
import { AddonsState } from '@core/store/settings/addons';
import { UserState } from '@core/store/user';
import { HomeState } from '@core/store/home';

export const STATES = [
  AuthState,
  TokensState,
  AddonsState,
  UserState,
  HomeState,
];
