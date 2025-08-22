import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ProjectFormControls } from '@osf/shared/enums';
import { Institution, ProjectForm } from '@osf/shared/models';
import { Project } from '@osf/shared/models/projects';
import { AffiliatedInstitutionSelectComponent } from '@shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { ProjectSelectorComponent } from '@shared/components/project-selector/project-selector.component';
import { FetchUserInstitutions, InstitutionsSelectors } from '@shared/stores/institutions';
import { FetchRegions, RegionsSelectors } from '@shared/stores/regions';

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
  private actions = createDispatchMap({
    fetchUserInstitutions: FetchUserInstitutions,
    fetchRegions: FetchRegions,
  });

  ProjectFormControls = ProjectFormControls;

  hasTemplateSelected = signal(false);
  selectedTemplate = signal<Project | null>(null);
  isSubmitting = signal(false);
  storageLocations = select(RegionsSelectors.getRegions);
  areStorageLocationsLoading = select(RegionsSelectors.areRegionsLoading);
  affiliations = select(InstitutionsSelectors.getUserInstitutions);

  projectForm = input.required<FormGroup<ProjectForm>>();

  ngOnInit(): void {
    this.actions.fetchUserInstitutions();
    this.actions.fetchRegions();

    this.projectForm()
      .get(ProjectFormControls.Template)
      ?.valueChanges.subscribe((value) => {
        this.hasTemplateSelected.set(!!value);
      });
  }

  institutionsSelected(institutions: Institution[]) {
    this.projectForm()
      .get(ProjectFormControls.Affiliations)
      ?.setValue(institutions.map((inst) => inst.id));
  }

  onTemplateChange(project: Project | null): void {
    if (!project) return;
    this.selectedTemplate.set(project);
    this.projectForm().get(ProjectFormControls.Template)?.setValue(project.id);
    this.hasTemplateSelected.set(!!project);
  }
}
