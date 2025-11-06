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

import { ResetState } from '@osf/features/files/store';
import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';
import { BrowserTabHelper } from '@osf/shared/helpers/browser-tab.helper';
import { HeaderStyleHelper } from '@osf/shared/helpers/header-style.helper';
import { CanDeactivateComponent } from '@osf/shared/models/can-deactivate.interface';
import { StepOption } from '@osf/shared/models/step-option.model';
import { BrandService } from '@osf/shared/services/brand.service';

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
import { DeletePreprint, PreprintStepperSelectors, SetSelectedPreprintProviderId } from '../../store/preprint-stepper';

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
