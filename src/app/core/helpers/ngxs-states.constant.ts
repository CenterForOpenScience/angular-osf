import { AuthState } from '@core/store/auth';
import { TokensState } from '@core/store/settings';
import { AddonsState } from '@core/store/settings/addons';
import { UserState } from '@core/store/user';

export const STATES = [AuthState, TokensState, AddonsState, UserState];
