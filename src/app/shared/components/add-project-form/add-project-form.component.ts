import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MY_PROJECTS_TABLE_PARAMS } from '@core/constants/my-projects-table.constants';
import { CreateProject, GetMyProjects, MyProjectsSelectors } from '@osf/features/my-projects/store';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';
import { ProjectForm } from '@osf/shared/models/create-project-form.model';
import { CustomValidators } from '@osf/shared/utils';
import { InstitutionsSelectors } from '@shared/stores/institutions';
import { FetchRegions, RegionsSelectors } from '@shared/stores/regions';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-add-project-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    Select,
    Textarea,
    NgOptimizedImage,
    TranslatePipe,
  ],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectFormComponent implements OnInit {
  private store = inject(Store);
  protected readonly projects = select(MyProjectsSelectors.getProjects);
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly ProjectFormControls = ProjectFormControls;
  protected readonly hasTemplateSelected = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly storageLocations = select(RegionsSelectors.getRegions);

  protected readonly affiliations = select(InstitutionsSelectors.getUserInstitutions);

  protected projectTemplateOptions = computed(() => {
    return this.projects().map((project) => ({
      label: project.title,
      value: project.id,
    }));
  });

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

  constructor() {
    this.store.dispatch(new FetchRegions());
    this.projectForm.get(ProjectFormControls.Template)?.valueChanges.subscribe((value) => {
      this.hasTemplateSelected.set(!!value);
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {}));

    this.selectAllAffiliations();
  }

  selectAllAffiliations(): void {
    const allAffiliationValues = this.affiliations().map((aff) => aff.id);
    this.projectForm.get(ProjectFormControls.Affiliations)?.setValue(allAffiliationValues);
  }

  removeAllAffiliations(): void {
    this.projectForm.get(ProjectFormControls.Affiliations)?.setValue([]);
  }

  submitForm(): void {
    if (!this.projectForm.valid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const formValue = this.projectForm.getRawValue();
    this.isSubmitting.set(true);

    this.store
      .dispatch(
        new CreateProject(
          formValue.title,
          formValue.description,
          formValue.template,
          formValue.storageLocation,
          formValue.affiliations
        )
      )
      .subscribe({
        next: () => {
          this.store.dispatch(new GetMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {}));
          this.dialogRef.close();
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }
}
