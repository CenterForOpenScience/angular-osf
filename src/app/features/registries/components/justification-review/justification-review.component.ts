import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
import { RevisionReviewStates } from '@osf/shared/enums';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';

import { FieldType, SchemaActionTrigger } from '../../enums';
import { DeleteSchemaResponse, HandleSchemaResponse, RegistriesSelectors } from '../../store';
import { ConfirmContinueEditingDialogComponent } from '../confirm-continue-editing-dialog/confirm-continue-editing-dialog.component';
import { ReviewDataComponent } from '../review-data/review-data.component';

@Component({
  selector: 'osf-justification-review',
  imports: [Button, Card, TranslatePipe, Message, ReviewDataComponent],
  templateUrl: './justification-review.component.html',
  styleUrl: './justification-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class JustificationReviewComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);

  protected readonly pages = select(RegistriesSelectors.getPagesSchema);
  protected readonly schemaResponse = select(RegistriesSelectors.getSchemaResponse);
  protected readonly schemaResponseRevisionData = select(RegistriesSelectors.getSchemaResponseRevisionData);
  protected readonly updatedFields = select(RegistriesSelectors.getUpdatedFields);
  protected readonly isSchemaResponseLoading = select(RegistriesSelectors.getSchemaResponseLoading);

  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  protected readonly FieldType = FieldType;
  protected readonly RevisionReviewStates = RevisionReviewStates;

  protected actions = createDispatchMap({
    deleteSchemaResponse: DeleteSchemaResponse,
    handleSchemaResponse: HandleSchemaResponse,
  });

  private readonly revisionId = this.route.snapshot.params['id'];

  changes = computed(() => {
    return Object.keys(this.updatedFields());
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
            this.router.navigateByUrl(`/registries/${registrationId}/overview`);
          },
        });
      },
    });
  }

  acceptChanges() {
    this.actions.handleSchemaResponse(this.revisionId, SchemaActionTrigger.Approve).subscribe({
      next: () => {
        this.toastService.showSuccess('registries.justification.successAccept');
        this.router.navigateByUrl(`/registries/${this.schemaResponse()?.registrationId}/overview`);
      },
    });
  }

  continueEditing() {
    this.dialogService
      .open(ConfirmContinueEditingDialogComponent, {
        width: '552px',
        header: this.translateService.instant('registries.justification.confirmContinueEditing.header'),
        focusOnShow: false,
        closeOnEscape: true,
        modal: true,
      })
      .onClose.subscribe((result) => {
        if (result) {
          this.toastService.showSuccess('registries.justification.decisionRecorded');
        }
      });
  }
}
