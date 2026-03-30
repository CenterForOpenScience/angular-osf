import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { filter } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { LoaderService } from '@osf/shared/services/loader.service';
import { StepOption } from '@shared/models/step-option.model';

import { ClearState, FetchSchemaBlocks, FetchSchemaResponse, RegistriesSelectors, UpdateStepState } from '../../store';

@Component({
  selector: 'osf-justification',
  imports: [RouterOutlet, StepperComponent, SubHeaderComponent, TranslatePipe],
  templateUrl: './justification.component.html',
  styleUrl: './justification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JustificationComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly translateService = inject(TranslateService);

  private readonly actions = createDispatchMap({
    getSchemaBlocks: FetchSchemaBlocks,
    clearState: ClearState,
    getSchemaResponse: FetchSchemaResponse,
    updateStepState: UpdateStepState,
  });

  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly stepsState = select(RegistriesSelectors.getStepsState);
  readonly schemaResponse = select(RegistriesSelectors.getSchemaResponse);
  readonly schemaResponseRevisionData = select(RegistriesSelectors.getSchemaResponseRevisionData);

  readonly revisionId = this.route.snapshot.firstChild?.params['id'] || '';

  get isReviewPage(): boolean {
    return this.router.url.includes('/review');
  }

  readonly steps = computed(() => {
    const response = this.schemaResponse();
    const isJustificationValid = !!response?.revisionJustification;
    const isDisabled = response?.reviewsState !== RevisionReviewStates.RevisionInProgress;
    const stepState = this.stepsState();
    const pages = this.pages();

    const justificationStep: StepOption = {
      index: 0,
      value: 'justification',
      label: this.translateService.instant('registries.justification.step'),
      invalid: !isJustificationValid,
      touched: isJustificationValid,
      routeLink: 'justification',
      disabled: isDisabled,
    };

    const customSteps: StepOption[] = pages.map((page, index) => ({
      index: index + 1,
      label: page.title,
      value: page.id,
      routeLink: `${index + 1}`,
      invalid: stepState?.[index + 1]?.invalid || false,
      touched: stepState?.[index + 1]?.touched || false,
      disabled: isDisabled,
    }));

    const reviewStep: StepOption = {
      index: customSteps.length + 1,
      value: 'review',
      label: this.translateService.instant('registries.review.step'),
      invalid: false,
      routeLink: 'review',
    };

    return [justificationStep, ...customSteps, reviewStep];
  });

  currentStepIndex = signal(
    this.route.snapshot.firstChild?.params['step'] ? +this.route.snapshot.firstChild?.params['step'] : 0
  );

  currentStep = computed(() => this.steps()[this.currentStepIndex()]);

  constructor() {
    this.initRouterListener();
    this.initDataFetching();
    this.initReviewPageSync();
    this.initStepValidation();
  }

  ngOnDestroy(): void {
    this.actions.clearState();
  }

  stepChange(step: StepOption): void {
    this.currentStepIndex.set(step.index);
    const pageLink = this.steps()[step.index].routeLink;
    this.router.navigate([`/registries/revisions/${this.revisionId}/`, pageLink]);
  }

  private initRouterListener(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        const step = this.route.firstChild?.snapshot.params['step'];
        if (step) {
          this.currentStepIndex.set(+step);
        } else if (this.isReviewPage) {
          this.currentStepIndex.set(this.pages().length + 1);
        } else {
          this.currentStepIndex.set(0);
        }
      });
  }

  private initDataFetching(): void {
    this.loaderService.show();

    if (!this.schemaResponse()) {
      this.actions.getSchemaResponse(this.revisionId);
    }

    effect(() => {
      const registrationSchemaId = this.schemaResponse()?.registrationSchemaId;

      if (registrationSchemaId) {
        this.actions.getSchemaBlocks(registrationSchemaId).subscribe(() => this.loaderService.hide());
      }
    });
  }

  private initReviewPageSync(): void {
    effect(() => {
      const reviewStepIndex = this.pages().length + 1;

      if (this.isReviewPage) {
        this.currentStepIndex.set(reviewStepIndex);
      }
    });
  }

  private initStepValidation(): void {
    effect(() => {
      const currentIndex = this.currentStepIndex();
      const pages = this.pages();
      const revisionData = this.schemaResponseRevisionData();
      const stepState = untracked(() => this.stepsState());

      if (currentIndex > 0) {
        this.actions.updateStepState('0', true, stepState?.[0]?.touched || false);
      }

      if (pages.length && currentIndex > 0 && revisionData) {
        for (let i = 1; i < currentIndex; i++) {
          const pageStep = pages[i - 1];
          const isStepInvalid =
            pageStep?.questions?.some((question) => {
              const questionData = revisionData[question.responseKey!];
              return question.required && (Array.isArray(questionData) ? !questionData.length : !questionData);
            }) || false;
          this.actions.updateStepState(i.toString(), isStepInvalid, stepState?.[i]?.touched || false);
        }
      }
    });
  }
}
