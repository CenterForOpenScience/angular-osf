import { createDispatchMap, select } from '@ngxs/store';

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
  SupplementsStepComponent,
  TitleAndAbstractStepComponent,
} from '@osf/features/preprints/components';
import { ReviewStepComponent } from '@osf/features/preprints/components/stepper/review-step/review-step.component';
import { submitPreprintSteps } from '@osf/features/preprints/constants';
import { SubmitSteps } from '@osf/features/preprints/enums';
import { CanDeactivateComponent } from '@osf/features/preprints/models/can-deactivate.interface';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import {
  ResetStateAndDeletePreprint,
  SetSelectedPreprintProviderId,
  SubmitPreprintSelectors,
} from '@osf/features/preprints/store/submit-preprint';
import { StepOption } from '@osf/shared/models';
import { StepperComponent } from '@shared/components';
import { BrandService } from '@shared/services';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@shared/utils';

@Component({
  selector: 'osf-submit-preprint-stepper',
  imports: [
    Skeleton,
    StepperComponent,
    TitleAndAbstractStepComponent,
    FileStepComponent,
    MetadataStepComponent,
    AuthorAssertionsStepComponent,
    SupplementsStepComponent,
    AuthorAssertionsStepComponent,
    ReviewStepComponent,
  ],
  templateUrl: './submit-preprint-stepper.component.html',
  styleUrl: './submit-preprint-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitPreprintStepperComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);

  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    setSelectedPreprintProviderId: SetSelectedPreprintProviderId,
    resetStateAndDeletePreprint: ResetStateAndDeletePreprint,
  });

  readonly SubmitStepsEnum = SubmitSteps;

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  hasBeenSubmitted = select(SubmitPreprintSelectors.hasBeenSubmitted);
  currentStep = signal<StepOption>(submitPreprintSteps[0]);
  isWeb = toSignal(inject(IS_WEB));

  readonly submitPreprintSteps = computed(() => {
    const provider = this.preprintProvider();

    if (!provider) {
      return [];
    }

    return submitPreprintSteps
      .map((step) => {
        if (!provider.assertionsEnabled && step.value === SubmitSteps.AuthorAssertions) {
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
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
    BrowserTabHelper.resetToDefaults();
    this.actions.resetStateAndDeletePreprint();
  }

  stepChange(step: StepOption): void {
    const currentStepIndex = this.currentStep()?.index ?? 0;
    if (step.index >= currentStepIndex) {
      return;
    }

    this.currentStep.set(step);
  }

  moveToNextStep() {
    this.currentStep.set(this.submitPreprintSteps()[this.currentStep()?.index + 1]);
  }

  moveToPreviousStep() {
    this.currentStep.set(this.submitPreprintSteps()[this.currentStep()?.index - 1]);
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }
}
