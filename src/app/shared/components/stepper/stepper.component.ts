import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { StepOption } from '@shared/models';

import { IconComponent } from '../icon/icon.component';

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

  isStepCompleted = (step: StepOption): boolean => {
    if (this.linear()) {
      return step.index < this.currentStep().index;
    }
    return (
      !step.invalid &&
      !!step.touched &&
      step.index !== this.currentStep().index &&
      (step.index < this.currentStep().index || Boolean(step.touched))
    );
  };

  isStepActive = (step: StepOption): boolean => {
    if (this.linear()) {
      return step.index <= this.currentStep().index;
    }
    return step.index === this.currentStep().index || (!!step.touched && !step.invalid);
  };

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
