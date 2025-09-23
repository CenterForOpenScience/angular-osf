import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SEARCH_TUTORIAL_STEPS } from '@osf/shared/constants';
import { TutorialStep } from '@osf/shared/models';
import { IS_MEDIUM } from '@shared/helpers';

@Component({
  selector: 'osf-search-help-tutorial',
  imports: [Button, TranslatePipe, CommonModule],
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
