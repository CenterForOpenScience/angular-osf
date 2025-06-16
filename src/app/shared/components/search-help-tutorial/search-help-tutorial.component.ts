import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';

import { SEARCH_TUTORIAL_STEPS } from '@osf/shared/constants';
import { TutorialStep } from '@osf/shared/models';

@Component({
  selector: 'osf-search-help-tutorial',
  imports: [Button, TranslateModule, CommonModule],
  templateUrl: './search-help-tutorial.component.html',
  styleUrl: './search-help-tutorial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchHelpTutorialComponent {
  currentStep = model(0);

  steps = signal(SEARCH_TUTORIAL_STEPS);

  skip() {
    this.currentStep.set(0);
  }

  nextStep() {
    const nextStepIndex = this.currentStep() + 1;

    if (nextStepIndex > this.steps().length) {
      this.currentStep.set(0);
    } else {
      this.currentStep.set(nextStepIndex);
    }
  }

  getStepPosition(step: TutorialStep) {
    return step.position || {};
  }
}
