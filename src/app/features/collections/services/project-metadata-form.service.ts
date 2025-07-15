import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProjectMetadataFormControls } from '@osf/features/collections/enums';
import { ProjectMetadataForm } from '@osf/features/collections/models';
import { License, ProjectMetadataUpdatePayload } from '@shared/models';
import { Project } from '@shared/models/projects';
import { CustomValidators } from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ProjectMetadataFormService {
  private readonly currentYear = new Date();

  createForm(): FormGroup<ProjectMetadataForm> {
    return new FormGroup<ProjectMetadataForm>({
      [ProjectMetadataFormControls.Title]: new FormControl('', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed()],
      }),
      [ProjectMetadataFormControls.Description]: new FormControl('', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed()],
      }),
      [ProjectMetadataFormControls.License]: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      [ProjectMetadataFormControls.Tags]: new FormControl([], {
        nonNullable: true,
        validators: [CustomValidators.requiredArrayValidator()],
      }),
      [ProjectMetadataFormControls.LicenseYear]: new FormControl(this.currentYear.getFullYear().toString(), {
        nonNullable: true,
      }),
      [ProjectMetadataFormControls.CopyrightHolders]: new FormControl('', {
        nonNullable: true,
      }),
    });
  }

  updateLicenseValidators(form: FormGroup<ProjectMetadataForm>, license: License): void {
    const yearControl = form.get(ProjectMetadataFormControls.LicenseYear);
    const copyrightHoldersControl = form.get(ProjectMetadataFormControls.CopyrightHolders);

    const validators = license.requiredFields.length ? [CustomValidators.requiredTrimmed()] : [];

    yearControl?.setValidators(validators);
    copyrightHoldersControl?.setValidators(validators);

    yearControl?.updateValueAndValidity();
    copyrightHoldersControl?.updateValueAndValidity();
  }

  populateFormFromProject(
    form: FormGroup<ProjectMetadataForm>,
    project: Project,
    license: License | null
  ): { tags: string[] } {
    const tags = project.tags || [];

    form.patchValue({
      [ProjectMetadataFormControls.Title]: project.title,
      [ProjectMetadataFormControls.Description]: project.description || '',
      [ProjectMetadataFormControls.License]: license,
      [ProjectMetadataFormControls.Tags]: tags,
      [ProjectMetadataFormControls.LicenseYear]:
        project.licenseOptions?.year || this.currentYear.getFullYear().toString(),
      [ProjectMetadataFormControls.CopyrightHolders]: project.licenseOptions?.copyrightHolders || '',
    });

    return { tags };
  }

  patchLicenseData(form: FormGroup<ProjectMetadataForm>, license: License, project: Project): void {
    form.patchValue({
      [ProjectMetadataFormControls.License]: license,
      [ProjectMetadataFormControls.LicenseYear]:
        project.licenseOptions?.year || this.currentYear.getFullYear().toString(),
      [ProjectMetadataFormControls.CopyrightHolders]: project.licenseOptions?.copyrightHolders || '',
    });
  }

  updateTagsInForm(form: FormGroup<ProjectMetadataForm>, tags: string[]): void {
    form.patchValue({ [ProjectMetadataFormControls.Tags]: tags });
    form.get(ProjectMetadataFormControls.Tags)?.markAsTouched();
  }

  buildMetadataPayload(form: FormGroup<ProjectMetadataForm>, project: Project): ProjectMetadataUpdatePayload {
    const formValue = form.value;

    return {
      id: project.id,
      title: formValue.title || '',
      description: formValue.description || '',
      tags: formValue.tags || [],
      licenseId: formValue.license?.id || '',
      licenseOptions: formValue.license?.requiredFields?.length
        ? {
            year: formValue.licenseYear || '',
            copyrightHolders: formValue.copyrightHolders || '',
          }
        : undefined,
    };
  }

  isFormUnchanged(currentFormValues: unknown, initialFormValues: string | null): boolean {
    return !initialFormValues || !currentFormValues || JSON.stringify(currentFormValues) === initialFormValues;
  }

  resetForm(form: FormGroup<ProjectMetadataForm>): void {
    form.markAsUntouched();
  }
}
