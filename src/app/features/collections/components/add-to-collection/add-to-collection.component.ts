import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
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
} from '@osf/features/collections/store/add-to-collection';
import { LoadingSpinnerComponent } from '@shared/components';
import { HeaderStyleHelper } from '@shared/helpers';
import { CanDeactivateComponent } from '@shared/models';
import { BrandService, CustomDialogService } from '@shared/services';
import { CollectionsSelectors, GetCollectionProvider } from '@shared/stores';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionComponent implements CanDeactivateComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);

  readonly AddToCollectionSteps = AddToCollectionSteps;

  collectionMetadataForm = new FormGroup({});
  isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  selectedProject = select(ProjectsSelectors.getSelectedProject);
  currentUser = select(UserSelectors.getCurrentUser);
  providerId = signal<string>('');
  allowNavigation = signal<boolean>(false);
  projectMetadataSaved = signal<boolean>(false);
  projectContributorsSaved = signal<boolean>(false);
  collectionMetadataSaved = signal<boolean>(false);
  stepperActiveValue = signal<number>(AddToCollectionSteps.SelectProject);
  primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);
  isProjectMetadataDisabled = computed(() => !this.selectedProject());
  isProjectContributorsDisabled = computed(() => !this.selectedProject() || !this.projectMetadataSaved());
  isCollectionMetadataDisabled = computed(
    () => !this.selectedProject() || !this.projectMetadataSaved() || !this.projectContributorsSaved()
  );

  actions = createDispatchMap({
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

    this.customDialogService
      .open(AddToCollectionConfirmationDialogComponent, {
        header: 'collections.addToCollection.confirmationDialogHeader',
        width: '500px',
        data: { payload, project: this.selectedProject() },
      })
      .onClose.subscribe((result) => {
        if (result) {
          this.allowNavigation.set(true);
          this.router.navigate([this.selectedProject()?.id, 'overview']);
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
        this.allowNavigation.set(false);

        HeaderStyleHelper.resetToDefaults();
        BrandService.resetBranding();
      });
    });

    effect(() => {
      const provider = this.collectionProvider();

      if (provider && provider.brand) {
        BrandService.applyBranding(provider.brand);
        HeaderStyleHelper.applyHeaderStyles(provider.brand.secondaryColor, provider.brand.backgroundColor || '');
      }
    });
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

  private hasUnsavedChanges(): boolean {
    return (
      !!this.selectedProject() ||
      this.projectMetadataSaved() ||
      this.projectContributorsSaved() ||
      this.collectionMetadataSaved()
    );
  }
}
