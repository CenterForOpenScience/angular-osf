import { FormControl, FormGroup } from '@angular/forms';

export enum TokenFormControls {
  TokenName = 'tokenName',
  Scopes = 'scopes',
}

export type TokenForm = FormGroup<{
  [TokenFormControls.TokenName]: FormControl<string>;
  [TokenFormControls.Scopes]: FormControl<string[]>;
}>;
