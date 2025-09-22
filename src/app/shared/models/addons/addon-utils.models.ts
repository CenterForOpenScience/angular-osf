import { FormControl } from '@angular/forms';

import { AddonFormControls, OperationNames } from '@shared/enums';
import { AuthorizedAccountModel } from '@shared/models';

export interface AddonForm {
  [AddonFormControls.AccessKey]?: FormControl<string | null>;
  [AddonFormControls.SecretKey]?: FormControl<string | null>;
  [AddonFormControls.HostUrl]?: FormControl<string | null>;
  [AddonFormControls.Username]?: FormControl<string | null>;
  [AddonFormControls.Password]?: FormControl<string | null>;
  [AddonFormControls.PersonalAccessToken]?: FormControl<string | null>;
  [AddonFormControls.AccountName]: FormControl<string | null>;
  [AddonFormControls.ApiToken]?: FormControl<string | null>;
}

export interface AddonTerm {
  function: string;
  status: string;
  type: 'info' | 'danger' | 'warning';
}

export interface Term {
  label: string;
  supportedFeature: string;
  storage: {
    true: string;
    false: string;
  };
  citation?: {
    partial?: string;
    false?: string;
  };
}

export interface OAuthCallbacks {
  onSuccess: (addon: AuthorizedAccountModel) => void;
  onError?: () => void;
  onCleanup?: () => void;
}

export interface OperationInvokeData {
  operationName: OperationNames;
  itemId: string;
}
