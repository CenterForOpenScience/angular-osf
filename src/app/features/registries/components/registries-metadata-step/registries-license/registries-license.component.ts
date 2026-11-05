import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FetchLicenses, RegistriesSelectors, SaveLicense } from '@osf/features/registries/store';
import { LicenseComponent } from '@osf/shared/components/license/license.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { LicenseDetails, LicenseModel } from '@shared/models/license/license.model';

@Component({
  selector: 'osf-registries-license',
  imports: [ReactiveFormsModule, LicenseComponent, Card, TranslatePipe, Message],
  templateUrl: './registries-license.component.html',
  styleUrl: './registries-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesLicenseComponent {
  readonly control = input.required<FormGroup>();
  readonly draftId = input.required<string>();
  readonly licensesUrl = input<string>();

  readonly actions = createDispatchMap({ fetchLicenses: FetchLicenses, saveLicense: SaveLicense });

  readonly licenses = select(RegistriesSelectors.getLicenses);
  readonly selectedLicense = select(RegistriesSelectors.getSelectedLicense);
  readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  constructor() {
    effect(() => {
      const licensesUrl = this.licensesUrl();

      if (licensesUrl) {
        this.actions.fetchLicenses(licensesUrl);
      }
    });

    effect(() => {
      const control = this.control();
      const licenses = this.licenses();
      const selectedLicense = this.selectedLicense();
      const defaultLicenseId = this.draftRegistration()?.defaultLicenseId;

      if (selectedLicense && licenses.some((l) => l.id === selectedLicense.id)) {
        control.patchValue({ id: selectedLicense.id });
        return;
      }

      this.applyDefaultLicense(control, licenses, defaultLicenseId);
    });
  }

  createLicense(licenseDetails: LicenseDetails) {
    this.actions.saveLicense(this.draftId(), licenseDetails.id, licenseDetails.licenseOptions);
  }

  selectLicense(license: LicenseModel) {
    if (license.requiredFields.length) {
      return;
    }

    const control = this.control();
    control.patchValue({ id: license.id });
    control.markAsTouched();
    control.updateValueAndValidity();
    this.actions.saveLicense(this.draftId(), license.id);
  }

  onFocusOut() {
    const control = this.control();
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
  }

  private applyDefaultLicense(control: FormGroup, licenses: LicenseModel[], defaultLicenseId?: string) {
    if (!licenses.length || !defaultLicenseId) {
      return;
    }

    const defaultLicense = licenses.find((license) => license.id === defaultLicenseId);
    if (!defaultLicense) {
      return;
    }

    control.patchValue({ id: defaultLicense.id });
    control.markAsTouched();
    control.updateValueAndValidity();

    if (!defaultLicense.requiredFields.length) {
      this.actions.saveLicense(this.draftId(), defaultLicense.id);
    }
  }
}
