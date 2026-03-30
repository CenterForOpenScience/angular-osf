import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { FetchLicenses, RegistriesSelectors, SaveLicense } from '@osf/features/registries/store';
import { LicenseComponent } from '@osf/shared/components/license/license.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { LicenseModel, LicenseOptions } from '@shared/models/license/license.model';

@Component({
  selector: 'osf-registries-license',
  imports: [ReactiveFormsModule, LicenseComponent, Card, TranslatePipe, Message],
  templateUrl: './registries-license.component.html',
  styleUrl: './registries-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesLicenseComponent {
  control = input.required<FormGroup>();
  draftId = input.required<string>();

  private readonly environment = inject(ENVIRONMENT);

  actions = createDispatchMap({ fetchLicenses: FetchLicenses, saveLicense: SaveLicense });

  licenses = select(RegistriesSelectors.getLicenses);
  selectedLicense = select(RegistriesSelectors.getSelectedLicense);
  draftRegistration = select(RegistriesSelectors.getDraftRegistration);

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  private readonly licensesLoaded = signal(false);

  constructor() {
    effect(() => {
      if (this.draftRegistration() && !this.licensesLoaded()) {
        this.actions.fetchLicenses(this.draftRegistration()?.providerId ?? this.environment.defaultProvider);
        this.licensesLoaded.set(true);
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

  createLicense(licenseDetails: { id: string; licenseOptions: LicenseOptions }) {
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
