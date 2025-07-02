import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { IconComponent } from '@shared/components';
import { StepOption } from '@shared/models';

@Component({
  selector: 'osf-stepper',
  imports: [IconComponent, TranslatePipe],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  steps = input.required<StepOption[]>();
  currentStep = model.required<number>();
  linear = input<boolean>(true);

  onStepClick(step: number) {
    if (step === this.currentStep()) {
      return;
    }

    if (this.linear() && step > this.currentStep()) {
      return;
    }

    this.currentStep.set(step);
  }
}
