import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
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
import { HomeSelectors } from 'src/app/features/home/store';

enum ProjectFormControls {
  Title = 'title',
  StorageLocation = 'storageLocation',
  Affiliations = 'affiliations',
  Description = 'description',
  Template = 'template',
}

interface ProjectForm {
  [ProjectFormControls.Title]: FormControl<string>;
  [ProjectFormControls.StorageLocation]: FormControl<string>;
  [ProjectFormControls.Affiliations]: FormControl<string[]>;
  [ProjectFormControls.Description]: FormControl<string>;
  [ProjectFormControls.Template]: FormControl<string>;
}

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
  ],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectFormComponent {
  #store = inject(Store);
  protected readonly projects = this.#store.selectSignal(
    HomeSelectors.getProjects,
  );
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly ProjectFormControls = ProjectFormControls;
  protected readonly hasTemplateSelected = signal(false);

  protected readonly storageLocations = [
    { label: 'United States', value: 'us' },
    { label: 'Canada - Montréal', value: 'ca' },
    { label: 'Germany - Frankfurt', value: 'de-1' },
  ];

  protected readonly affiliations = [
    { label: 'Affiliation 1', value: 'aff1' },
    { label: 'Affiliation 2', value: 'aff2' },
    { label: 'Affiliation 3', value: 'aff3' },
  ];

  protected projectTemplateOptions = computed(() => {
    return this.projects().map((project) => ({
      label: project.title,
      value: project.title,
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

  selectAllAffiliations(): void {
    const allAffiliationValues = this.affiliations.map((aff) => aff.value);
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

    // TODO: Integrate with API
    this.dialogRef.close();
  }
}
