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
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { StringOrNull } from '@core/helpers';
import { ArrayInputComponent } from '@osf/features/preprints/components/stepper/author-assertion-step/array-input/array-input.component';
import { formInputLimits } from '@osf/features/preprints/constants';
import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { SubmitPreprintSelectors, UpdatePreprint } from '@osf/features/preprints/store/submit-preprint';
import { INPUT_VALIDATION_MESSAGES } from '@shared/constants';
import { ToastService } from '@shared/services';
import { CustomValidators } from '@shared/utils';

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
    ArrayInputComponent,
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

  readonly CustomValidators = CustomValidators;
  readonly ApplicabilityStatus = ApplicabilityStatus;
  readonly inputLimits = formInputLimits;
  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
  readonly preregLinkOptions = Object.entries(PreregLinkInfo).map(([key, value]) => ({
    label: key,
    value,
  }));
  readonly linkValidators = [CustomValidators.linkValidator(), CustomValidators.requiredTrimmed()];

  createdPreprint = select(SubmitPreprintSelectors.getCreatedPreprint);
  isUpdatingPreprint = select(SubmitPreprintSelectors.isPreprintSubmitting);

  readonly authorAssertionsForm = new FormGroup({
    hasCoi: new FormControl<boolean>(this.createdPreprint()!.hasCoi || false, {
      nonNullable: true,
      validators: [],
    }),
    coiStatement: new FormControl<StringOrNull>(this.createdPreprint()!.coiStatement, {
      nonNullable: false,
      validators: [],
    }),
    hasDataLinks: new FormControl<ApplicabilityStatus>(
      this.createdPreprint()!.hasDataLinks || ApplicabilityStatus.NotApplicable,
      {
        nonNullable: true,
        validators: [],
      }
    ),
    dataLinks: new FormArray<FormControl>(
      this.createdPreprint()!.dataLinks?.map((link) => new FormControl(link)) || []
    ),
    whyNoData: new FormControl<StringOrNull>(this.createdPreprint()!.whyNoData, {
      nonNullable: false,
      validators: [],
    }),
    hasPreregLinks: new FormControl<ApplicabilityStatus>(
      this.createdPreprint()!.hasPreregLinks || ApplicabilityStatus.NotApplicable,
      {
        nonNullable: true,
        validators: [],
      }
    ),
    preregLinks: new FormArray<FormControl>(
      this.createdPreprint()!.preregLinks?.map((link) => new FormControl(link)) || []
    ),
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
    initialValue: this.createdPreprint()!.hasCoi || false,
  });
  hasDataLinks = toSignal(this.authorAssertionsForm.controls['hasDataLinks'].valueChanges, {
    initialValue: this.createdPreprint()!.hasDataLinks || ApplicabilityStatus.NotApplicable,
  });
  hasPreregLinks = toSignal(this.authorAssertionsForm.controls['hasPreregLinks'].valueChanges, {
    initialValue: this.createdPreprint()!.hasPreregLinks || ApplicabilityStatus.NotApplicable,
  });

  nextClicked = output<void>();

  constructor() {
    effect(() => {
      const hasCoi = this.hasCoiValue();
      const coiStatementControl = this.authorAssertionsForm.controls['coiStatement'];

      if (hasCoi) {
        this.enableAndSetValidators(coiStatementControl, [Validators.required]);
      } else {
        this.disableAndClearValidators(coiStatementControl);
      }

      coiStatementControl.updateValueAndValidity();
    });

    effect(() => {
      const hasDataLinks = this.hasDataLinks();
      const whyNoDataControl = this.authorAssertionsForm.controls['whyNoData'];
      const dataLinksControl = this.authorAssertionsForm.controls['dataLinks'];

      switch (hasDataLinks) {
        case ApplicabilityStatus.Unavailable:
          this.enableAndSetValidators(whyNoDataControl, [Validators.required]);
          this.disableAndClearValidators(dataLinksControl);
          break;
        case ApplicabilityStatus.NotApplicable:
          this.disableAndClearValidators(whyNoDataControl);
          this.disableAndClearValidators(dataLinksControl);
          break;
        case ApplicabilityStatus.Applicable:
          this.disableAndClearValidators(whyNoDataControl);
          this.addAtLeastOneControl(dataLinksControl);
          break;
      }
      whyNoDataControl.updateValueAndValidity();
      dataLinksControl.updateValueAndValidity();
    });

    effect(() => {
      const hasPreregLinks = this.hasPreregLinks();
      const whyNoPreregControl = this.authorAssertionsForm.controls['whyNoPrereg'];
      const preregLinkInfoControl = this.authorAssertionsForm.controls['preregLinkInfo'];
      const preregLinksControl = this.authorAssertionsForm.controls['preregLinks'];

      switch (hasPreregLinks) {
        case ApplicabilityStatus.Unavailable:
          this.enableAndSetValidators(whyNoPreregControl, [Validators.required]);
          this.disableAndClearValidators(preregLinkInfoControl);
          this.disableAndClearValidators(preregLinksControl);
          break;
        case ApplicabilityStatus.NotApplicable:
          this.disableAndClearValidators(whyNoPreregControl);
          this.disableAndClearValidators(preregLinkInfoControl);
          this.disableAndClearValidators(preregLinksControl);
          break;
        case ApplicabilityStatus.Applicable:
          this.disableAndClearValidators(whyNoPreregControl);
          this.enableAndSetValidators(preregLinkInfoControl, [Validators.required]);
          this.addAtLeastOneControl(preregLinksControl);
          break;
      }
      whyNoPreregControl.updateValueAndValidity();
      preregLinkInfoControl.updateValueAndValidity();
      preregLinksControl.updateValueAndValidity();
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
    const dataLinks: string[] = formValue.dataLinks || [];

    const hasPreregLinks = formValue.hasPreregLinks;
    const whyNoPrereg = formValue.whyNoPrereg || null;
    const preregLinks: string[] = formValue.preregLinks || [];
    const preregLinkInfo = formValue.preregLinkInfo || undefined;

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

  private disableAndClearValidators(control: AbstractControl) {
    if (control instanceof FormArray) {
      while (control.length !== 0) {
        control.removeAt(0);
      }
      return;
    }

    control.clearValidators();
    control.setValue(null);
    control.disable();
  }

  private enableAndSetValidators(control: AbstractControl, validators: ValidatorFn[]) {
    control.setValidators(validators);
    control.enable();
  }

  private addAtLeastOneControl(formArray: FormArray) {
    if (formArray.controls.length > 0) return;

    formArray.push(
      new FormControl('', {
        nonNullable: true,
        validators: this.linkValidators,
      })
    );
  }
}
