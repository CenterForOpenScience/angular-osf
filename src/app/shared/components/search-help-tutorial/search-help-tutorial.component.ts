import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SEARCH_TUTORIAL_STEPS } from '@osf/shared/constants/search-tutorial-steps.const';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { TutorialStep } from '@shared/models/tutorial-step.model';

@Component({
  selector: 'osf-search-help-tutorial',
  imports: [Button, TranslatePipe, NgStyle],
  templateUrl: './search-help-tutorial.component.html',
  styleUrl: './search-help-tutorial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchHelpTutorialComponent {
  currentStep = model(0);
  isTablet = toSignal(inject(IS_MEDIUM));

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
    return this.isTablet() ? step.position : step.mobilePosition || {};
  }
}
