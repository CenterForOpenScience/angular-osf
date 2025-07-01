import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, HostListener, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { formInputLimits } from '@osf/features/preprints/constants';
import { MetadataForm, Preprint } from '@osf/features/preprints/models';
import {
  CreatePreprint,
  FetchLicenses,
  SaveLicense,
  SubmitPreprintSelectors,
  UpdatePreprint,
} from '@osf/features/preprints/store/submit-preprint';
import { IconComponent, LicenseComponent, TextInputComponent } from '@shared/components';
import { INPUT_VALIDATION_MESSAGES } from '@shared/constants';
import { License, LicenseOptions } from '@shared/models';
import { CustomValidators, findChangedFields } from '@shared/utils';

import { ContributorsComponent } from './contributors/contributors.component';

@Component({
  selector: 'osf-preprint-metadata',
  imports: [
    ContributorsComponent,
    Button,
    Card,
    ReactiveFormsModule,
    Message,
    TranslatePipe,
    DatePicker,
    IconComponent,
    InputText,
    TextInputComponent,
    Tooltip,
    LicenseComponent,
  ],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent implements OnInit {
  private actions = createDispatchMap({
    createPreprint: CreatePreprint,
    updatePreprint: UpdatePreprint,
    fetchLicenses: FetchLicenses,
    saveLicense: SaveLicense,
  });

  protected metadataForm!: FormGroup<MetadataForm>;
  protected inputLimits = formInputLimits;
  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  licences = select(SubmitPreprintSelectors.getLicenses);
  createdPreprint = select(SubmitPreprintSelectors.getCreatedPreprint);
  nextClicked = output<void>();

  ngOnInit() {
    this.actions.fetchLicenses();
    this.initForm();
  }

  initForm() {
    const publicationDate = this.createdPreprint()?.originalPublicationDate;
    this.metadataForm = new FormGroup<MetadataForm>({
      doi: new FormControl(this.createdPreprint()?.doi || '', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed(), Validators.pattern(this.inputLimits.doi.pattern)],
      }),
      originalPublicationDate: new FormControl(publicationDate ? new Date(publicationDate) : null, {
        nonNullable: false,
        validators: [],
      }),
      customPublicationCitation: new FormControl(this.createdPreprint()?.customPublicationCitation || null, {
        nonNullable: false,
        validators: [Validators.maxLength(this.inputLimits.citation.maxLength)],
      }),
    });
  }

  nextButtonClicked() {
    if (this.metadataForm.invalid) {
      return;
    }

    const model = this.metadataForm.value;

    const changedFields = findChangedFields<Preprint>(model, this.createdPreprint()!);

    this.actions.updatePreprint(this.createdPreprint()!.id, changedFields).subscribe({
      complete: () => {
        this.nextClicked.emit();
      },
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }

  createLicense(licenseDetails: { id: string; licenseOptions: LicenseOptions }) {
    this.actions.saveLicense(licenseDetails.id, licenseDetails.licenseOptions);
  }

  selectLicense(license: License) {
    this.actions.saveLicense(license.id);
  }
}
