import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { map, Observable, of } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostBinding,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import {
  AuthorAssertionsStepComponent,
  FileStepComponent,
  MetadataStepComponent,
  ReviewStepComponent,
  SupplementsStepComponent,
  TitleAndAbstractStepComponent,
} from '@osf/features/preprints/components';
import { submitPreprintSteps } from '@osf/features/preprints/constants';
import { PreprintSteps, ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import {
  FetchPreprintById,
  PreprintStepperSelectors,
  ResetState,
  SetSelectedPreprintProviderId,
} from '@osf/features/preprints/store/preprint-stepper';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@osf/shared/helpers';
import { StepperComponent } from '@shared/components';
import { UserPermissions } from '@shared/enums';
import { CanDeactivateComponent, StepOption } from '@shared/models';
import { BrandService } from '@shared/services';

@Component({
  selector: 'osf-update-preprint-stepper',
  imports: [
    AuthorAssertionsStepComponent,
    Skeleton,
    StepperComponent,
    TitleAndAbstractStepComponent,
    MetadataStepComponent,
    SupplementsStepComponent,
    ReviewStepComponent,
    TranslatePipe,
    FileStepComponent,
  ],
  templateUrl: './update-preprint-stepper.component.html',
  styleUrl: './update-preprint-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePreprintStepperComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);

  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));
  private preprintId = toSignal(this.route.params.pipe(map((params) => params['preprintId'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    setSelectedPreprintProviderId: SetSelectedPreprintProviderId,
    resetState: ResetState,
    fetchPreprint: FetchPreprintById,
  });

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  preprint = select(PreprintStepperSelectors.getPreprint);
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  hasBeenSubmitted = select(PreprintStepperSelectors.hasBeenSubmitted);

  currentUserIsAdmin = computed(() => {
    return this.preprint()?.currentUserPermissions.includes(UserPermissions.Admin) || false;
  });

  editAndResubmitMode = computed(() => {
    const providerIsPremod = this.preprintProvider()?.reviewsWorkflow === ProviderReviewsWorkflow.PreModeration;
    const preprintIsRejected = this.preprint()?.reviewsState === ReviewsState.Rejected;

    return providerIsPremod && preprintIsRejected;
  });

  readonly updateSteps = computed(() => {
    const provider = this.preprintProvider();
    const preprint = this.preprint();

    if (!provider || !preprint) {
      return [];
    }

    return submitPreprintSteps
      .map((step) => {
        if (step.value !== PreprintSteps.File) {
          return step;
        }

        return this.editAndResubmitMode() ? step : null;
      })
      .filter((step) => step !== null)
      .map((step) => {
        if (step.value !== PreprintSteps.AuthorAssertions) {
          return step;
        }

        if (!provider.assertionsEnabled || !this.currentUserIsAdmin()) {
          return null;
        }

        return step;
      })
      .filter((step) => step !== null)
      .map((step, index) => ({
        ...step,
        index,
      }));
  });

  currentStep = signal<StepOption>(submitPreprintSteps[0]);
  isWeb = toSignal(inject(IS_WEB));

  readonly PreprintSteps = PreprintSteps;

  constructor() {
    effect(() => {
      const provider = this.preprintProvider();

      if (provider) {
        this.actions.setSelectedPreprintProviderId(provider.id);
        BrandService.applyBranding(provider.brand);
        HeaderStyleHelper.applyHeaderStyles(
          provider.brand.primaryColor,
          provider.brand.secondaryColor,
          provider.brand.heroBackgroundImageUrl
        );
        BrowserTabHelper.updateTabStyles(provider.faviconUrl, provider.name);
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.hasBeenSubmitted();
  }

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId());
    this.actions.fetchPreprint(this.preprintId());
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
    BrowserTabHelper.resetToDefaults();
    this.actions.resetState();
  }

  stepChange(step: StepOption): void {
    const currentStepIndex = this.currentStep()?.index ?? 0;
    if (step.index >= currentStepIndex) {
      return;
    }

    this.currentStep.set(step);
  }

  moveToNextStep() {
    this.currentStep.set(this.updateSteps()[this.currentStep()?.index + 1]);
  }

  moveToPreviousStep() {
    this.currentStep.set(this.updateSteps()[this.currentStep()?.index - 1]);
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }

  protected readonly SubmitStepsEnum = PreprintSteps;
}
