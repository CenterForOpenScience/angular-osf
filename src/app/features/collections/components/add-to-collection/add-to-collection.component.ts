import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Stepper } from 'primeng/stepper';

import { Observable } from 'rxjs';

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
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { AddToCollectionSteps } from '@osf/features/collections/enums';
import {
  ClearAddToCollectionState,
  CreateCollectionSubmission,
} from '@osf/features/collections/store/add-to-collection/add-to-collection.actions';
import { CollectionsSelectors, GetCollectionProvider } from '@osf/features/collections/store/collections';
import { LoadingSpinnerComponent } from '@shared/components';
import { CanDeactivateComponent } from '@shared/models';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

import {
  AddToCollectionConfirmationDialogComponent,
  CollectionMetadataStepComponent,
  ProjectContributorsStepComponent,
  ProjectMetadataStepComponent,
  SelectProjectStepComponent,
} from './index';

@Component({
  selector: 'osf-add-to-collection-form',
  imports: [
    Button,
    LoadingSpinnerComponent,
    TranslatePipe,
    RouterLink,
    Stepper,
    SelectProjectStepComponent,
    ProjectMetadataStepComponent,
    ProjectContributorsStepComponent,
    CollectionMetadataStepComponent,
  ],
  templateUrl: './add-to-collection.component.html',
  styleUrl: './add-to-collection.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionComponent implements CanDeactivateComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  protected readonly AddToCollectionSteps = AddToCollectionSteps;

  protected collectionMetadataForm = new FormGroup({});
  protected isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  protected collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  protected selectedProject = select(ProjectsSelectors.getSelectedProject);
  protected currentUser = select(UserSelectors.getCurrentUser);
  protected providerId = signal<string>('');
  protected isSubmitted = signal<boolean>(false);
  protected projectMetadataSaved = signal<boolean>(false);
  protected projectContributorsSaved = signal<boolean>(false);
  protected collectionMetadataSaved = signal<boolean>(false);
  protected stepperActiveValue = signal<number>(AddToCollectionSteps.SelectProject);
  protected primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);
  protected isProjectMetadataDisabled = computed(() => !this.selectedProject());
  protected isProjectContributorsDisabled = computed(() => !this.selectedProject() || !this.projectMetadataSaved());
  protected isCollectionMetadataDisabled = computed(
    () => !this.selectedProject() || !this.projectMetadataSaved() || !this.projectContributorsSaved()
  );

  protected actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    clearAddToCollectionState: ClearAddToCollectionState,
    createCollectionSubmission: CreateCollectionSubmission,
  });

  constructor() {
    this.initializeProvider();
    this.setupEffects();
  }

  handleProjectSelected(): void {
    this.projectContributorsSaved.set(false);
    this.projectMetadataSaved.set(false);
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
    this.isSubmitted.set(true);

    const dialogRef = this.dialogService.open(AddToCollectionConfirmationDialogComponent, {
      width: '500px',
      focusOnShow: false,
      header: this.translateService.instant('collections.addToCollection.confirmationDialogHeader'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: payload,
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.isSubmitted.set(false);
        this.router.navigate(['/my-projects', this.selectedProject()?.id, 'overview']);
      }
    });
  }

  private initializeProvider(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.providerId.set(id);
    this.actions.getCollectionProvider(id);
  }

  private setupEffects(): void {
    effect(() => {
      this.destroyRef.onDestroy(() => {
        this.actions.clearAddToCollectionState();
      });
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.isSubmitted();
  }
}
