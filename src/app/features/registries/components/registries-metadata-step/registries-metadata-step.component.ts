import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TextInputComponent } from '@osf/shared/components';
import { INPUT_VALIDATION_MESSAGES, InputLimits } from '@osf/shared/constants';
import { CustomValidators, findChangedFields } from '@osf/shared/helpers';
import { ContributorModel, DraftRegistrationModel, SubjectModel } from '@osf/shared/models';
import { CustomConfirmationService } from '@osf/shared/services';
import { ContributorsSelectors, SubjectsSelectors } from '@osf/shared/stores';
import { UserPermissions } from '@shared/enums';

import { ClearState, DeleteDraft, RegistriesSelectors, UpdateDraft, UpdateStepState } from '../../store';

import { RegistriesAffiliatedInstitutionComponent } from './registries-affiliated-institution/registries-affiliated-institution.component';
import { RegistriesContributorsComponent } from './registries-contributors/registries-contributors.component';
import { RegistriesLicenseComponent } from './registries-license/registries-license.component';
import { RegistriesSubjectsComponent } from './registries-subjects/registries-subjects.component';
import { RegistriesTagsComponent } from './registries-tags/registries-tags.component';

@Component({
  selector: 'osf-registries-metadata-step',
  imports: [
    Card,
    TextInputComponent,
    ReactiveFormsModule,
    Button,
    TranslatePipe,
    TextareaModule,
    RegistriesContributorsComponent,
    RegistriesSubjectsComponent,
    RegistriesTagsComponent,
    RegistriesLicenseComponent,
    RegistriesAffiliatedInstitutionComponent,
    Message,
  ],
  templateUrl: './registries-metadata-step.component.html',
  styleUrl: './registries-metadata-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesMetadataStepComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  readonly titleLimit = InputLimits.title.maxLength;

  private readonly draftId = this.route.snapshot.params['id'];
  readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  initialContributors = select(ContributorsSelectors.getContributors);
  stepsState = select(RegistriesSelectors.getStepsState);

  hasAdminAccess = computed(() => {
    const registry = this.draftRegistration();
    if (!registry) return false;
    return registry.currentUserPermissions.includes(UserPermissions.Admin);
  });

  actions = createDispatchMap({
    deleteDraft: DeleteDraft,
    updateDraft: UpdateDraft,
    updateStepState: UpdateStepState,
    clearState: ClearState,
  });

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  metadataForm = this.fb.group({
    title: ['', CustomValidators.requiredTrimmed()],
    description: ['', CustomValidators.requiredTrimmed()],
    contributors: [[] as ContributorModel[], Validators.required],
    subjects: [[] as SubjectModel[], Validators.required],
    tags: [[]],
    license: this.fb.group({
      id: ['', Validators.required],
    }),
  });

  isDraftDeleted = false;
  isFormUpdated = false;

  constructor() {
    effect(() => {
      const draft = this.draftRegistration();
      // TODO: This shouldn't be an effect()
      if (draft && !this.isFormUpdated) {
        this.updateFormValue(draft);
        this.isFormUpdated = true;
      }
    });
  }

  private updateFormValue(data: DraftRegistrationModel): void {
    this.metadataForm.patchValue({
      title: data.title,
      description: data.description,
      license: data.license,
      contributors: this.initialContributors(),
      subjects: this.selectedSubjects(),
    });
    if (this.stepsState()?.[0]?.invalid) {
      this.metadataForm.markAllAsTouched();
    }
  }

  submitMetadata(): void {
    this.actions
      .updateDraft(this.draftId, {
        title: this.metadataForm.value.title?.trim(),
        description: this.metadataForm.value.description?.trim(),
      })
      .pipe(
        tap(() => {
          this.metadataForm.markAllAsTouched();
          this.router.navigate(['../1'], {
            relativeTo: this.route,
            onSameUrlNavigation: 'reload',
          });
        })
      )
      .subscribe();
  }

  deleteDraft(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'registries.deleteDraft',
      messageKey: 'registries.confirmDeleteDraft',
      onConfirm: () => {
        const providerId = this.draftRegistration()?.providerId;
        this.actions.deleteDraft(this.draftId).subscribe({
          next: () => {
            this.isDraftDeleted = true;
            this.actions.clearState();
            this.router.navigateByUrl(`/registries/${providerId}/new`);
          },
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (!this.isDraftDeleted) {
      this.actions.updateStepState('0', this.metadataForm.invalid, true);
      const changedFields = findChangedFields(
        { title: this.metadataForm.value.title!, description: this.metadataForm.value.description! },
        { title: this.draftRegistration()?.title, description: this.draftRegistration()?.description }
      );
      if (Object.keys(changedFields).length > 0) {
        this.actions.updateDraft(this.draftId, changedFields);
        this.metadataForm.markAllAsTouched();
      }
    }
  }
}
