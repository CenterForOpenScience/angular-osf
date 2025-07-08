import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ProjectFormControls } from '@osf/shared/enums';
import { IdName, ProjectForm } from '@osf/shared/models';
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
    NgOptimizedImage,
    TranslatePipe,
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

  templates = input.required<IdName[]>();

  ProjectFormControls = ProjectFormControls;

  hasTemplateSelected = signal(false);
  isSubmitting = signal(false);
  storageLocations = select(RegionsSelectors.getRegions);
  areStorageLocationsLoading = select(RegionsSelectors.areRegionsLoading);
  affiliations = select(InstitutionsSelectors.getUserInstitutions);

  projectForm = input.required<FormGroup<ProjectForm>>();

  ngOnInit(): void {
    this.actions.fetchUserInstitutions();
    this.actions.fetchRegions();

    this.selectAllAffiliations();

    this.projectForm()
      .get(ProjectFormControls.Template)
      ?.valueChanges.subscribe((value) => {
        this.hasTemplateSelected.set(!!value);
      });
  }

  selectAllAffiliations(): void {
    const allAffiliationValues = this.affiliations().map((aff) => aff.id);
    this.projectForm().get(ProjectFormControls.Affiliations)?.setValue(allAffiliationValues);
  }

  removeAllAffiliations(): void {
    this.projectForm().get(ProjectFormControls.Affiliations)?.setValue([]);
  }
}
