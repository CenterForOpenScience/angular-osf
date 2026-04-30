import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Stepper } from 'primeng/stepper';

import { filter, finalize, map, Observable, of, switchMap } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { UserSelectors } from '@core/store/user';
import { CedarMetadataRecordData, CedarRecordDataBinding } from '@osf/features/metadata/models';
import {
  CreateCedarMetadataRecord,
  GetCedarMetadataRecords,
  MetadataSelectors,
  UpdateCedarMetadataRecord,
} from '@osf/features/metadata/store';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CanDeactivateComponent } from '@osf/shared/models/can-deactivate.interface';
import { BrandService } from '@osf/shared/services/brand.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';
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
    Stepper,
    RouterLink,
    TranslatePipe,
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
  private readonly brandService = inject(BrandService);
  private readonly headerStyleHelper = inject(HeaderStyleService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly environment = inject(ENVIRONMENT);

  readonly selectedProjectId = toSignal<string | null>(
    this.route.params.pipe(map((params) => params['id'])) ?? of(null)
  );

  readonly AddToCollectionSteps = AddToCollectionSteps;

  collectionMetadataForm = new FormGroup({});

  isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  requiredMetadataTemplate = select(CollectionsSelectors.getRequiredMetadataTemplate);
  selectedProject = select(ProjectsSelectors.getSelectedProject);
  currentUser = select(UserSelectors.getCurrentUser);
  currentCollectionSubmission = select(AddToCollectionSelectors.getCurrentCollectionSubmission);
  cedarRecords = select(MetadataSelectors.getCedarRecords);

  providerId = signal<string>('');
  allowNavigation = signal<boolean>(false);
  projectMetadataSaved = signal<boolean>(false);
  projectContributorsSaved = signal<boolean>(false);
  collectionMetadataSaved = signal<boolean>(false);
  pendingCedarData = signal<CedarRecordDataBinding | null>(null);
  stepperActiveValue = signal<number>(AddToCollectionSteps.SelectProject);

  primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);
  isEditMode = computed(() => !!this.selectedProjectId());
  isProjectMetadataDisabled = computed(() => !this.selectedProject());
  isProjectContributorsDisabled = computed(() => !this.selectedProject() || !this.projectMetadataSaved());
  isCollectionMetadataDisabled = computed(
    () => !this.selectedProject() || !this.projectMetadataSaved() || !this.projectContributorsSaved()
  );
  isCedarMode = computed(() => this.environment.collectionSubmissionWithCedar && !!this.requiredMetadataTemplate());
  existingCedarRecord = computed<CedarMetadataRecordData | null>(() => {
    const records = this.cedarRecords();
    const templateId = this.requiredMetadataTemplate()?.id;
    if (!records?.length || !templateId) return null;
    return records.find((r) => r.relationships?.template?.data?.id === templateId) ?? null;
  });

  readonly actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    clearAddToCollectionState: ClearAddToCollectionState,
    updateCollectionSubmission: UpdateCollectionSubmission,
    deleteCollectionSubmission: RemoveCollectionSubmission,
    setSelectedProject: SetSelectedProject,
    getCurrentCollectionSubmission: GetCurrentCollectionSubmission,
    getCedarRecords: GetCedarMetadataRecords,
    createCedarRecord: CreateCedarMetadataRecord,
    updateCedarRecord: UpdateCedarMetadataRecord,
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
  onBeforeUnload($event: BeforeUnloadEvent): boolean | undefined {
    if (this.allowNavigation() || !this.hasUnsavedChanges()) {
      return undefined;
    }
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

  handleCedarDataSaved(data: CedarRecordDataBinding): void {
    this.pendingCedarData.set(data);
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
        .pipe(
          switchMap(() => this.saveCedarRecordIfNeeded()),
          finalize(() => this.loaderService.hide()),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: () => {
            this.toastService.showSuccess('collections.addToCollection.confirmationDialogToastMessage');
            this.allowNavigation.set(true);
            this.router.navigate([this.selectedProject()?.id, 'overview']);
          },
          error: () => {
            this.toastService.showError('collections.addToCollection.updateError');
          },
        });
    } else {
      this.saveCedarRecordIfNeeded()
        .pipe(
          switchMap(() =>
            this.customDialogService
              .open(AddToCollectionConfirmationDialogComponent, {
                header: 'collections.addToCollection.confirmationDialogHeader',
                width: '500px',
                data: { payload, project: this.selectedProject() },
              })
              .onClose.pipe(filter((res) => !!res))
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: () => {
            this.allowNavigation.set(true);
            this.router.navigate([this.selectedProject()?.id, 'overview']);
          },
          error: () => {
            this.toastService.showError('collections.addToCollection.updateError');
          },
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

  private saveCedarRecordIfNeeded(): Observable<unknown> {
    if (!this.isCedarMode()) return of(null);

    const cedarData = this.pendingCedarData();
    const projectId = this.selectedProject()?.id;
    const templateId = this.requiredMetadataTemplate()?.id;
    if (!cedarData || !projectId || !templateId) return of(null);

    const existingId = this.existingCedarRecord()?.id;
    return existingId
      ? this.actions.updateCedarRecord(cedarData, existingId, projectId, ResourceType.Project)
      : this.actions.createCedarRecord(cedarData, projectId, ResourceType.Project);
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
        this.brandService.applyBranding(provider.brand);
        this.headerStyleHelper.applyHeaderStyles(provider.brand.secondaryColor, provider.brand.backgroundColor || '');
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

    effect(() => {
      const projectId = this.selectedProjectId();
      const isCedar = this.isCedarMode();
      if (isCedar && projectId) {
        this.actions.getCedarRecords(projectId, ResourceType.Project);
      }
    });
  }

  private setupCleanup() {
    this.destroyRef.onDestroy(() => {
      if (this.isBrowser) {
        this.actions.clearAddToCollectionState();
        this.allowNavigation.set(false);

        this.headerStyleHelper.resetToDefaults();
        this.brandService.resetBranding();
      }
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
