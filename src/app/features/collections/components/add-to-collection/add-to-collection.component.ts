import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { InputText } from 'primeng/inputtext';
import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';
import { Step, StepItem, StepPanel, Stepper } from 'primeng/stepper';
import { Textarea } from 'primeng/textarea';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { AddToCollectionSteps, ProjectMetadataFormControls } from '@osf/features/collections/enums';
import { ProjectMetadataForm } from '@osf/features/collections/models';
import { AddToCollectionSelectors, GetCollectionLicenses } from '@osf/features/collections/store/add-to-collection';
import {
  CollectionsSelectors,
  GetCollectionDetails,
  GetCollectionProvider,
} from '@osf/features/collections/store/collections';
import { GetProjects } from '@osf/shared/stores';
import { LicenseComponent, LoadingSpinnerComponent, TagsInputComponent } from '@shared/components';
import { Project } from '@shared/models/projects';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';
import { CustomValidators } from '@shared/utils';

@Component({
  selector: 'osf-add-to-collection-form',
  imports: [
    Button,
    LoadingSpinnerComponent,
    TranslatePipe,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Select,
    RouterLink,
    InputText,
    ReactiveFormsModule,
    Textarea,
    FormsModule,
    Stepper,
    StepItem,
    StepPanel,
    Step,
    TagsInputComponent,
    Chip,
    LicenseComponent,
  ],
  templateUrl: './add-to-collection.component.html',
  styleUrl: './add-to-collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionComponent implements OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private destroy$ = new Subject<void>();
  private filterSubject = new Subject<string>();

  protected readonly ProjectMetadataFormControls = ProjectMetadataFormControls;
  protected readonly AddToCollectionSteps = AddToCollectionSteps;
  protected isProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  protected collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  protected adminProjects = select(ProjectsSelectors.getProjects);
  protected collectionLicenses = select(AddToCollectionSelectors.getCollectionLicenses);
  protected isCollectionLicensesLoading = select(AddToCollectionSelectors.getCollectionLicensesLoading);
  protected isAdminProjectsLoading = select(ProjectsSelectors.getProjectsLoading);
  protected currentUser = select(UserSelectors.getCurrentUser);
  protected providerId = signal<string>('');
  protected selectedProject = signal<Project | null>(null);
  protected primaryCollectionId = computed(() => this.collectionProvider()?.primaryCollection?.id);
  protected stepperActiveValue = signal<number>(AddToCollectionSteps.SelectProject);
  protected projectTags = signal<string[]>([]);
  // protected isSelectProjectPanelActive = computed(() => {
  //   return this.stepperActiveValue() === AddToCollectionSteps.SelectProject;
  // });

  protected filterMessage = computed(() => {
    const isLoading = this.isAdminProjectsLoading();
    return isLoading
      ? this.translateService.instant('collections.addToCollection.form.loadingPlaceholder')
      : this.translateService.instant('collections.addToCollection.form.noProjectsFound');
  });
  protected actions = createDispatchMap({
    getCollectionProvider: GetCollectionProvider,
    getCollectionDetails: GetCollectionDetails,
    getAdminProjects: GetProjects,
    getCollectionLicenses: GetCollectionLicenses,
  });
  protected adminProjectsOptions = computed(() => {
    const isLoading = this.isAdminProjectsLoading();
    const projects = this.adminProjects();

    return !projects.length || isLoading
      ? []
      : projects.map((project) => {
          return {
            label: project.title,
            value: project,
          };
        });
  });

  readonly projectMetadataForm = new FormGroup<ProjectMetadataForm>({
    [ProjectMetadataFormControls.Title]: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed()],
    }),
    [ProjectMetadataFormControls.Description]: new FormControl('', {
      nonNullable: true,
    }),
    [ProjectMetadataFormControls.License]: new FormControl('', {
      nonNullable: true,
    }),
    [ProjectMetadataFormControls.Tags]: new FormControl([], {
      nonNullable: true,
    }),
  });

  constructor() {
    this.initializeProvider();
    this.setupEffects();
    this.setupFilterDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      const currentUser = this.currentUser();
      if (currentUser) {
        this.actions.getAdminProjects(currentUser.id);
      }
    });

    effect(() => {
      const collectionId = this.primaryCollectionId();
      if (collectionId) {
        this.actions.getCollectionDetails(collectionId);
      }
    });
  }

  private setupFilterDebounce(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filterValue) => {
        this.fetchAdminProjects(filterValue);
      });
  }

  private fetchAdminProjects(filterValue: string): void {
    const currentUser = this.currentUser();
    if (!currentUser) return;

    const params: Record<string, string> = {
      'filter[current_user_permissions]': 'admin',
      'filter[title]': filterValue,
    };

    this.actions.getAdminProjects(currentUser.id, params);
  }

  handleFilterSearch($event: SelectFilterEvent) {
    $event.originalEvent.preventDefault();
    this.filterSubject.next($event.filter);
  }

  handleProjectChange($event: SelectChangeEvent) {
    const project = $event.value;

    if (project) {
      this.actions.getCollectionLicenses(this.providerId());
      this.selectedProject.set(project);
      const tags = project.tags || [];
      this.projectTags.set(tags);
      this.projectMetadataForm.patchValue({
        [ProjectMetadataFormControls.Title]: project.title,
        [ProjectMetadataFormControls.Description]: project.description || '',
        [ProjectMetadataFormControls.License]: project.nodeLicense || '',
        [ProjectMetadataFormControls.Tags]: tags,
      });

      this.stepperActiveValue.set(AddToCollectionSteps.ProjectMetadata);
    } else {
      this.handleChooseSelectedProjectStep();
    }
  }

  handleChooseSelectedProjectStep() {
    this.stepperActiveValue.set(AddToCollectionSteps.SelectProject);
  }

  handleTagsChange(tags: string[]) {
    this.projectTags.set(tags);
    this.projectMetadataForm.get(ProjectMetadataFormControls.Tags)?.setValue(tags);
  }

  handleDiscardProjectMetadataFormChanges() {
    this.projectTags.set([]);
    this.projectMetadataForm.reset();
    this.stepperActiveValue.set(AddToCollectionSteps.SelectProject);
  }
}
