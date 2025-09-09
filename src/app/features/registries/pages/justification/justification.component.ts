import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { filter, tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { StepperComponent, SubHeaderComponent } from '@osf/shared/components';
import { RevisionReviewStates } from '@osf/shared/enums';
import { StepOption } from '@osf/shared/models';
import { LoaderService } from '@osf/shared/services';

import {
  ClearState,
  FetchSchemaBlocks,
  FetchSchemaResponse,
  RegistriesSelectors,
  UpdateStepValidation,
} from '../../store';

@Component({
  selector: 'osf-justification',
  imports: [RouterOutlet, StepperComponent, SubHeaderComponent, TranslatePipe],
  templateUrl: './justification.component.html',
  styleUrl: './justification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslateService],
})
export class JustificationComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly loaderService = inject(LoaderService);
  private readonly translateService = inject(TranslateService);
  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly stepsValidation = select(RegistriesSelectors.getStepsValidation);
  readonly schemaResponse = select(RegistriesSelectors.getSchemaResponse);
  readonly schemaResponseRevisionData = select(RegistriesSelectors.getSchemaResponseRevisionData);

  private readonly actions = createDispatchMap({
    getSchemaBlocks: FetchSchemaBlocks,
    clearState: ClearState,
    getSchemaResponse: FetchSchemaResponse,
    updateStepValidation: UpdateStepValidation,
  });

  get isReviewPage(): boolean {
    return this.router.url.includes('/review');
  }

  reviewStep!: StepOption;
  justificationStep!: StepOption;
  revisionId = this.route.snapshot.firstChild?.params['id'] || '';

  steps: Signal<StepOption[]> = computed(() => {
    this.justificationStep = {
      index: 0,
      value: 'justification',
      label: this.translateService.instant('registries.justification.step'),
      invalid: false,
      routeLink: 'justification',
      disabled: this.schemaResponse()?.reviewsState !== RevisionReviewStates.RevisionInProgress,
    };

    this.reviewStep = {
      index: 1,
      value: 'review',
      label: this.translateService.instant('registries.review.step'),
      invalid: false,
      routeLink: 'review',
    };

    const customSteps = this.pages().map((page, index) => {
      return {
        index: index + 1,
        label: page.title,
        value: page.id,
        routeLink: `${index + 1}`,
        invalid: this.stepsValidation()?.[index + 1]?.invalid || false,
        disabled: this.schemaResponse()?.reviewsState !== RevisionReviewStates.RevisionInProgress,
      };
    });
    return [
      { ...this.justificationStep },
      ...customSteps,
      { ...this.reviewStep, index: customSteps.length + 1, invalid: false },
    ];
  });

  currentStepIndex = signal(
    this.route.snapshot.firstChild?.params['step'] ? +this.route.snapshot.firstChild?.params['step'] : 0
  );

  currentStep = computed(() => {
    return this.steps()[this.currentStepIndex()];
  });

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
    if (!this.schemaResponse()) {
      this.actions.getSchemaResponse(this.revisionId);
    }

    effect(() => {
      const registrationSchemaId = this.schemaResponse()?.registrationSchemaId;
      if (registrationSchemaId) {
        this.actions
          .getSchemaBlocks(registrationSchemaId)
          .pipe(tap(() => this.loaderService.hide()))
          .subscribe();
      }
    });

    effect(() => {
      const reviewStepIndex = this.pages().length + 1;
      if (this.isReviewPage) {
        this.currentStepIndex.set(reviewStepIndex);
      }
    });

    effect(() => {
      if (this.currentStepIndex() > 0) {
        this.actions.updateStepValidation('0', true);
      }
      if (this.pages().length && this.currentStepIndex() > 0 && this.schemaResponseRevisionData()) {
        for (let i = 1; i < this.currentStepIndex(); i++) {
          const pageStep = this.pages()[i - 1];
          const isStepInvalid =
            pageStep?.questions?.some((question) => {
              const questionData = this.schemaResponseRevisionData()[question.responseKey!];
              return question.required && (Array.isArray(questionData) ? !questionData.length : !questionData);
            }) || false;
          this.actions.updateStepValidation(i.toString(), isStepInvalid);
        }
      }
    });
  }

  stepChange(step: StepOption): void {
    this.currentStepIndex.set(step.index);
    const pageLink = this.steps()[step.index].routeLink;
    this.router.navigate([`/registries/revisions/${this.revisionId}/`, pageLink]);
  }

  ngOnDestroy(): void {
    this.actions.clearState();
  }
}
