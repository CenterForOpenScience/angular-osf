import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { INPUT_VALIDATION_MESSAGES, InputLimits } from '@osf/shared/constants';
import { CustomConfirmationService } from '@osf/shared/services';
import { CustomValidators, findChangedFields } from '@osf/shared/utils';

import { DeleteSchemaResponse, RegistriesSelectors, UpdateSchemaResponse, UpdateStepValidation } from '../../store';

@Component({
  selector: 'osf-justification-step',
  imports: [ReactiveFormsModule, TranslatePipe, Message, Textarea, Button],
  templateUrl: './justification-step.component.html',
  styleUrl: './justification-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JustificationStepComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  protected readonly schemaResponse = select(RegistriesSelectors.getSchemaResponse);

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  protected actions = createDispatchMap({
    updateStepValidation: UpdateStepValidation,
    updateRevision: UpdateSchemaResponse,
    deleteSchemaResponse: DeleteSchemaResponse,
  });

  private readonly revisionId = this.route.snapshot.params['id'];

  justificationForm = this.fb.group({
    justification: ['', [Validators.maxLength(InputLimits.description.maxLength), CustomValidators.requiredTrimmed()]],
  });

  get isJustificationValid(): boolean {
    const control = this.justificationForm.controls['justification'];
    return control.errors?.['required'] && (control.touched || control.dirty);
  }

  constructor() {
    effect(() => {
      const revisionJustification = this.schemaResponse()?.revisionJustification;
      if (revisionJustification) {
        this.justificationForm.patchValue({ justification: revisionJustification });
      }
    });
  }

  submit(): void {
    this.actions
      .updateRevision(this.revisionId, this.justificationForm.value.justification!)
      .pipe(
        tap(() => {
          this.justificationForm.markAllAsTouched();
          this.router.navigate(['../1'], {
            relativeTo: this.route,
            onSameUrlNavigation: 'reload',
          });
        })
      )
      .subscribe();
  }

  deleteDraftUpdate() {
    this.customConfirmationService.confirmDelete({
      headerKey: 'registries.justification.confirmDeleteUpdate.header',
      messageKey: 'registries.justification.confirmDeleteUpdate.message',
      onConfirm: () => {
        const registrationId = this.schemaResponse()?.registrationId || '';
        this.actions.deleteSchemaResponse(this.revisionId).subscribe({
          next: () => {
            this.router.navigateByUrl(`/registries/${registrationId}/overview`);
          },
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.actions.updateStepValidation('0', this.justificationForm.invalid);
    const changes = findChangedFields(
      { justification: this.justificationForm.value.justification! },
      { justification: this.schemaResponse()?.revisionJustification }
    );
    if (Object.keys(changes).length > 0) {
      this.actions.updateRevision(this.revisionId, this.justificationForm.value.justification!);
    }
    this.justificationForm.markAllAsTouched();
  }
}
