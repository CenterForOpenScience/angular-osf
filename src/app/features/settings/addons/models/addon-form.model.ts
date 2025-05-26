import { FormControl } from '@angular/forms';

export enum AddonFormControls {
  AccessKey = 'accessKey',
  SecretKey = 'secretKey',
  HostUrl = 'hostUrl',
  Username = 'username',
  Password = 'password',
  PersonalAccessToken = 'personalAccessToken',
  AccountName = 'accountName',
}

export interface AddonForm {
  [AddonFormControls.AccessKey]?: FormControl<string | null>;
  [AddonFormControls.SecretKey]?: FormControl<string | null>;
  [AddonFormControls.HostUrl]?: FormControl<string | null>;
  [AddonFormControls.Username]?: FormControl<string | null>;
  [AddonFormControls.Password]?: FormControl<string | null>;
  [AddonFormControls.PersonalAccessToken]?: FormControl<string | null>;
  [AddonFormControls.AccountName]: FormControl<string | null>;
}
