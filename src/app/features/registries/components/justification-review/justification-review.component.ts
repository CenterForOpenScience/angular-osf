import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { SchemaActionTrigger } from '../../enums';
import { ClearState, DeleteSchemaResponse, HandleSchemaResponse, RegistriesSelectors } from '../../store';
import { ConfirmContinueEditingDialogComponent } from '../confirm-continue-editing-dialog/confirm-continue-editing-dialog.component';

@Component({
  selector: 'osf-justification-review',
  imports: [Button, Card, TranslatePipe, Message, RegistrationBlocksDataComponent],
  templateUrl: './justification-review.component.html',
  styleUrl: './justification-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JustificationReviewComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);

  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly schemaResponse = select(RegistriesSelectors.getSchemaResponse);
  readonly schemaResponseRevisionData = select(RegistriesSelectors.getSchemaResponseRevisionData);
  readonly updatedFields = select(RegistriesSelectors.getUpdatedFields);
  readonly isSchemaResponseLoading = select(RegistriesSelectors.getSchemaResponseLoading);

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  readonly FieldType = FieldType;
  readonly RevisionReviewStates = RevisionReviewStates;

  actions = createDispatchMap({
    deleteSchemaResponse: DeleteSchemaResponse,
    handleSchemaResponse: HandleSchemaResponse,
    clearState: ClearState,
  });

  private readonly revisionId = this.route.snapshot.params['id'];

  get isUnapproved() {
    return this.schemaResponse()?.reviewsState === RevisionReviewStates.Unapproved;
  }

  get inProgress() {
    return this.schemaResponse()?.reviewsState === RevisionReviewStates.RevisionInProgress;
  }

  changes = computed(() => {
    let questions: Record<string, string> = {};
    this.pages().forEach((page) => {
      if (page.sections?.length) {
        questions = {
          ...questions,
          ...Object.fromEntries(
            page.sections.flatMap(
              (section) => section.questions?.map((q) => [q.responseKey, q.displayText || '']) || []
            )
          ),
        };
      } else {
        questions = {
          ...questions,
          ...Object.fromEntries(page.questions?.map((q) => [q.responseKey, q.displayText]) || []),
        };
      }
    });
    const updatedFields = this.updatedFields();
    const updatedResponseKeys = this.schemaResponse()?.updatedResponseKeys || [];
    const uniqueKeys = new Set([...updatedResponseKeys, ...Object.keys(updatedFields)]);
    return Array.from(uniqueKeys).map((key) => questions[key]);
  });

  submit(): void {
    this.actions.handleSchemaResponse(this.revisionId, SchemaActionTrigger.Submit).subscribe({
      next: () => {
        this.toastService.showSuccess('registries.justification.successSubmit');
      },
    });
  }

  goBack(): void {
    const previousStep = this.pages().length;
    this.router.navigate(['../', previousStep], { relativeTo: this.route });
  }

  deleteDraftUpdate() {
    this.customConfirmationService.confirmDelete({
      headerKey: 'registries.justification.confirmDeleteUpdate.header',
      messageKey: 'registries.justification.confirmDeleteUpdate.message',
      onConfirm: () => {
        const registrationId = this.schemaResponse()?.registrationId || '';
        this.actions.deleteSchemaResponse(this.revisionId).subscribe({
          next: () => {
            this.toastService.showSuccess('registries.justification.successDeleteDraft');
            this.actions.clearState();
            this.router.navigateByUrl(`/${registrationId}/overview`);
          },
        });
      },
    });
  }

  acceptChanges() {
    this.actions.handleSchemaResponse(this.revisionId, SchemaActionTrigger.Approve).subscribe({
      next: () => {
        this.toastService.showSuccess('registries.justification.successAccept');
        this.router.navigateByUrl(`/${this.schemaResponse()?.registrationId}/overview`);
      },
    });
  }

  continueEditing() {
    this.customDialogService
      .open(ConfirmContinueEditingDialogComponent, {
        header: 'registries.justification.confirmContinueEditing.header',
        width: '552px',
        data: {
          revisionId: this.revisionId,
        },
      })
      .onClose.subscribe((result) => {
        if (result) {
          this.toastService.showSuccess('registries.justification.decisionRecorded');
        }
      });
  }
}
