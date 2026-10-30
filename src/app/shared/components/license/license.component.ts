import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';

import { map, merge, startWith } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal, untracked } from '@angular/core';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';
import { StringOrNullOrUndefined } from '@osf/shared/helpers/types.helper';
import { LicenseDetails, LicenseModel, LicenseOptions, LicenseState } from '@osf/shared/models/license/license.model';
import { LicenseForm } from '@osf/shared/models/license/license-form.model';
import { InterpolatePipe } from '@osf/shared/pipes/interpolate.pipe';

import { TextInputComponent } from '../text-input/text-input.component';
import { TruncatedTextComponent } from '../truncated-text/truncated-text.component';

@Component({
  selector: 'osf-license',
  imports: [
    TranslatePipe,
    Select,
    FormsModule,
    Divider,
    DatePicker,
    TextInputComponent,
    ReactiveFormsModule,
    Button,
    TruncatedTextComponent,
    InterpolatePipe,
    Message,
  ],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseComponent {
  readonly selectedLicenseId = input<StringOrNullOrUndefined>(null);
  readonly selectedLicenseOptions = input<LicenseOptions | null | undefined>(null);
  readonly licenses = input.required<LicenseModel[]>();
  readonly showInternalButtons = input<boolean>(true);
  readonly appendTo = input<string | null>(null);
  readonly createLicense = output<LicenseDetails>();
  readonly selectLicense = output<LicenseModel>();

  readonly inputLimits = InputLimits;
  readonly requiredMessage = INPUT_VALIDATION_MESSAGES.required;
  readonly today = new Date();
  readonly yearInputId = `license-year-${Math.random().toString(36).substring(2, 15)}`;

  private readonly pendingLicense = signal<LicenseModel | null>(null);
  private appliedOptions: LicenseOptions | null = null;

  readonly selectedLicense = computed(() => {
    const licenses = this.licenses();
    const pending = this.pendingLicense();

    if (pending) {
      return licenses.find((license) => license.id === pending.id) ?? pending;
    }

    return licenses.find((license) => license.id === this.selectedLicenseId()) ?? null;
  });

  readonly hasRequiredFields = computed(() => !!this.selectedLicense()?.requiredFields.length);

  readonly licenseForm = new FormGroup<LicenseForm>({
    year: new FormControl<string>(this.today.getFullYear().toString(), { nonNullable: true }),
    copyrightHolders: new FormControl<string>('', { nonNullable: true }),
  });

  readonly licenseFormValue = toSignal(this.licenseForm.valueChanges.pipe(map(() => this.licenseForm.getRawValue())), {
    initialValue: this.licenseForm.getRawValue(),
  });
  readonly licenseFormInvalid = toSignal(this.licenseForm.statusChanges.pipe(map((status) => status === 'INVALID')), {
    initialValue: this.licenseForm.invalid,
  });

  readonly licenseStateChange = outputFromObservable<LicenseState>(
    merge(this.licenseForm.valueChanges, this.licenseForm.statusChanges).pipe(
      startWith(null),
      map(() => ({
        licenseOptions: this.licenseForm.getRawValue(),
        formInvalid: this.licenseForm.invalid,
      }))
    )
  );

  readonly saveButtonDisabled = computed(() => {
    const baseline = this.selectedLicenseOptions();
    return this.hasRequiredFields() && !!baseline && this.isSameOptions(baseline, this.licenseFormValue());
  });

  constructor() {
    effect(() => {
      this.selectedLicenseId();
      untracked(() => this.pendingLicense.set(null));
    });

    effect(() => {
      const options = this.resolveLicenseOptions(this.selectedLicenseOptions());
      if (this.appliedOptions && this.isSameOptions(this.appliedOptions, options)) {
        return;
      }

      this.appliedOptions = options;
      untracked(() => this.licenseForm.patchValue(options));
    });

    effect(() => {
      const required = this.hasRequiredFields();

      untracked(() => {
        this.setRequired(this.licenseForm.controls.year, required);
        this.setRequired(this.licenseForm.controls.copyrightHolders, required);
      });
    });
  }

  onSelectLicense(license: LicenseModel): void {
    this.pendingLicense.set(license);
    this.selectLicense.emit(license);
  }

  saveLicense() {
    if (this.licenseForm.invalid) {
      return;
    }

    const selectedLicense = this.selectedLicense();
    if (!selectedLicense) {
      return;
    }

    this.createLicense.emit({
      id: selectedLicense.id,
      licenseOptions: this.licenseForm.getRawValue(),
    });
  }

  cancel() {
    this.licenseForm.reset(this.resolveLicenseOptions(this.selectedLicenseOptions()));
  }

  private setRequired(control: FormControl<string>, required: boolean): void {
    control.setValidators(required ? [CustomValidators.requiredTrimmed()] : null);
    control.updateValueAndValidity();
  }

  private isSameOptions(a: LicenseOptions, b: LicenseOptions): boolean {
    return a.year === b.year && a.copyrightHolders === b.copyrightHolders;
  }

  private resolveLicenseOptions(options: LicenseOptions | null | undefined): LicenseOptions {
    return {
      year: options?.year ?? this.today.getFullYear().toString(),
      copyrightHolders: options?.copyrightHolders ?? '',
    };
  }
}
