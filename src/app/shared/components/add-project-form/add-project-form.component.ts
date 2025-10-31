import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';
import { FetchUserInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { FetchRegions, RegionsSelectors } from '@osf/shared/stores/regions';
import { Institution } from '@shared/models/institutions/institutions.models';
import { ProjectForm } from '@shared/models/projects/create-project-form.model';
import { ProjectModel } from '@shared/models/projects/projects.models';

import { AffiliatedInstitutionSelectComponent } from '../affiliated-institution-select/affiliated-institution-select.component';
import { ProjectSelectorComponent } from '../project-selector/project-selector.component';

@Component({
  selector: 'osf-add-project-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Select,
    Textarea,
    TranslatePipe,
    AffiliatedInstitutionSelectComponent,
    ProjectSelectorComponent,
  ],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectFormComponent implements OnInit {
  private readonly actions = createDispatchMap({
    fetchUserInstitutions: FetchUserInstitutions,
    fetchRegions: FetchRegions,
  });
  private readonly destroyRef = inject(DestroyRef);

  ProjectFormControls = ProjectFormControls;

  hasTemplateSelected = signal(false);
  selectedTemplate = signal<ProjectModel | null>(null);
  isSubmitting = signal(false);
  selectedAffiliations = signal<Institution[]>([]);
  currentUser = select(UserSelectors.getCurrentUser);
  storageLocations = select(RegionsSelectors.getRegions);
  areStorageLocationsLoading = select(RegionsSelectors.areRegionsLoading);
  affiliations = select(InstitutionsSelectors.getUserInstitutions);
  affiliationLoading = select(InstitutionsSelectors.areUserInstitutionsLoading);

  projectForm = input.required<FormGroup<ProjectForm>>();

  constructor() {
    effect(() => {
      this.projectForm()
        .get(ProjectFormControls.Affiliations)
        ?.setValue(this.selectedAffiliations().map((inst) => inst.id));
    });

    effect(() => {
      const affiliations = this.affiliations();

      if (affiliations?.length > 0) {
        this.selectedAffiliations.set(affiliations);
      }
    });
  }

  ngOnInit(): void {
    this.actions.fetchUserInstitutions();
    this.actions.fetchRegions();

    this.projectForm()
      .get(ProjectFormControls.StorageLocation)
      ?.setValue(this.currentUser()?.defaultRegionId || '');

    this.projectForm()
      .get(ProjectFormControls.Template)
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.hasTemplateSelected.set(!!value));
  }

  onTemplateChange(project: ProjectModel | null): void {
    if (!project) return;
    this.selectedTemplate.set(project);
    this.projectForm().get(ProjectFormControls.Template)?.setValue(project.id);
    this.hasTemplateSelected.set(!!project);
  }
}
