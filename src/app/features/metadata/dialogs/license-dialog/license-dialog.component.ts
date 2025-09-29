import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';

import { MetadataModel } from '@osf/features/metadata/models';
import { LicenseComponent, LoadingSpinnerComponent } from '@osf/shared/components';
import { LicenseModel, LicenseOptions } from '@shared/models';
import { LicensesSelectors, LoadAllLicenses } from '@shared/stores/licenses';

@Component({
  selector: 'osf-license-dialog',
  imports: [Button, TranslatePipe, LoadingSpinnerComponent, LicenseComponent],
  templateUrl: './license-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseDialogComponent implements OnInit {
  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  actions = createDispatchMap({ loadLicenses: LoadAllLicenses });

  licenses = select(LicensesSelectors.getLicenses);
  licensesLoading = select(LicensesSelectors.getLoading);

  selectedLicenseId = signal<string | null>(null);
  selectedLicenseOptions = signal<LicenseOptions | null>(null);
  metadata: MetadataModel | null = null;
  isSubmitting = signal<boolean>(false);

  licenseComponent = viewChild<LicenseComponent>('licenseComponent');

  get isInvalid(): boolean {
    return (
      !!this.licenseComponent()?.selectedLicense()?.requiredFields?.length &&
      !!this.licenseComponent()?.licenseForm.invalid
    );
  }

  ngOnInit(): void {
    this.actions.loadLicenses();
    this.metadata = this.config.data?.metadata || null;
    if (this.metadata?.license) {
      this.selectedLicenseId.set(this.metadata.license.id || null);
      if (this.metadata.nodeLicense) {
        this.selectedLicenseOptions.set({
          copyrightHolders: this.metadata.nodeLicense.copyrightHolders?.join(', ') || '',
          year: this.metadata.nodeLicense.year || new Date().getFullYear().toString(),
        });
      }
    }
  }

  onSelectLicense(license: LicenseModel): void {
    this.selectedLicenseId.set(license.id);
  }

  onCreateLicense(event: { id: string; licenseOptions: LicenseOptions }): void {
    const selectedLicense = this.licenses().find((license) => license.id === event.id);
    if (selectedLicense) {
      this.dialogRef.close({
        licenseId: selectedLicense.id,
        licenseOptions: event.licenseOptions,
      });
    }

    this.isSubmitting.set(false);
  }

  save(): void {
    const selectedLicenseId = this.selectedLicenseId();
    if (!selectedLicenseId) return;

    const selectedLicense = this.licenses().find((license) => license.id === selectedLicenseId);
    if (!selectedLicense) return;

    this.isSubmitting.set(true);

    if (selectedLicense.requiredFields?.length) {
      this.licenseComponent()?.saveLicense();
    } else {
      this.dialogRef.close({
        licenseId: selectedLicense.id,
      });
    }
  }

  cancel(): void {
    this.licenseComponent()?.cancel();
    this.dialogRef.close();
  }
}
