import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
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
  private readonly destroyRef = inject(DestroyRef);

  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly schemaResponse = select(RegistriesSelectors.getSchemaResponse);
  readonly schemaResponseRevisionData = select(RegistriesSelectors.getSchemaResponseRevisionData);
  readonly updatedFields = select(RegistriesSelectors.getUpdatedFields);
  readonly isSchemaResponseLoading = select(RegistriesSelectors.getSchemaResponseLoading);

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  private readonly actions = createDispatchMap({
    deleteSchemaResponse: DeleteSchemaResponse,
    handleSchemaResponse: HandleSchemaResponse,
    clearState: ClearState,
  });

  private readonly revisionId = this.route.snapshot.params['id'];

  readonly isUnapproved = computed(() => this.schemaResponse()?.reviewsState === RevisionReviewStates.Unapproved);
  readonly inProgress = computed(() => this.schemaResponse()?.reviewsState === RevisionReviewStates.RevisionInProgress);

  changes = computed(() => {
    const questions = this.buildQuestionMap();
    const updatedResponseKeys = this.schemaResponse()?.updatedResponseKeys || [];
    const uniqueKeys = new Set([...updatedResponseKeys, ...Object.keys(this.updatedFields())]);
    return Array.from(uniqueKeys).map((key) => questions[key]);
  });

  submit(): void {
    this.actions
      .handleSchemaResponse(this.revisionId, SchemaActionTrigger.Submit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.showSuccess('registries.justification.successSubmit');
      });
  }

  goBack(): void {
    this.router.navigate(['../', this.pages().length], { relativeTo: this.route });
  }

  deleteDraftUpdate() {
    this.customConfirmationService.confirmDelete({
      headerKey: 'registries.justification.confirmDeleteUpdate.header',
      messageKey: 'registries.justification.confirmDeleteUpdate.message',
      onConfirm: () => {
        const registrationId = this.schemaResponse()?.registrationId || '';
        this.actions
          .deleteSchemaResponse(this.revisionId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.toastService.showSuccess('registries.justification.successDeleteDraft');
            this.actions.clearState();
            this.router.navigateByUrl(`/${registrationId}/overview`);
          });
      },
    });
  }

  acceptChanges() {
    this.actions
      .handleSchemaResponse(this.revisionId, SchemaActionTrigger.Approve)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.showSuccess('registries.justification.successAccept');
        this.router.navigateByUrl(`/${this.schemaResponse()?.registrationId}/overview`);
      });
  }

  continueEditing() {
    this.customDialogService
      .open(ConfirmContinueEditingDialogComponent, {
        header: 'registries.justification.confirmContinueEditing.header',
        width: '552px',
        data: { revisionId: this.revisionId },
      })
      .onClose.pipe(
        filter((result) => !!result),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.toastService.showSuccess('registries.justification.decisionRecorded'));
  }

  private buildQuestionMap(): Record<string, string> {
    return Object.fromEntries(
      this.pages().flatMap((page) => {
        const questions = page.sections?.length
          ? page.sections.flatMap((section) => section.questions || [])
          : page.questions || [];
        return questions.map((q) => [q.responseKey, q.displayText || '']);
      })
    );
  }
}
