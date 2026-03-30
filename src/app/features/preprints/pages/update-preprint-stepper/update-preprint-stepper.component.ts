import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { map } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostBinding,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';
import { BrandService } from '@osf/shared/services/brand.service';
import { BrowserTabService } from '@osf/shared/services/browser-tab.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';
import { CanDeactivateComponent } from '@shared/models/can-deactivate.interface';
import { StepOption } from '@shared/models/step-option.model';

import {
  AuthorAssertionsStepComponent,
  FileStepComponent,
  PreprintsMetadataStepComponent,
  ReviewStepComponent,
  SupplementsStepComponent,
  TitleAndAbstractStepComponent,
} from '../../components';
import { submitPreprintSteps } from '../../constants';
import { PreprintSteps, ProviderReviewsWorkflow, ReviewsState } from '../../enums';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';
import { FetchPreprintById, PreprintStepperSelectors, ResetPreprintStepperState } from '../../store/preprint-stepper';

@Component({
  selector: 'osf-update-preprint-stepper',
  imports: [
    Skeleton,
    AuthorAssertionsStepComponent,
    StepperComponent,
    TitleAndAbstractStepComponent,
    PreprintsMetadataStepComponent,
    SupplementsStepComponent,
    ReviewStepComponent,
    FileStepComponent,
    TranslatePipe,
  ],
  templateUrl: './update-preprint-stepper.component.html',
  styleUrl: './update-preprint-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePreprintStepperComponent implements OnDestroy, CanDeactivateComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);
  private readonly brandService = inject(BrandService);
  private readonly headerStyleHelper = inject(HeaderStyleService);
  private readonly browserTabHelper = inject(BrowserTabService);

  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])));
  private preprintId = toSignal(this.route.params.pipe(map((params) => params['preprintId'])));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    resetState: ResetPreprintStepperState,
    fetchPreprint: FetchPreprintById,
  });

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  preprint = select(PreprintStepperSelectors.getPreprint);
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  hasBeenSubmitted = select(PreprintStepperSelectors.hasBeenSubmitted);
  hasAdminAccess = select(PreprintStepperSelectors.hasAdminAccess);

  isWeb = toSignal(inject(IS_WEB));

  currentStep = signal<StepOption>(submitPreprintSteps[0]);

  readonly PreprintSteps = PreprintSteps;

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
      .filter((step) => {
        if (step.value === PreprintSteps.File) {
          return this.editAndResubmitMode();
        }
        if (step.value === PreprintSteps.AuthorAssertions) {
          return provider.assertionsEnabled && this.hasAdminAccess();
        }
        return true;
      })
      .map((step, index) => ({ ...step, index }));
  });

  constructor() {
    this.actions.getPreprintProviderById(this.providerId());
    this.actions.fetchPreprint(this.preprintId());

    effect(() => {
      const provider = this.preprintProvider();

      if (provider) {
        this.brandService.applyBranding(provider.brand);
        this.headerStyleHelper.applyHeaderStyles(
          provider.brand.primaryColor,
          provider.brand.secondaryColor,
          provider.brand.heroBackgroundImageUrl
        );
        this.browserTabHelper.updateTabStyles(provider.faviconUrl, provider.name);
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload($event: BeforeUnloadEvent): void {
    if (!this.canDeactivate()) {
      $event.preventDefault();
    }
  }

  canDeactivate(): boolean {
    return this.hasBeenSubmitted() || this.preprint()?.reviewsState === ReviewsState.Accepted;
  }

  ngOnDestroy() {
    this.headerStyleHelper.resetToDefaults();
    this.brandService.resetBranding();
    this.browserTabHelper.resetToDefaults();
    this.actions.resetState();
  }

  stepChange(step: StepOption): void {
    if (step.index >= this.currentStep().index) {
      return;
    }

    this.currentStep.set(step);
  }

  moveToNextStep(): void {
    const nextStep = this.updateSteps()[this.currentStep().index + 1];

    if (nextStep) {
      this.currentStep.set(nextStep);
    }
  }

  moveToPreviousStep(): void {
    const prevStep = this.updateSteps()[this.currentStep().index - 1];

    if (prevStep) {
      this.currentStep.set(prevStep);
    }
  }
}
