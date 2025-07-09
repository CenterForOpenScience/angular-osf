import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { filter, tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { StepperComponent, SubHeaderComponent } from '@osf/shared/components';
import { StepOption } from '@osf/shared/models';
import { LoaderService } from '@osf/shared/services';

import { defaultSteps } from '../../constants';
import { FetchDraft, FetchSchemaBlocks, RegistriesSelectors } from '../../store';

@Component({
  selector: 'osf-drafts',
  imports: [RouterOutlet, StepperComponent, SubHeaderComponent, TranslatePipe],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslateService],
})
export class DraftsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loaderService = inject(LoaderService);
  private readonly translateService = inject(TranslateService);

  protected readonly pages = select(RegistriesSelectors.getPagesSchema);
  protected readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  protected stepsValidation = select(RegistriesSelectors.getStepsValidation);
  protected readonly stepsData = select(RegistriesSelectors.getStepsData);

  private readonly actions = createDispatchMap({
    getSchemaBlocks: FetchSchemaBlocks,
    getDraftRegistration: FetchDraft,
  });

  get isReviewPage(): boolean {
    return this.router.url.includes('/review');
  }

  defaultSteps: StepOption[] = [];

  steps: Signal<StepOption[]> = computed(() => {
    this.defaultSteps = defaultSteps.map((step) => ({
      ...step,
      label: this.translateService.instant(step.label),
      invalid: this.stepsValidation()?.[step.index]?.invalid || false,
    }));

    const customSteps = this.pages().map((page, index) => {
      return {
        index: index + 1,
        label: page.title,
        value: page.id,
        routeLink: `${index + 1}`,
        invalid: this.stepsValidation()?.[index + 1]?.invalid || false,
      };
    });
    return [
      this.defaultSteps[0],
      ...customSteps,
      { ...this.defaultSteps[1], index: customSteps.length + 1, invalid: false },
    ];
  });

  currentStepIndex = signal(
    this.route.snapshot.firstChild?.params['step'] ? +this.route.snapshot.firstChild?.params['step'] : 0
  );

  currentStep = computed(() => {
    return this.steps()[this.currentStepIndex()];
  });

  registrationId = this.route.snapshot.firstChild?.params['id'] || '';

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        const step = this.route.firstChild?.snapshot.params['step'];
        if (step) {
          this.currentStepIndex.set(+step);
        } else if (this.isReviewPage) {
          const reviewStepIndex = this.pages().length + 1;
          this.currentStepIndex.set(reviewStepIndex);
        } else {
          this.currentStepIndex.set(0);
        }
      });

    this.loaderService.show();
    if (!this.draftRegistration()) {
      this.actions.getDraftRegistration(this.registrationId);
    }
    effect(() => {
      const registrationSchemaId = this.draftRegistration()?.registrationSchemaId;
      if (registrationSchemaId && !this.pages().length) {
        this.actions
          .getSchemaBlocks(registrationSchemaId || '')
          .pipe(
            tap(() => {
              this.loaderService.hide();
            })
          )
          .subscribe();
      }
    });

    effect(() => {
      const reviewStepIndex = this.pages().length + 1;
      if (this.isReviewPage) {
        this.currentStepIndex.set(reviewStepIndex);
      }
    });
  }

  stepChange(step: StepOption): void {
    // [NM] TODO: before navigating, validate the current step
    this.currentStepIndex.set(step.index);
    const pageLink = this.steps()[step.index].routeLink;
    this.router.navigate([`/registries/drafts/${this.registrationId}/`, pageLink]);
  }
}
