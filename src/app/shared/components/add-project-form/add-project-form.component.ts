import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ProjectFormControls } from '@osf/shared/enums';
import { Institution, ProjectForm } from '@osf/shared/models';
import { Project } from '@osf/shared/models/projects';
import { FetchRegions, RegionsSelectors } from '@osf/shared/stores';
import { FetchUserInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';

import { AffiliatedInstitutionSelectComponent } from '../affiliated-institution-select/affiliated-institution-select.component';
import { ProjectSelectorComponent } from '../project-selector/project-selector.component';

@Component({
  selector: 'osf-add-project-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
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
  selectedTemplate = signal<Project | null>(null);
  isSubmitting = signal(false);
  selectedAffiliations = signal<Institution[]>([]);
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
      .get(ProjectFormControls.Template)
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.hasTemplateSelected.set(!!value);
      });
  }

  onTemplateChange(project: Project | null): void {
    if (!project) return;
    this.selectedTemplate.set(project);
    this.projectForm().get(ProjectFormControls.Template)?.setValue(project.id);
    this.hasTemplateSelected.set(!!project);
  }
}
