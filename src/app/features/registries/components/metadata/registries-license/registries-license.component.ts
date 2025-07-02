import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { License } from '@osf/features/registries/models';
import { FetchLicenses, RegistriesSelectors } from '@osf/features/registries/store';
import { TextInputComponent, TruncatedTextComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { InterpolatePipe } from '@osf/shared/pipes';
import { CustomValidators } from '@osf/shared/utils';

@Component({
  selector: 'osf-registries-license',
  imports: [
    Card,
    TranslatePipe,
    Select,
    FormsModule,
    Divider,
    TruncatedTextComponent,
    DatePicker,
    TextInputComponent,
    InterpolatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './registries-license.component.html',
  styleUrl: './registries-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesLicenseComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly draftId = this.route.snapshot.params['id'];
  private readonly fb = inject(FormBuilder);

  protected actions = createDispatchMap({ fetchLicenses: FetchLicenses });
  protected licenses = select(RegistriesSelectors.getLicenses);
  protected inputLimits = InputLimits;

  selectedLicense: License | null = null;
  currentYear = new Date();
  licenseYear = this.currentYear;
  licenseForm = this.fb.group({
    year: [this.currentYear.getFullYear().toString(), CustomValidators.requiredTrimmed()],
    copyrightHolders: ['', CustomValidators.requiredTrimmed()],
  });

  constructor() {
    this.actions.fetchLicenses();
  }

  onSelectLicense(license: License): void {
    console.log('Selected License:', license);
  }
}
