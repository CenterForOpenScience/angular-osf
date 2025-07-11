import { FormControl, FormGroup } from '@angular/forms';

export enum EmailPreferencesFormControls {
  SubscribeOsfGeneralEmail = 'subscribeOsfGeneralEmail',
  SubscribeOsfHelpEmail = 'subscribeOsfHelpEmail',
}

export type EmailPreferencesForm = FormGroup<{
  [EmailPreferencesFormControls.SubscribeOsfGeneralEmail]: FormControl<boolean>;
  [EmailPreferencesFormControls.SubscribeOsfHelpEmail]: FormControl<boolean>;
}>;
