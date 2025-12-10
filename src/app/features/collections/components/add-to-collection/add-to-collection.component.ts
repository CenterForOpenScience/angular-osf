import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Stepper } from 'primeng/stepper';

import { filter, map, Observable, of, switchMap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { HeaderStyleHelper } from '@osf/shared/helpers/header-style.helper';
import { CanDeactivateComponent } from '@osf/shared/models/can-deactivate.interface';
import { BrandService } from '@osf/shared/services/brand.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CollectionsSelectors, GetCollectionProvider } from '@osf/shared/stores/collections';
import { ProjectsSelectors, SetSelectedProject } from '@osf/shared/stores/projects';

import { AddToCollectionSteps } from '../../enums';
import { RemoveCollectionSubmissionPayload } from '../../models/remove-collection-submission-payload.model';
import { RemoveFromCollectionDialogResult } from '../../models/remove-from-collection-dialog-result.model';
import {
  AddToCollectionSelectors,
  ClearAddToCollectionState,
  CreateCollectionSubmission,
  GetCurrentCollectionSubmission,
  RemoveCollectionSubmission,
  UpdateCollectionSubmission,
} from '../../store/add-to-collection';

import { AddToCollectionConfirmationDialogComponent } from './add-to-collection-confirmation-dialog/add-to-collection-confirmation-dialog.component';
import { CollectionMetadataStepComponent } from './collection-metadata-step/collection-metadata-step.component';
import { ProjectContributorsStepComponent } from './project-contributors-step/project-contributors-step.component';
import { ProjectMetadataStepComponent } from './project-metadata-step/project-metadata-step.component';
import { RemoveFromCollectionDialogComponent } from './remove-from-collection-dialog/remove-from-collection-dialog.component';
import { SelectProjectStepComponent } from './select-project-step/select-project-step.component';

@Component({
  selector: 'osf-add-to-collection-form',
  imports: [
    Button,
    TranslatePipe,
    RouterLink,
    Stepper,
    LoadingSpinnerComponent,
    SelectProjectStepComponent,
    ProjectMetadataStepComponent,
    ProjectContributorsStepComponent,
    CollectionMetadataStepComponent,
  ],
  templateUrl: './add-to-collection.component.html',
  styleUrl: './add-to-collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionComponent implements CanDeactivateComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  readonly selectedProjectId = toSignal<string | null>(
    this.route.params.pipe(map((params) => params['id'])) ?? of(null)
  );

  readonly AddToCollectionSteps = AddToCollectionSteps;

  collectionMetadataForm = new FormGroup({});
  isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  selectedProject = select(ProjectsSelectors.getSelectedProject);
  currentUser = select(UserSelectors.getCurrentUser);
  currentCollectionSubmission = select(AddToCollectionSelectors.getCurrentCollectionSubmission);
  providerId = signal<string>('');
  allowNavigation = signal<boolean>(false);
  projectMetadataSaved = signal<boolean>(false);
  projectContributorsSaved = signal<boolean>(false);
  collectionMetadataSaved = signal<boolean>(false);
  stepperActiveValue = signal<number>(AddToCollectionSteps.SelectProject);
  primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);
  isEditMode = computed(() => !!this.selectedProjectId());
  isProjectMetadataDisabled = computed(() => !this.selectedProject());
  isProjectContributorsDisabled = computed(() => !this.selectedProject() || !this.projectMetadataSaved());
  isCollectionMetadataDisabled = computed(
    () => !this.selectedProject() || !this.projectMetadataSaved() || !this.projectContributorsSaved()
  );

  actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    clearAddToCollectionState: ClearAddToCollectionState,
    createCollectionSubmission: CreateCollectionSubmission,
    updateCollectionSubmission: UpdateCollectionSubmission,
    deleteCollectionSubmission: RemoveCollectionSubmission,
    setSelectedProject: SetSelectedProject,
    getCurrentCollectionSubmission: GetCurrentCollectionSubmission,
  });

  showRemoveButton = computed(
    () =>
      this.isEditMode() &&
      this.currentCollectionSubmission()?.submission.reviewsState === CollectionSubmissionReviewState.Accepted
  );

  constructor() {
    this.initializeProvider();
    this.setupEffects();
    this.setupCleanup();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.allowNavigation()) {
      return true;
    }

    return !this.hasUnsavedChanges();
  }

  handleProjectSelected(): void {
    this.projectContributorsSaved.set(false);
    this.projectMetadataSaved.set(false);
    this.allowNavigation.set(false);
  }

  handleChangeStep(step: number): void {
    this.stepperActiveValue.set(step);
  }

  handleProjectMetadataSaved(): void {
    this.projectMetadataSaved.set(true);
  }

  handleContributorsSaved(): void {
    this.stepperActiveValue.set(AddToCollectionSteps.CollectionMetadata);
    this.projectContributorsSaved.set(true);
  }

  handleCollectionMetadataSaved(form: FormGroup): void {
    this.collectionMetadataForm = form;
    this.collectionMetadataSaved.set(true);
    this.stepperActiveValue.set(AddToCollectionSteps.Complete);
  }

  handleAddToCollection() {
    const payload = {
      collectionId: this.primaryCollectionId() || '',
      projectId: this.selectedProject()?.id || '',
      collectionMetadata: this.collectionMetadataForm.value || {},
      userId: this.currentUser()?.id || '',
    };

    const isEditMode = this.isEditMode();

    if (isEditMode) {
      this.loaderService.show();

      this.actions
        .updateCollectionSubmission(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastService.showSuccess('collections.addToCollection.confirmationDialogToastMessage');
            this.allowNavigation.set(true);
            this.router.navigate([this.selectedProject()?.id, 'overview']);
          },
        });
    } else {
      this.customDialogService
        .open(AddToCollectionConfirmationDialogComponent, {
          header: 'collections.addToCollection.confirmationDialogHeader',
          width: '500px',
          data: { payload, project: this.selectedProject() },
        })
        .onClose.pipe(
          filter((res) => !!res),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.allowNavigation.set(true);
          this.router.navigate([this.selectedProject()?.id, 'overview']);
        });
    }
  }

  handleRemoveFromCollection() {
    const projectId = this.selectedProject()?.id;
    const collectionId = this.primaryCollectionId();
    const project = this.selectedProject();

    if (!projectId || !collectionId || !project) return;

    this.customDialogService
      .open(RemoveFromCollectionDialogComponent, {
        header: 'collections.removeDialog.header',
        width: '500px',
        data: { projectTitle: project.title },
      })
      .onClose.pipe(
        filter((res: RemoveFromCollectionDialogResult) => res?.confirmed),
        switchMap((res) => {
          const payload: RemoveCollectionSubmissionPayload = {
            projectId,
            collectionId,
            comment: res?.comment || '',
          };

          return this.actions.deleteCollectionSubmission(payload);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccess('collections.removeDialog.success');
          this.loaderService.show();
          this.allowNavigation.set(true);
          this.router.navigate([projectId, 'overview']);
        },
      });
  }

  private initializeProvider(): void {
    const id = this.route.snapshot.paramMap.get('providerId');
    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.providerId.set(id);
    this.actions.getCollectionProvider(id);
  }

  private setupEffects(): void {
    effect(() => {
      const provider = this.collectionProvider();

      if (provider && provider.brand) {
        BrandService.applyBranding(provider.brand);
        HeaderStyleHelper.applyHeaderStyles(provider.brand.secondaryColor, provider.brand.backgroundColor || '');
      }
    });

    effect(() => {
      const projectIdFromRoute = this.selectedProjectId();
      const collectionId = this.primaryCollectionId();

      if (projectIdFromRoute && collectionId) {
        this.stepperActiveValue.set(AddToCollectionSteps.ProjectMetadata);
        this.actions.getCurrentCollectionSubmission(collectionId, projectIdFromRoute);
      }
    });

    effect(() => {
      const submission = this.currentCollectionSubmission();

      if (submission?.project && !this.selectedProject()) {
        this.actions.setSelectedProject(submission.project);
      }
    });
  }

  private setupCleanup() {
    this.destroyRef.onDestroy(() => {
      this.actions.clearAddToCollectionState();
      this.allowNavigation.set(false);

      HeaderStyleHelper.resetToDefaults();
      BrandService.resetBranding();
    });
  }

  private hasUnsavedChanges(): boolean {
    return (
      !!this.selectedProject() ||
      this.projectMetadataSaved() ||
      this.projectContributorsSaved() ||
      this.collectionMetadataSaved()
    );
  }
}
