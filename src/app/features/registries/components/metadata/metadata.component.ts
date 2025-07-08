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
import { Subject } from '@osf/shared/models';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';
import { CustomValidators, findChangedFields } from '@osf/shared/utils';

import { Registration } from '../../models';
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
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  private readonly draftId = this.route.snapshot.params['id'];
  protected readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  protected selectedSubjects = select(RegistriesSelectors.getSelectedSubjects);

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
    // contributors: [[], Validators.required],
    subjects: [[] as Subject[], Validators.required],
    tags: [[]],
    license: this.fb.group({
      id: ['', Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const draft = this.draftRegistration();
      if (draft) {
        this.initForm(draft);
      }
    });

    effect(() => {
      const subjects = this.selectedSubjects();
      if (subjects) {
        this.metadataForm.patchValue({ subjects });
      }
    });
  }

  private initForm(data: Registration): void {
    this.metadataForm.patchValue({
      title: data.title,
      description: data.description,
      license: data.license,
    });
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
        this.actions.deleteDraft(this.draftId).subscribe({
          next: () => {
            this.router.navigateByUrl('/registries/new');
          },
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.actions.updateStepValidation('0', this.metadataForm.invalid);
    const changedFields = findChangedFields(
      { title: this.metadataForm.value.title!, description: this.metadataForm.value.description! },
      { title: this.draftRegistration()?.title, description: this.draftRegistration()?.description }
    );
    if (Object.keys(changedFields).length > 0) {
      this.metadataForm.markAllAsTouched();
      this.actions.updateDraft(this.draftId, changedFields);
    }
  }
}
