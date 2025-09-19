import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { FetchLicenses, RegistriesSelectors, SaveLicense } from '@osf/features/registries/store';
import { LicenseComponent } from '@osf/shared/components';
import { INPUT_VALIDATION_MESSAGES, InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/helpers';
import { LicenseModel, LicenseOptions } from '@osf/shared/models';

@Component({
  selector: 'osf-registries-license',
  imports: [FormsModule, ReactiveFormsModule, LicenseComponent, Card, TranslatePipe, Message],
  templateUrl: './registries-license.component.html',
  styleUrl: './registries-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesLicenseComponent {
  control = input.required<FormGroup>();

  private readonly route = inject(ActivatedRoute);
  private readonly environment = inject(ENVIRONMENT);
  private readonly draftId = this.route.snapshot.params['id'];
  private readonly fb = inject(FormBuilder);

  actions = createDispatchMap({ fetchLicenses: FetchLicenses, saveLicense: SaveLicense });
  licenses = select(RegistriesSelectors.getLicenses);
  inputLimits = InputLimits;

  selectedLicense = select(RegistriesSelectors.getSelectedLicense);
  draftRegistration = select(RegistriesSelectors.getDraftRegistration);

  currentYear = new Date();
  licenseYear = this.currentYear;
  licenseForm = this.fb.group({
    year: [this.currentYear.getFullYear().toString(), CustomValidators.requiredTrimmed()],
    copyrightHolders: ['', CustomValidators.requiredTrimmed()],
  });

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  private isLoaded = false;

  constructor() {
    effect(() => {
      if (this.draftRegistration() && !this.isLoaded) {
        this.actions.fetchLicenses(this.draftRegistration()?.providerId ?? this.environment.defaultProvider);
        this.isLoaded = true;
      }
    });

    effect(() => {
      const selectedLicense = this.selectedLicense();
      if (selectedLicense) {
        this.control().patchValue({
          id: selectedLicense.id,
          // [NM] TODO: Add validation for license options
        });
      }
    });
  }

  createLicense(licenseDetails: { id: string; licenseOptions: LicenseOptions }) {
    this.actions.saveLicense(this.draftId, licenseDetails.id, licenseDetails.licenseOptions);
  }

  selectLicense(license: LicenseModel) {
    if (license.requiredFields.length) {
      return;
    }
    this.control().patchValue({
      id: license.id,
    });
    this.control().markAsTouched();
    this.control().updateValueAndValidity();
    this.actions.saveLicense(this.draftId, license.id);
  }

  onFocusOut() {
    if (this.control()) {
      this.control().markAsTouched();
      this.control().markAsDirty();
      this.control().updateValueAndValidity();
    }
  }
}
