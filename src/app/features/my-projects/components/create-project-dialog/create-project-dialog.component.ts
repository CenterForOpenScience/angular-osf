import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AddProjectFormComponent } from '@osf/shared/components';
import { MY_PROJECTS_TABLE_PARAMS } from '@osf/shared/constants';
import { ProjectFormControls } from '@osf/shared/enums';
import { CustomValidators } from '@osf/shared/helpers';
import { ProjectForm } from '@osf/shared/models';
import { CreateProject, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores';

@Component({
  selector: 'osf-create-project-dialog',
  imports: [AddProjectFormComponent, Button, TranslatePipe],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  private readonly store = inject(Store);

  private actions = createDispatchMap({
    getMyProjects: GetMyProjects,
    createProject: CreateProject,
  });

  readonly isProjectSubmitting = select(MyResourcesSelectors.isProjectSubmitting);

  readonly projectForm = new FormGroup<ProjectForm>({
    [ProjectFormControls.Title]: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed()],
    }),
    [ProjectFormControls.StorageLocation]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [ProjectFormControls.Affiliations]: new FormControl<string[]>([], {
      nonNullable: true,
    }),
    [ProjectFormControls.Description]: new FormControl('', {
      nonNullable: true,
    }),
    [ProjectFormControls.Template]: new FormControl('', {
      nonNullable: true,
    }),
  });

  submitForm(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const formValue = this.projectForm.getRawValue();

    this.actions
      .createProject(
        formValue.title,
        formValue.description,
        formValue.template,
        formValue.storageLocation,
        formValue.affiliations
      )
      .subscribe({
        next: () => {
          const projects = this.store.selectSnapshot(MyResourcesSelectors.getProjects);
          const newProject = projects[0];
          this.actions.getMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {});
          this.dialogRef.close({ project: newProject });
        },
      });
  }
}
