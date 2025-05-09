import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Store } from '@ngxs/store';
import { STORAGE_LOCATIONS } from '@core/constants/storage-locations.constant';
import {
  CreateProject,
  GetMyProjects,
  MyProjectsSelectors,
} from '@osf/features/my-projects/store';
import { InstitutionsSelectors } from '@osf/features/institutions/store';
import { MY_PROJECTS_TABLE_PARAMS } from '@core/constants/my-projects-table.constants';
import { ProjectForm } from '@shared/entities/create-project-form.interface';
import { ProjectFormControls } from '@osf/shared/entities/create-project-form-controls.enum';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'osf-add-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
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
  #store = inject(Store);
  protected readonly projects = this.#store.selectSignal(
    MyProjectsSelectors.getProjects,
  );
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly ProjectFormControls = ProjectFormControls;
  protected readonly hasTemplateSelected = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly storageLocations = STORAGE_LOCATIONS;

  protected readonly affiliations = this.#store.selectSignal(
    InstitutionsSelectors.getUserInstitutions,
  );

  protected projectTemplateOptions = computed(() => {
    return this.projects().map((project) => ({
      label: project.title,
      value: project.id,
    }));
  });

  readonly projectForm = new FormGroup<ProjectForm>({
    [ProjectFormControls.Title]: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [ProjectFormControls.StorageLocation]: new FormControl('us', {
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
    this.projectForm
      .get(ProjectFormControls.Template)
      ?.valueChanges.subscribe((value) => {
        this.hasTemplateSelected.set(!!value);
      });
  }

  ngOnInit(): void {
    this.#store.dispatch(
      new GetMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {}),
    );

    this.selectAllAffiliations();
  }

  selectAllAffiliations(): void {
    const allAffiliationValues = this.affiliations().map((aff) => aff.id);
    this.projectForm
      .get(ProjectFormControls.Affiliations)
      ?.setValue(allAffiliationValues);
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

    this.#store
      .dispatch(
        new CreateProject(
          formValue.title,
          formValue.description,
          formValue.template,
          formValue.storageLocation,
          formValue.affiliations,
        ),
      )
      .subscribe({
        next: () => {
          this.#store.dispatch(
            new GetMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {}),
          );
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Failed to create project:', error);
          this.isSubmitting.set(false);
        },
      });
  }
}
