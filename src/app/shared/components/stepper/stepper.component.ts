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
  currentStep = model.required<StepOption>();
  linear = input<boolean>(true);

  onStepClick(step: StepOption) {
    if (step.index === this.currentStep().index) {
      return;
    }

    if (this.linear() && step.index > this.currentStep().index) {
      return;
    }

    this.currentStep.set(step);
  }
}
