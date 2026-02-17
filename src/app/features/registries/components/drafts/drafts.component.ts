import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { filter, switchMap, take } from 'rxjs';

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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { PageSchema, Question } from '@osf/shared/models/registration/page-schema.model';
import { StepOption } from '@osf/shared/models/step-option.model';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ContributorsSelectors, GetAllContributors } from '@osf/shared/stores/contributors';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import { DEFAULT_STEPS } from '../../constants';
import { ClearState, FetchDraft, FetchSchemaBlocks, RegistriesSelectors, UpdateStepState } from '../../store';

@Component({
  selector: 'osf-drafts',
  imports: [RouterOutlet, StepperComponent, SubHeaderComponent, TranslatePipe],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftsComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loaderService = inject(LoaderService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly draftRegistration = select(RegistriesSelectors.getDraftRegistration);
  readonly stepsState = select(RegistriesSelectors.getStepsState);

  private readonly stepsData = select(RegistriesSelectors.getStepsData);
  private readonly registrationLicense = select(RegistriesSelectors.getRegistrationLicense);
  private readonly selectedSubjects = select(SubjectsSelectors.getSelectedSubjects);
  private readonly contributors = select(ContributorsSelectors.getContributors);

  private readonly actions = createDispatchMap({
    getSchemaBlocks: FetchSchemaBlocks,
    getDraftRegistration: FetchDraft,
    updateStepState: UpdateStepState,
    clearState: ClearState,
    getContributors: GetAllContributors,
    getSubjects: FetchSelectedSubjects,
  });

  get isReviewPage(): boolean {
    return this.router.url.includes('/review');
  }

  isMetaDataInvalid = computed(
    () =>
      !this.draftRegistration()?.title ||
      !this.draftRegistration()?.description ||
      !this.registrationLicense() ||
      !this.selectedSubjects()?.length
  );

  steps = computed(() => {
    const stepState = this.stepsState();
    const stepData = this.stepsData();

    const metadataStep: StepOption = {
      ...DEFAULT_STEPS[0],
      label: this.translateService.instant(DEFAULT_STEPS[0].label),
      invalid: this.isMetaDataInvalid(),
      touched: true,
    };

    const customSteps: StepOption[] = this.pages().map((page, index) => ({
      index: index + 1,
      label: page.title,
      value: page.id,
      routeLink: `${index + 1}`,
      invalid: stepState?.[index + 1]?.invalid || false,
      touched: stepState?.[index + 1]?.touched || this.hasStepData(page, stepData),
    }));

    const reviewStep: StepOption = {
      ...DEFAULT_STEPS[1],
      label: this.translateService.instant(DEFAULT_STEPS[1].label),
      index: customSteps.length + 1,
      invalid: false,
    };

    return [metadataStep, ...customSteps, reviewStep];
  });

  registrationId = this.route.snapshot.firstChild?.params['id'] || '';

  currentStepIndex = signal(
    this.route.snapshot.firstChild?.params['step'] ? +this.route.snapshot.firstChild?.params['step'] : 0
  );

  currentStep = computed(() => this.steps()[this.currentStepIndex()]);

  constructor() {
    this.loadInitialData();
    this.setupSchemaLoader();
    this.setupRouteWatcher();
    this.setupReviewStepSync();
    this.setupStepValidation();
  }

  ngOnDestroy(): void {
    this.actions.clearState();
  }

  stepChange(step: StepOption): void {
    this.currentStepIndex.set(step.index);
    this.router.navigate([`/registries/drafts/${this.registrationId}/`, this.steps()[step.index].routeLink]);
  }

  private loadInitialData() {
    this.loaderService.show();

    if (!this.draftRegistration()) {
      this.actions.getDraftRegistration(this.registrationId);
    }

    if (!this.contributors()?.length) {
      this.actions.getContributors(this.registrationId, ResourceType.DraftRegistration);
    }

    if (!this.selectedSubjects()?.length) {
      this.actions.getSubjects(this.registrationId, ResourceType.DraftRegistration);
    }
  }

  private setupSchemaLoader() {
    toObservable(this.draftRegistration)
      .pipe(
        filter((draft) => !!draft?.registrationSchemaId),
        take(1),
        switchMap((draft) => this.actions.getSchemaBlocks(draft!.registrationSchemaId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loaderService.hide());
  }

  private setupRouteWatcher() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
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

  private setupReviewStepSync() {
    effect(() => {
      const reviewStepIndex = this.pages().length + 1;
      if (this.isReviewPage) {
        this.currentStepIndex.set(reviewStepIndex);
      }
    });
  }

  private setupStepValidation() {
    effect(() => {
      const stepState = untracked(() => this.stepsState());
      const currentIndex = this.currentStepIndex();

      if (currentIndex > 0) {
        this.actions.updateStepState('0', this.isMetaDataInvalid(), stepState?.[0]?.touched || false);
      }

      if (this.pages().length && currentIndex > 0 && this.stepsData()) {
        for (let i = 1; i < currentIndex; i++) {
          const page = this.pages()[i - 1];
          const invalid = this.isPageInvalid(page, this.stepsData());
          this.actions.updateStepState(i.toString(), invalid, stepState?.[i]?.touched || false);
        }
      }
    });
  }

  private getAllQuestions(page: PageSchema): Question[] {
    return [...(page?.questions ?? []), ...(page?.sections?.flatMap((section) => section.questions ?? []) ?? [])];
  }

  private hasStepData(page: PageSchema, stepData: Record<string, unknown>): boolean {
    return (
      this.getAllQuestions(page).some((question) => {
        const data = stepData[question.responseKey!];
        return Array.isArray(data) ? data.length : data;
      }) || false
    );
  }

  private isPageInvalid(page: PageSchema, stepData: Record<string, unknown>): boolean {
    return (
      this.getAllQuestions(page).some((question) => {
        const data = stepData[question.responseKey!];
        return question.required && (Array.isArray(data) ? !data.length : !data);
      }) || false
    );
  }
}
