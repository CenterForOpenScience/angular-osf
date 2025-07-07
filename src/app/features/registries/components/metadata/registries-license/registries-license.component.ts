import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FetchLicenses, RegistriesSelectors, SaveLicense } from '@osf/features/registries/store';
import { LicenseComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { License, LicenseOptions } from '@osf/shared/models';
import { CustomValidators } from '@osf/shared/utils';

@Component({
  selector: 'osf-registries-license',
  imports: [FormsModule, ReactiveFormsModule, LicenseComponent],
  templateUrl: './registries-license.component.html',
  styleUrl: './registries-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesLicenseComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly draftId = this.route.snapshot.params['id'];
  private readonly fb = inject(FormBuilder);

  protected actions = createDispatchMap({ fetchLicenses: FetchLicenses, saveLicense: SaveLicense });
  protected licenses = select(RegistriesSelectors.getLicenses);
  protected inputLimits = InputLimits;

  selectedLicense = select(RegistriesSelectors.getSelectedLicense);
  currentYear = new Date();
  licenseYear = this.currentYear;
  licenseForm = this.fb.group({
    year: [this.currentYear.getFullYear().toString(), CustomValidators.requiredTrimmed()],
    copyrightHolders: ['', CustomValidators.requiredTrimmed()],
  });

  constructor() {
    this.actions.fetchLicenses();
  }

  createLicense(licenseDetails: { id: string; licenseOptions: LicenseOptions }) {
    this.actions.saveLicense(this.draftId, licenseDetails.id, licenseDetails.licenseOptions);
  }

  selectLicense(license: License) {
    this.actions.saveLicense(this.draftId, license.id);
  }
}
