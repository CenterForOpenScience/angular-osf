import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TextInputComponent } from '@osf/shared/components';
import { INPUT_VALIDATION_MESSAGES, InputLimits } from '@osf/shared/constants';
import { ContributorModel, SubjectModel } from '@osf/shared/models';
import { DraftRegistrationModel } from '@osf/shared/models/registration';
import { CustomConfirmationService } from '@osf/shared/services';
import { ContributorsSelectors, SubjectsSelectors } from '@osf/shared/stores';
import { CustomValidators, findChangedFields } from '@osf/shared/utils';

import { DeleteDraft, RegistriesSelectors, UpdateDraft, UpdateStepValidation } from '../../store';

import { ContributorsComponent } from './contributors/contributors.component';
import { RegistriesLicenseComponent } from './registries-license/registries-license.component';
import { RegistriesSubjectsComponent } from './registries-subjects/registries-subjects.component';
import { RegistriesTagsComponent } from './registries-tags/registries-tags.component';

@Component({
  selector: 'osf-metadata',
  imports: [
    Card,
    TextInputComponent,
    ReactiveFormsModule,
    Button,
    TranslatePipe,
    TextareaModule,
    ContributorsComponent,
    RegistriesSubjectsComponent,
    RegistriesTagsComponent,
    RegistriesLicenseComponent,
    Message,
  ],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  private readonly draftId = this.route.snapshot.params['id'];
  protected readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  protected selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  protected initialContributors = select(ContributorsSelectors.getContributors);
  protected stepsValidation = select(RegistriesSelectors.getStepsValidation);

  protected actions = createDispatchMap({
    deleteDraft: DeleteDraft,
    updateDraft: UpdateDraft,
    updateStepValidation: UpdateStepValidation,
  });
  protected inputLimits = InputLimits;
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
    if (this.stepsValidation()?.[0]?.invalid) {
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
            // [NM] TODO: clear validation state
            this.isDraftDeleted = true;
            this.router.navigateByUrl(`/registries/${providerId}/new`);
          },
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (!this.isDraftDeleted) {
      this.actions.updateStepValidation('0', this.metadataForm.invalid);
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
