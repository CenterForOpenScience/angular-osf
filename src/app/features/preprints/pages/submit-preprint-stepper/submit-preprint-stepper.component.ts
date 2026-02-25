import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { map } from 'rxjs';

import { DOCUMENT } from '@angular/common';
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
import { CanDeactivateComponent } from '@osf/shared/models/can-deactivate.interface';
import { StepOption } from '@osf/shared/models/step-option.model';
import { BrandService } from '@osf/shared/services/brand.service';
import { BrowserTabService } from '@osf/shared/services/browser-tab.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';

import {
  AuthorAssertionsStepComponent,
  FileStepComponent,
  PreprintsMetadataStepComponent,
  ReviewStepComponent,
  SupplementsStepComponent,
  TitleAndAbstractStepComponent,
} from '../../components';
import { submitPreprintSteps } from '../../constants';
import { PreprintSteps } from '../../enums';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';
import {
  DeletePreprint,
  PreprintStepperSelectors,
  ResetPreprintStepperState,
  SetSelectedPreprintProviderId,
} from '../../store/preprint-stepper';

@Component({
  selector: 'osf-submit-preprint-stepper',
  imports: [
    Skeleton,
    StepperComponent,
    TitleAndAbstractStepComponent,
    FileStepComponent,
    PreprintsMetadataStepComponent,
    AuthorAssertionsStepComponent,
    SupplementsStepComponent,
    ReviewStepComponent,
    TranslatePipe,
  ],
  templateUrl: './submit-preprint-stepper.component.html',
  styleUrl: './submit-preprint-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitPreprintStepperComponent implements OnDestroy, CanDeactivateComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly brandService = inject(BrandService);
  private readonly headerStyleHelper = inject(HeaderStyleService);
  private readonly browserTabHelper = inject(BrowserTabService);

  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    setSelectedPreprintProviderId: SetSelectedPreprintProviderId,
    resetState: ResetPreprintStepperState,
    deletePreprint: DeletePreprint,
  });

  readonly PreprintSteps = PreprintSteps;

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  hasBeenSubmitted = select(PreprintStepperSelectors.hasBeenSubmitted);
  currentStep = signal<StepOption>(submitPreprintSteps[0]);
  isWeb = toSignal(inject(IS_WEB));

  readonly steps = computed(() => {
    const provider = this.preprintProvider();

    if (!provider) {
      return [];
    }

    return submitPreprintSteps
      .filter((step) => step.value !== PreprintSteps.AuthorAssertions || provider.assertionsEnabled)
      .map((step, index) => ({ ...step, index }));
  });

  constructor() {
    this.actions.getPreprintProviderById(this.providerId());

    effect(() => {
      const provider = this.preprintProvider();

      if (provider) {
        this.actions.setSelectedPreprintProviderId(provider.id);
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
    if (!this.hasBeenSubmitted()) {
      $event.preventDefault();
    }
  }

  canDeactivate(): boolean {
    return this.hasBeenSubmitted();
  }

  ngOnDestroy() {
    this.headerStyleHelper.resetToDefaults();
    this.brandService.resetBranding();
    this.browserTabHelper.resetToDefaults();
    this.actions.deletePreprint();
    this.actions.resetState();
  }

  stepChange(step: StepOption): void {
    if (step.index >= this.currentStep().index) {
      return;
    }

    this.currentStep.set(step);
    this.scrollToTop();
  }

  moveToNextStep(): void {
    const nextStep = this.steps()[this.currentStep().index + 1];

    if (nextStep) {
      this.currentStep.set(nextStep);
      this.scrollToTop();
    }
  }

  moveToPreviousStep(): void {
    const prevStep = this.steps()[this.currentStep().index - 1];

    if (prevStep) {
      this.currentStep.set(prevStep);
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    const contentWrapper = this.document.querySelector('.content-wrapper') as HTMLElement;

    if (contentWrapper) {
      contentWrapper.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
}
