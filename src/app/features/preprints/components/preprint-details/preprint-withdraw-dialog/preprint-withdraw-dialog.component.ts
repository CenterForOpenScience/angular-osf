import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';

import { finalize } from 'rxjs';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { formInputLimits } from '@osf/features/preprints/constants';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { getPreprintDocumentType } from '@osf/features/preprints/helpers';
import { PreprintModel, PreprintProviderDetails, PreprintWordGrammar } from '@osf/features/preprints/models';
import { WithdrawPreprint } from '@osf/features/preprints/store/preprint';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';

@Component({
  selector: 'osf-preprint-withdraw-dialog',
  imports: [Button, Message, Textarea, ReactiveFormsModule, TranslatePipe, TitleCasePipe],
  templateUrl: './preprint-withdraw-dialog.component.html',
  styleUrl: './preprint-withdraw-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintWithdrawDialogComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly translateService = inject(TranslateService);
  private readonly environment = inject(ENVIRONMENT);

  readonly dialogRef = inject(DynamicDialogRef);

  readonly supportEmail = this.environment.supportEmail;

  private provider!: PreprintProviderDetails;
  private preprint!: PreprintModel;

  private readonly actions = createDispatchMap({ withdrawPreprint: WithdrawPreprint });

  readonly inputLimits = formInputLimits;
  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  withdrawalJustificationFormControl = new FormControl('', {
    nonNullable: true,
    validators: [
      CustomValidators.requiredTrimmed(),
      Validators.minLength(this.inputLimits.withdrawalJustification.minLength),
    ],
  });

  modalExplanation = signal<string>('');
  withdrawRequestInProgress = signal<boolean>(false);

  documentType: Record<PreprintWordGrammar, string> = {
    singular: '',
    singularCapitalized: '',
    plural: '',
    pluralCapitalized: '',
  };

  ngOnInit() {
    const data = this.config.data;

    if (!data?.provider || !data.preprint) {
      this.modalExplanation.set('');
      return;
    }

    this.provider = data.provider;
    this.preprint = data.preprint;
    this.documentType = getPreprintDocumentType(this.provider, this.translateService);

    this.modalExplanation.set(this.calculateModalExplanation());
  }

  withdraw() {
    if (this.withdrawalJustificationFormControl.invalid || !this.preprint) {
      return;
    }

    const withdrawalJustification = this.withdrawalJustificationFormControl.value;
    this.withdrawRequestInProgress.set(true);

    this.actions
      .withdrawPreprint(this.preprint.id, withdrawalJustification)
      .pipe(finalize(() => this.withdrawRequestInProgress.set(false)))
      .subscribe({
        next: () => this.dialogRef.close(true),
      });
  }

  private calculateModalExplanation() {
    const providerReviewWorkflow = this.provider.reviewsWorkflow;

    switch (providerReviewWorkflow) {
      case ProviderReviewsWorkflow.PreModeration: {
        if (this.preprint.reviewsState === ReviewsState.Pending) {
          return this.translateService.instant('preprints.details.withdrawDialog.preModerationNoticePending', {
            singularPreprintWord: this.documentType.singular,
          });
        } else {
          return this.translateService.instant('preprints.details.withdrawDialog.preModerationNoticeAccepted', {
            singularPreprintWord: this.documentType.singular,
            pluralCapitalizedPreprintWord: this.documentType.pluralCapitalized,
          });
        }
      }
      case ProviderReviewsWorkflow.PostModeration: {
        return this.translateService.instant('preprints.details.withdrawDialog.postModerationNotice', {
          singularPreprintWord: this.documentType.singular,
          pluralCapitalizedPreprintWord: this.documentType.pluralCapitalized,
        });
      }
      default: {
        return this.translateService.instant('preprints.details.withdrawDialog.noModerationNotice', {
          singularPreprintWord: this.documentType.singular,
          pluralCapitalizedPreprintWord: this.documentType.pluralCapitalized,
          supportEmail: this.supportEmail,
        });
      }
    }
  }
}
