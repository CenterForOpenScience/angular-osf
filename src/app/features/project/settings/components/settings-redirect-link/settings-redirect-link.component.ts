import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/helpers';

import { RedirectLinkDataModel, RedirectLinkForm } from '../../models';

@Component({
  selector: 'osf-settings-redirect-link',
  imports: [Card, Checkbox, TranslatePipe, ReactiveFormsModule, TextInputComponent, Button],
  templateUrl: './settings-redirect-link.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsRedirectLinkComponent {
  private readonly destroyRef = inject(DestroyRef);

  redirectUrlDataInput = input.required<RedirectLinkDataModel>();
  redirectUrlDataChange = output<RedirectLinkDataModel>();

  inputLimits = InputLimits;

  redirectForm = new FormGroup<RedirectLinkForm>({
    isEnabled: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    url: new FormControl('', [CustomValidators.requiredTrimmed(), CustomValidators.linkValidator()]),
    label: new FormControl('', [CustomValidators.requiredTrimmed()]),
  });

  constructor() {
    this.setupFormSubscriptions();
    this.setupInputEffects();
  }

  private setupFormSubscriptions(): void {
    this.redirectForm.controls.isEnabled?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isEnabled) => {
        if (!isEnabled) {
          this.redirectForm.get('url')?.setValue('');
          this.redirectForm.get('label')?.setValue('');
          this.emitFormData();
        }
      });
  }

  saveRedirectSettings(): void {
    if (this.redirectForm.valid) {
      this.emitFormData();
    }
  }

  private setupInputEffects(): void {
    effect(() => {
      const inputData = this.redirectUrlDataInput();
      this.redirectForm.patchValue(
        {
          isEnabled: inputData.isEnabled,
          url: inputData.url,
          label: inputData.label,
        },
        { emitEvent: false }
      );

      this.redirectForm.markAsPristine();
    });
  }

  get hasChanges(): boolean {
    return this.redirectForm.dirty;
  }

  private emitFormData(): void {
    const formValue = this.redirectForm.value;
    this.redirectUrlDataChange.emit({
      isEnabled: formValue.isEnabled || false,
      url: formValue.url || '',
      label: formValue.label || '',
    });
  }
}
