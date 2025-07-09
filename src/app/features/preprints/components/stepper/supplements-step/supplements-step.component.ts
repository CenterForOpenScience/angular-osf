import { createDispatchMap, select } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { StringOrNull } from '@core/helpers';
import { SupplementOptions } from '@osf/features/preprints/enums';
import {
  ConnectProject,
  CreateNewProject,
  DisconnectProject,
  FetchPreprintProject,
  GetAvailableProjects,
  SubmitPreprintSelectors,
} from '@osf/features/preprints/store/submit-preprint';
import { AddProjectFormComponent } from '@shared/components';
import { ProjectFormControls } from '@shared/enums';
import { ProjectForm } from '@shared/models';
import { CustomConfirmationService, ToastService } from '@shared/services';
import { CustomValidators } from '@shared/utils';

@Component({
  selector: 'osf-supplements-step',
  imports: [Button, TitleCasePipe, NgClass, Card, Select, AddProjectFormComponent, ReactiveFormsModule, Skeleton],
  templateUrl: './supplements-step.component.html',
  styleUrl: './supplements-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplementsStepComponent implements OnInit {
  private customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private actions = createDispatchMap({
    getAvailableProjects: GetAvailableProjects,
    connectProject: ConnectProject,
    disconnectProject: DisconnectProject,
    fetchPreprintProject: FetchPreprintProject,
    createNewProject: CreateNewProject,
  });
  private destroyRef = inject(DestroyRef);

  readonly SupplementOptions = SupplementOptions;

  createdPreprint = select(SubmitPreprintSelectors.getCreatedPreprint);
  isPreprintSubmitting = select(SubmitPreprintSelectors.isPreprintSubmitting);
  availableProjects = select(SubmitPreprintSelectors.getAvailableProjects);
  areAvailableProjectsLoading = select(SubmitPreprintSelectors.areAvailableProjectsLoading);
  preprintProject = select(SubmitPreprintSelectors.getPreprintProject);
  isPreprintProjectLoading = select(SubmitPreprintSelectors.isPreprintProjectLoading);

  selectedSupplementOption = signal<SupplementOptions>(SupplementOptions.None);
  selectedProjectId = signal<StringOrNull>(null);

  readonly projectNameControl = new FormControl<StringOrNull>(null);
  readonly createProjectForm = new FormGroup<ProjectForm>({
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

  createProjectFormValid = toSignal(this.createProjectForm.statusChanges.pipe(map((status) => status === 'VALID')), {
    initialValue: this.createProjectForm.valid,
  });

  isNextButtonDisabled = computed(() => {
    if (this.selectedSupplementOption() === SupplementOptions.CreateNewProject) {
      return !this.createProjectFormValid();
    }

    return false;
  });

  constructor() {
    effect(() => {
      const preprint = this.createdPreprint();
      if (!preprint?.nodeId) {
        return;
      }

      untracked(() => {
        const preprintProject = this.preprintProject();
        if (preprint.nodeId === preprintProject?.id) {
          return;
        }
      });

      this.actions.fetchPreprintProject();
    });
  }

  nextClicked = output<void>();
  backClicked = output<void>();

  ngOnInit() {
    this.projectNameControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((projectNameOrId) => {
        if (this.selectedProjectId() === projectNameOrId) {
          return;
        }

        this.actions.getAvailableProjects(projectNameOrId);
      });
  }

  selectSupplementOption(supplementOption: SupplementOptions) {
    this.selectedSupplementOption.set(supplementOption);

    if (supplementOption === SupplementOptions.CreateNewProject) {
      this.createProjectForm.reset();
    }

    this.actions.getAvailableProjects(null);
  }

  selectProject(event: SelectChangeEvent) {
    if (!(event.originalEvent instanceof PointerEvent)) {
      return;
    }
    this.selectedProjectId.set(event.value);

    this.actions.connectProject(event.value).subscribe({
      complete: () => {
        this.toastService.showSuccess('Project connected successfully');
      },
    });
  }

  disconnectProject() {
    this.customConfirmationService.confirmDelete({
      headerKey: 'Disconnect supplemental material',
      messageKey:
        'This will disconnect the selected project. You can select new supplemental material or re-add the same supplemental material at a later date.',
      onConfirm: () => {
        this.actions.disconnectProject().subscribe({
          complete: () => {
            this.selectedProjectId.set(null);
            this.toastService.showSuccess('Project disconnected successfully');
          },
        });
      },
    });
  }

  submitCreateProjectForm() {
    if (this.createProjectForm.invalid) {
      return;
    }

    const rawData = this.createProjectForm.getRawValue();

    this.actions
      .createNewProject(
        rawData.title,
        rawData.description,
        rawData.template,
        rawData.storageLocation,
        rawData.affiliations
      )
      .subscribe({
        complete: () => {
          this.toastService.showSuccess('Project created successfully');
          this.nextClicked.emit();
        },
      });
  }

  nextButtonClicked() {
    if (this.selectedSupplementOption() === SupplementOptions.CreateNewProject) {
      this.submitCreateProjectForm();
      return;
    }

    this.toastService.showSuccess('Preprint saved');
    this.nextClicked.emit();
  }

  backButtonClicked() {
    const hasData = Object.entries(this.createProjectForm.value).some(([_, value]) => {
      if (value instanceof Array) {
        return value.length > 0;
      }
      return !!value;
    });

    if (this.selectedSupplementOption() === SupplementOptions.CreateNewProject && hasData) {
      this.customConfirmationService.confirmContinue({
        headerKey: 'Discard changes?',
        messageKey: 'You have unsaved changes in the project creation form. Are you sure you want to go back?',
        onConfirm: () => {
          this.backClicked.emit();
        },
        onReject: () => null,
      });
      return;
    }

    this.backClicked.emit();
  }
}
