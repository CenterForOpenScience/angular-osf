import { FormArray, FormControl, FormGroup } from '@angular/forms';

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

export interface SupplementData {
  funderName?: string;
  funderIdentifier?: string;
  funderIdentifierType?: string;
  title?: string;
  awardTitle?: string;
  url?: string;
  awardUri?: string;
  awardNumber?: string;
}

export interface FundingDialogResult {
  fundingEntries: FundingEntryData[];
  projectId?: string;
}

export interface FundingEntryData {
  funderName: string;
  funderIdentifier: string;
  funderIdentifierType: string;
  awardTitle: string;
  awardUri: string;
  awardNumber: string;
}
