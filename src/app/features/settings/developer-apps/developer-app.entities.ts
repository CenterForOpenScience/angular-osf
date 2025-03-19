import { FormControl, FormGroup } from '@angular/forms';
import { StringOrNull } from '@core/helpers/types.helper';

export interface DeveloperApp {
  id: string;
  appName: string;
  projHomePageUrl: string;
  appDescription: StringOrNull;
  authorizationCallbackUrl: string;
}

export enum DeveloperAppFormFormControls {
  AppName = 'appName',
  ProjectHomePageUrl = 'projHomePageUrl',
  AppDescription = 'appDescription',
  AuthorizationCallbackUrl = 'authorizationCallbackUrl',
}

export type DeveloperAppForm = FormGroup<{
  [DeveloperAppFormFormControls.AppName]: FormControl<string>;
  [DeveloperAppFormFormControls.ProjectHomePageUrl]: FormControl<string>;
  [DeveloperAppFormFormControls.AppDescription]: FormControl<StringOrNull>;
  [DeveloperAppFormFormControls.AuthorizationCallbackUrl]: FormControl<string>;
}>;
