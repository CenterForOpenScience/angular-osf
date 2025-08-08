import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { formInputLimits } from '@osf/features/preprints/constants';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { getPreprintDocumentType } from '@osf/features/preprints/helpers';
import { Preprint, PreprintProviderDetails } from '@osf/features/preprints/models';
import { WithdrawPreprint } from '@osf/features/preprints/store/preprint';
import { INPUT_VALIDATION_MESSAGES } from '@shared/constants';
import { CustomValidators } from '@shared/utils';

@Component({
  selector: 'osf-withdraw-dialog',
  imports: [Textarea, ReactiveFormsModule, Message, TranslatePipe, Button, TitleCasePipe],
  templateUrl: './withdraw-dialog.component.html',
  styleUrl: './withdraw-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawDialogComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly translateService = inject(TranslateService);
  readonly dialogRef = inject(DynamicDialogRef);

  private provider!: PreprintProviderDetails;
  private preprint!: Preprint;

  private actions = createDispatchMap({
    withdrawPreprint: WithdrawPreprint,
  });

  protected inputLimits = formInputLimits;
  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  withdrawalJustificationFormControl = new FormControl('', {
    nonNullable: true,
    validators: [
      CustomValidators.requiredTrimmed(),
      Validators.minLength(this.inputLimits.withdrawalJustification.minLength),
    ],
  });
  modalExplanation = signal<string>('');
  withdrawRequestInProgress = signal<boolean>(false);

  public ngOnInit() {
    this.provider = this.config.data.provider;
    this.preprint = this.config.data.preprint;

    this.modalExplanation.set(this.calculateModalExplanation());
  }

  withdraw() {
    if (this.withdrawalJustificationFormControl.invalid) {
      return;
    }

    const withdrawalJustification = this.withdrawalJustificationFormControl.value;
    this.withdrawRequestInProgress.set(true);
    this.actions.withdrawPreprint(this.preprint.id, withdrawalJustification).subscribe({
      complete: () => {
        this.withdrawRequestInProgress.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.withdrawRequestInProgress.set(false);
      },
    });
  }

  private calculateModalExplanation() {
    const providerReviewWorkflow = this.provider.reviewsWorkflow;
    const documentType = getPreprintDocumentType(this.provider, this.translateService);
    //[RNi] TODO: maybe extract to env, also see static pages
    const supportEmail = 'support@osf.io';

    switch (providerReviewWorkflow) {
      case ProviderReviewsWorkflow.PreModeration: {
        if (this.preprint.reviewsState === ReviewsState.Pending) {
          return this.translateService.instant(
            'Since this version is still pending approval and private, it can be withdrawn immediately. ' +
              'The reason of withdrawal will be visible to service moderators. Once withdrawn, the {{singularPreprintWord}} ' +
              'will remain private and never be made public.',
            {
              singularPreprintWord: documentType.singular,
            }
          );
        } else
          return this.translateService.instant(
            '<strong>{{pluralCapitalizedPreprintWord}} are a permanent part of the scholarly record.' +
              ' Withdrawal requests are subject to this service’s policy on {{singularPreprintWord}} version' +
              ' removal and at the discretion of the moderators.</strong><br>This service uses pre-moderation. ' +
              'This request will be submitted to service moderators for review. If the request is approved, this ' +
              '{singularPreprintWord} version will be replaced by a tombstone page with metadata and the reason ' +
              'for withdrawal. This {singularPreprintWord} version will still be searchable by other users after removal.',
            {
              singularPreprintWord: documentType.singular,
              pluralCapitalizedPreprintWord: documentType.pluralCapitalized,
            }
          );
      }
      case ProviderReviewsWorkflow.PostModeration: {
        return this.translateService.instant(
          '<strong>{pluralCapitalizedPreprintWord} are a permanent part of the scholarly record. ' +
            'Withdrawal requests are subject to this service’s policy on {singularPreprintWord} version ' +
            'removal and at the discretion of the moderators.</strong><br>This service uses post-moderation.' +
            ' This request will be submitted to service moderators for review. If the request is approved, this ' +
            '{singularPreprintWord} version will be replaced by a tombstone page with metadata and the reason for' +
            ' withdrawal. This {singularPreprintWord} version will still be searchable by other users after removal.',
          {
            singularPreprintWord: documentType.singular,
            pluralCapitalizedPreprintWord: documentType.pluralCapitalized,
          }
        );
      }
      default: {
        return this.translateService.instant(
          '<strong>{pluralCapitalizedPreprintWord} are a permanent part of the scholarly record. ' +
            'Withdrawal requests are subject to this service’s policy on {singularPreprintWord} version removal' +
            ' and at the discretion of the moderators.</strong><br>This request will be submitted to' +
            ' <a href="mailto:{supportEmail}" target="_blank">{supportEmail}</a> for review and removal.' +
            ' If the request is approved, this {singularPreprintWord} version will be replaced by a tombstone' +
            ' page with metadata and the reason for withdrawal. This {singularPreprintWord} version will still be ' +
            'searchable by other users after removal.',
          {
            singularPreprintWord: documentType.singular,
            pluralCapitalizedPreprintWord: documentType.pluralCapitalized,
            supportEmail,
          }
        );
      }
    }
  }
}
