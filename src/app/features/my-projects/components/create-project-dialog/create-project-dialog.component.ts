import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MY_PROJECTS_TABLE_PARAMS } from '@core/constants';
import { AddProjectFormComponent } from '@shared/components';
import { ProjectFormControls } from '@shared/enums';
import { IdName, ProjectForm } from '@shared/models';
import { CustomValidators } from '@shared/utils';

import { CreateProject, GetMyProjects, MyResourcesSelectors } from 'src/app/shared/stores/my-resources';

@Component({
  selector: 'osf-create-project-dialog',
  imports: [AddProjectFormComponent, Button, TranslatePipe],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectDialogComponent implements OnInit {
  protected readonly dialogRef = inject(DynamicDialogRef);

  private actions = createDispatchMap({
    getMyProjects: GetMyProjects,
    createProject: CreateProject,
  });

  private projects = select(MyResourcesSelectors.getProjects);

  readonly templates = computed(() => {
    return this.projects().map(
      (project) =>
        ({
          id: project.id,
          name: project.title,
        }) as IdName
    );
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

  ngOnInit(): void {
    this.actions.getMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {});
  }

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
          this.actions.getMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {});
          this.dialogRef.close();
        },
      });
  }
}
