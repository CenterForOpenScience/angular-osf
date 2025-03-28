import { FormControl, FormGroup } from '@angular/forms';

export interface PersonalAccessToken {
  id: string;
  tokenName: string;
  scopes: string[];
}

export enum TokenFormControls {
  TokenName = 'tokenName',
  Scopes = 'scopes',
}

export type TokenForm = FormGroup<{
  [TokenFormControls.TokenName]: FormControl<string>;
  [TokenFormControls.Scopes]: FormControl<string[]>;
}>;

export const AVAILABLE_SCOPES = [
  {
    name: 'osf.full_read',
    description:
      'View all information associated with this account, including for private projects',
  },
  {
    name: 'osf.full_write',
    description:
      'View and edit all information associated with this account, including for private projects',
  },
  {
    name: 'osf.users.profile_read',
    description: 'Read your profile data',
  },
  {
    name: 'osf.users.email_read',
    description: 'Read your primary email address',
  },
];
