import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { Funder } from './metadata.model';

export interface FundingEntryForm {
  funderName: FormControl<string>;
  funderIdentifier: FormControl<string>;
  funderIdentifierType: FormControl<string>;
  awardTitle: FormControl<string>;
  awardUri: FormControl<string>;
  awardNumber: FormControl<string>;
}

export interface FundingForm {
  fundingEntries: FormArray<FormGroup<FundingEntryForm>>;
}

export interface FunderOption {
  label: string;
  value: string;
  id: string;
  uri: string;
}

export interface FundingDialogResult {
  fundingEntries: Funder[];
  resourceId?: string;
}

export interface SupplementData extends Partial<Funder> {
  title?: string;
  url?: string;
}
