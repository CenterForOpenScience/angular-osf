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
import { PreprintSteps } from '@osf/features/preprints/enums';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import {
  DeletePreprint,
  PreprintStepperSelectors,
  ResetState,
  SetSelectedPreprintProviderId,
} from '@osf/features/preprints/store/preprint-stepper';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@osf/shared/helpers';
import { CanDeactivateComponent, StepOption } from '@osf/shared/models';
import { StepperComponent } from '@shared/components';
import { BrandService } from '@shared/services';

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
    TranslatePipe,
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
    resetState: ResetState,
    deletePreprint: DeletePreprint,
  });

  readonly SubmitStepsEnum = PreprintSteps;

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  hasBeenSubmitted = select(PreprintStepperSelectors.hasBeenSubmitted);
  currentStep = signal<StepOption>(submitPreprintSteps[0]);
  isWeb = toSignal(inject(IS_WEB));

  readonly submitPreprintSteps = computed(() => {
    const provider = this.preprintProvider();

    if (!provider) {
      return [];
    }

    return submitPreprintSteps
      .map((step) => {
        if (!provider.assertionsEnabled && step.value === PreprintSteps.AuthorAssertions) {
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
    this.actions.deletePreprint();
    this.actions.resetState();
  }

  stepChange(step: StepOption): void {
    const currentStepIndex = this.currentStep()?.index ?? 0;
    if (step.index >= currentStepIndex) {
      return;
    }

    this.currentStep.set(step);
    this.scrollToTop();
  }

  moveToNextStep() {
    this.currentStep.set(this.submitPreprintSteps()[this.currentStep()?.index + 1]);
    this.scrollToTop();
  }

  moveToPreviousStep() {
    this.currentStep.set(this.submitPreprintSteps()[this.currentStep()?.index - 1]);
    this.scrollToTop();
  }

  scrollToTop() {
    const contentWrapper = document.querySelector('.content-wrapper') as HTMLElement;

    if (contentWrapper) {
      contentWrapper.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }
}
