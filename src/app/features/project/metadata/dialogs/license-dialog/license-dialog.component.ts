import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProjectOverview } from '@osf/features/project/overview/models';
import { LoadingSpinnerComponent } from '@osf/shared/components';
import { License, SelectOption } from '@shared/models';
import { LicensesSelectors, LoadAllLicenses } from '@shared/stores/licenses';

interface LicenseForm {
  licenseName: FormControl<string>;
}

@Component({
  selector: 'osf-license-dialog',
  imports: [Button, Select, TranslatePipe, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './license-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseDialogComponent implements OnInit {
  protected dialogRef = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);

  licenseForm = new FormGroup<LicenseForm>({
    licenseName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected actions = createDispatchMap({
    loadLicenses: LoadAllLicenses,
  });

  licenses = select(LicensesSelectors.getLicenses);
  licensesLoading = select(LicensesSelectors.getLoading);

  selectedLicenseText = signal<string>('');
  licenseOptions: SelectOption[] = [];
  currentProject: ProjectOverview | null = null;

  constructor() {
    effect(() => {
      const currentLicenses = this.licenses();

      if (currentLicenses) {
        this.licenseOptions = currentLicenses.map((license: License) => ({
          label: license.attributes.name,
          value: license.id,
        }));
      }
    });
  }

  ngOnInit(): void {
    this.actions.loadLicenses();

    if (this.currentProject?.license) {
      this.licenseForm.patchValue({
        licenseName: this.currentProject.license.name || '',
      });
    }

    this.licenseForm.get('licenseName')?.valueChanges.subscribe((licenseName) => {
      this.updateSelectedLicenseText(licenseName);
    });
  }

  private updateSelectedLicenseText(licenseId: string): void {
    const selectedLicense = this.licenses().find((license: License) => license.id === licenseId);

    if (selectedLicense) {
      this.selectedLicenseText.set(selectedLicense.attributes.text);
    } else {
      this.selectedLicenseText.set('');
    }
  }

  save(): void {
    if (this.licenseForm.valid) {
      const formValue = this.licenseForm.getRawValue();
      const selectedLicense = this.licenses().find((license) => license.id === formValue.licenseName);
      this.dialogRef.close({
        licenseName: formValue.licenseName,
        licenseId: selectedLicense?.id,
        projectId: this.currentProject?.id,
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
