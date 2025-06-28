import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { StepperComponent, SubHeaderComponent } from '@osf/shared/components';
import { StepOption } from '@osf/shared/models';

import { defaultSteps } from '../../constants';
import { FetchDraft, FetchSchemaBlocks, RegistriesSelectors } from '../../store';

@Component({
  selector: 'osf-drafts',
  imports: [RouterOutlet, StepperComponent, SubHeaderComponent, TranslatePipe],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftsComponent {
  protected readonly pages = select(RegistriesSelectors.getPagesSchema);
  protected readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly actions = createDispatchMap({
    getSchemaBlocks: FetchSchemaBlocks,
    getDraftRegistration: FetchDraft,
  });

  get isReviewPage(): boolean {
    return this.router.url.includes('/review');
  }

  steps: Signal<StepOption[]> = computed(() => {
    const customSteps = this.pages().map((page) => ({
      label: page.title,
      value: page.id,
    }));
    return [defaultSteps[0], ...customSteps, defaultSteps[1]];
  });

  currentStep = signal(
    this.route.snapshot.children[0]?.params['step'] ? +this.route.snapshot.children[0]?.params['step'].split('-')[0] : 0
  );

  registrationId = this.route.snapshot.children[0]?.params['id'] || '';

  constructor() {
    if (!this.draftRegistration()) {
      this.actions.getDraftRegistration(this.registrationId);
    }
    effect(() => {
      const registrationSchemaId = this.draftRegistration()?.registrationSchemaId;
      if (registrationSchemaId) {
        this.actions.getSchemaBlocks(registrationSchemaId || '');
      }
    });

    effect(() => {
      const reviewStepNumber = this.pages().length + 1;
      if (this.isReviewPage) {
        this.currentStep.set(reviewStepNumber);
      }
    });
  }

  stepChange(step: number): void {
    // TODO: before navigating, validate the current step
    this.currentStep.set(step);
    const pageStep = this.steps()[step];

    let pageLink = '';
    if (!pageStep.value) {
      pageLink = `${pageStep.routeLink}`;
    } else {
      pageLink = `${step}-${pageStep.value}`;
    }
    this.router.navigate([`/registries/drafts/${this.registrationId}/`, pageLink]);
  }
}
