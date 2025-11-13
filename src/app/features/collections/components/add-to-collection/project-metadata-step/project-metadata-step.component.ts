import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Chip } from 'primeng/chip';
import { DatePicker } from 'primeng/datepicker';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Step, StepItem, StepPanel } from 'primeng/stepper';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddToCollectionSteps, ProjectMetadataFormControls } from '@osf/features/collections/enums';
import { ProjectMetadataForm } from '@osf/features/collections/models';
import { ProjectMetadataFormService } from '@osf/features/collections/services';
import { AddToCollectionSelectors, GetCollectionLicenses } from '@osf/features/collections/store/add-to-collection';
import { TagsInputComponent } from '@osf/shared/components/tags-input/tags-input.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { LicenseModel } from '@osf/shared/models/license/license.model';
import { ProjectModel } from '@osf/shared/models/projects/projects.models';
import { InterpolatePipe } from '@osf/shared/pipes/interpolate.pipe';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetAllContributors } from '@osf/shared/stores/contributors';
import { ClearProjects, ProjectsSelectors, UpdateProjectMetadata } from '@osf/shared/stores/projects';

@Component({
  selector: 'osf-project-metadata-step',
  imports: [
    Button,
    TranslatePipe,
    ReactiveFormsModule,
    Textarea,
    FormsModule,
    TagsInputComponent,
    Chip,
    Card,
    Message,
    DatePicker,
    Divider,
    InterpolatePipe,
    TextInputComponent,
    TruncatedTextComponent,
    Select,
    Step,
    StepItem,
    StepPanel,
    Tooltip,
  ],
  templateUrl: './project-metadata-step.component.html',
  styleUrl: './project-metadata-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataStepComponent {
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formService = inject(ProjectMetadataFormService);
  readonly currentYear = new Date();

  readonly ProjectMetadataFormControls = ProjectMetadataFormControls;
  readonly inputLimits = InputLimits;

  readonly selectedProject = select(ProjectsSelectors.getSelectedProject);
  readonly collectionLicenses = select(AddToCollectionSelectors.getCollectionLicenses);
  readonly isSelectedProjectUpdateSubmitting = select(ProjectsSelectors.getSelectedProjectUpdateSubmitting);

  stepperActiveValue = input.required<number>();
  targetStepValue = input.required<number>();
  isDisabled = input.required<boolean>();
  providerId = input.required<string>();

  stepChange = output<number>();
  metadataSaved = output<void>();

  actions = createDispatchMap({
    updateCollectionSubmissionMetadata: UpdateProjectMetadata,
    getAllContributors: GetAllContributors,
    getCollectionLicenses: GetCollectionLicenses,
    clearProjects: ClearProjects,
  });

  readonly projectMetadataForm: FormGroup<ProjectMetadataForm> = this.formService.createForm();
  readonly projectTags = signal<string[]>([]);
  readonly selectedLicense = signal<LicenseModel | null>(null);

  private readonly projectMetadataFormValue = toSignal(this.projectMetadataForm.valueChanges);
  private readonly initialProjectMetadataFormValues = signal<string | null>(null);

  readonly projectLicense = computed(() => {
    const project = this.selectedProject();
    return project ? (this.collectionLicenses().find((license) => license.id === project.licenseId) ?? null) : null;
  });

  private readonly isFormUnchanged = computed(() => {
    const currentFormValues = this.projectMetadataFormValue();
    const initialFormValues = this.initialProjectMetadataFormValues();

    return this.formService.isFormUnchanged(currentFormValues ?? null, initialFormValues);
  });

  get copyrightHolders() {
    const control = this.projectMetadataForm.controls[ProjectMetadataFormControls.CopyrightHolders];
    return control.value ? `${control.value}.` : '';
  }

  get year() {
    return this.projectMetadataForm.controls[ProjectMetadataFormControls.LicenseYear].value || '';
  }

  constructor() {
    this.setupEffects();
  }

  handleSelectCollectionLicense(event: SelectChangeEvent): void {
    const license = event.value as LicenseModel;
    const project = this.selectedProject();

    if (!license || !project) return;

    this.selectedLicense.set(license);
    this.formService.updateLicenseValidators(this.projectMetadataForm, license);
    this.formService.patchLicenseData(this.projectMetadataForm, license, project);
  }

  handleTagsChange(tags: string[]): void {
    this.projectTags.set(tags);
    this.formService.updateTagsInForm(this.projectMetadataForm, tags);
  }

  handleDiscardChanges(): void {
    this.formService.resetForm(this.projectMetadataForm);
    this.populateFormFromProject();
  }

  handleUpdateMetadata(): void {
    const selectedProject = this.selectedProject();

    if (!selectedProject || !this.projectMetadataForm.valid) return;

    if (this.isFormUnchanged()) {
      this.proceedToNextStep(selectedProject.id);
      return;
    }

    this.updateProjectMetadata(selectedProject);
  }

  handleEditStep(): void {
    this.stepChange.emit(this.targetStepValue());
  }

  private populateFormFromProject(): void {
    const project = this.selectedProject();
    if (!project) return;

    const projectLicense = this.projectLicense();

    if (projectLicense) {
      this.formService.updateLicenseValidators(this.projectMetadataForm, projectLicense);
    }

    const { tags } = this.formService.populateFormFromProject(this.projectMetadataForm, project, projectLicense);

    this.projectTags.set(tags);
  }

  private proceedToNextStep(projectId: string): void {
    this.stepChange.emit(AddToCollectionSteps.ProjectContributors);
    this.actions.getAllContributors(projectId, ResourceType.Project);
    this.metadataSaved.emit();
  }

  private updateProjectMetadata(selectedProject: ProjectModel): void {
    const metadata = this.formService.buildMetadataPayload(this.projectMetadataForm, selectedProject);

    this.actions
      .updateCollectionSubmissionMetadata(metadata)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.actions.getAllContributors(selectedProject.id, ResourceType.Project);
          this.stepChange.emit(AddToCollectionSteps.ProjectContributors);
        },
        complete: () => {
          this.metadataSaved.emit();
          this.toastService.showSuccess('collections.addToCollection.projectMetadataUpdateSuccess');
        },
      });
  }

  private setupEffects(): void {
    effect(() => {
      const licenses = this.collectionLicenses();
      const providerId = this.providerId();

      if (!licenses.length && providerId) {
        this.actions.getCollectionLicenses(providerId);
      }
    });

    effect(() => {
      const selectedProject = this.selectedProject();
      if (!selectedProject) return;

      const license = this.collectionLicenses().find((l) => selectedProject.licenseId === l.id);

      if (license) {
        untracked(() => {
          this.selectedLicense.set(license);
          this.formService.updateLicenseValidators(this.projectMetadataForm, license);
        });
      }

      this.populateFormFromProject();
    });

    effect(() => {
      const formValue = this.projectMetadataFormValue();
      const selectedProject = this.selectedProject();

      if (selectedProject && formValue && !this.initialProjectMetadataFormValues()) {
        this.initialProjectMetadataFormValues.set(JSON.stringify(formValue));
      }
    });

    this.destroyRef.onDestroy(() => {
      this.actions.clearProjects();
    });
  }
}
