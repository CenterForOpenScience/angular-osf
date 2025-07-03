import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { RadioButton } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostListener, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { StringOrNull } from '@core/helpers';
import { formInputLimits } from '@osf/features/preprints/constants';
import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { SubmitPreprintSelectors, UpdatePreprint } from '@osf/features/preprints/store/submit-preprint';
import { INPUT_VALIDATION_MESSAGES } from '@shared/constants';
import { ToastService } from '@shared/services';

@Component({
  selector: 'osf-author-assertions-step',
  imports: [
    Card,
    FormsModule,
    RadioButton,
    ReactiveFormsModule,
    Textarea,
    Message,
    TranslatePipe,
    NgClass,
    Button,
    Tooltip,
    Select,
  ],
  templateUrl: './author-assertions-step.component.html',
  styleUrl: './author-assertions-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorAssertionsStepComponent {
  private toastService = inject(ToastService);
  private actions = createDispatchMap({
    updatePreprint: UpdatePreprint,
  });

  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly inputLimits = formInputLimits;
  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  readonly preregLinkOptions = Object.entries(PreregLinkInfo).map(([key, value]) => ({
    label: key,
    value,
  }));

  createdPreprint = select(SubmitPreprintSelectors.getCreatedPreprint);
  isUpdatingPreprint = select(SubmitPreprintSelectors.isPreprintSubmitting);

  readonly authorAssertionsForm = new FormGroup({
    hasCoi: new FormControl<boolean>(this.createdPreprint()!.hasCoi, {
      nonNullable: true,
      validators: [],
    }),
    coiStatement: new FormControl<StringOrNull>(this.createdPreprint()!.coiStatement, {
      nonNullable: false,
      validators: [],
    }),
    hasDataLinks: new FormControl<ApplicabilityStatus>(this.createdPreprint()!.hasDataLinks, {
      nonNullable: true,
      validators: [],
    }),
    whyNoData: new FormControl<StringOrNull>(this.createdPreprint()!.whyNoData, {
      nonNullable: false,
      validators: [],
    }),
    hasPreregLinks: new FormControl<ApplicabilityStatus>(this.createdPreprint()!.hasPreregLinks, {
      nonNullable: true,
      validators: [],
    }),
    whyNoPrereg: new FormControl<StringOrNull>(this.createdPreprint()!.whyNoPrereg, {
      nonNullable: false,
      validators: [],
    }),
    preregLinkInfo: new FormControl<PreregLinkInfo | null>(this.createdPreprint()!.preregLinkInfo, {
      nonNullable: false,
      validators: [],
    }),
  });

  hasCoiValue = toSignal(this.authorAssertionsForm.controls['hasCoi'].valueChanges, {
    initialValue: this.createdPreprint()!.hasCoi,
  });
  hasDataLinks = toSignal(this.authorAssertionsForm.controls['hasDataLinks'].valueChanges, {
    initialValue: this.createdPreprint()!.hasDataLinks,
  });
  hasPreregLinks = toSignal(this.authorAssertionsForm.controls['hasPreregLinks'].valueChanges, {
    initialValue: this.createdPreprint()!.hasPreregLinks,
  });

  nextClicked = output<void>();

  constructor() {
    effect(() => {
      const hasCoi = this.hasCoiValue();
      const coiStatementControl = this.authorAssertionsForm.controls['coiStatement'];

      if (hasCoi) {
        coiStatementControl.setValidators([Validators.required]);
        coiStatementControl.enable();
      } else {
        coiStatementControl.clearValidators();
        coiStatementControl.setValue(null);
        coiStatementControl.disable();
      }

      coiStatementControl.updateValueAndValidity();
    });

    effect(() => {
      const hasDataLinks = this.hasDataLinks();
      const whyNoDataControl = this.authorAssertionsForm.controls['whyNoData'];

      switch (hasDataLinks) {
        case ApplicabilityStatus.Unavailable:
          whyNoDataControl.setValidators([Validators.required]);
          whyNoDataControl.enable();
          break;
        case ApplicabilityStatus.NotApplicable:
          whyNoDataControl.clearValidators();
          whyNoDataControl.setValue(null);
          whyNoDataControl.disable();
          break;
        case ApplicabilityStatus.Applicable:
          whyNoDataControl.clearValidators();
          whyNoDataControl.setValue(null);
          whyNoDataControl.disable();
          break;
      }
      whyNoDataControl.updateValueAndValidity();
    });

    effect(() => {
      const hasDataLinks = this.hasPreregLinks();
      const whyNoPreregControl = this.authorAssertionsForm.controls['whyNoPrereg'];
      const preregLinkInfoControl = this.authorAssertionsForm.controls['preregLinkInfo'];

      switch (hasDataLinks) {
        case ApplicabilityStatus.Unavailable:
          whyNoPreregControl.setValidators([Validators.required]);
          whyNoPreregControl.enable();

          preregLinkInfoControl.clearValidators();
          preregLinkInfoControl.setValue(null);
          break;
        case ApplicabilityStatus.NotApplicable:
          whyNoPreregControl.clearValidators();
          whyNoPreregControl.setValue(null);
          whyNoPreregControl.disable();

          preregLinkInfoControl.clearValidators();
          preregLinkInfoControl.setValue(null);
          break;
        case ApplicabilityStatus.Applicable:
          whyNoPreregControl.clearValidators();
          whyNoPreregControl.setValue(null);
          whyNoPreregControl.disable();

          preregLinkInfoControl.setValidators([Validators.required]);
          break;
      }
      whyNoPreregControl.updateValueAndValidity();
      preregLinkInfoControl.updateValueAndValidity();
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }

  nextButtonClicked() {
    const formValue = this.authorAssertionsForm.value;

    const hasCoi = formValue.hasCoi;
    const coiStatement = formValue.coiStatement || null;

    const hasDataLinks = formValue.hasDataLinks;
    const whyNoData = formValue.whyNoData || null;
    const dataLinks: string[] = [];

    const hasPreregLinks = formValue.hasPreregLinks;
    const whyNoPrereg = formValue.whyNoPrereg || null;
    const preregLinks: string[] = [];
    const preregLinkInfo = formValue.preregLinkInfo;

    this.actions
      .updatePreprint(this.createdPreprint()!.id, {
        hasCoi,
        coiStatement,
        hasDataLinks,
        whyNoData,
        dataLinks,
        hasPreregLinks,
        whyNoPrereg,
        preregLinks,
        preregLinkInfo,
      })
      .subscribe({
        complete: () => {
          this.toastService.showSuccess('Preprint saved successfully.');
          this.nextClicked.emit();
        },
      });
  }
}
