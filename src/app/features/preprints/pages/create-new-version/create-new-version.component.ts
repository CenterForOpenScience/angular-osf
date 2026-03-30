import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { map } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';
import { CanDeactivateComponent } from '@osf/shared/models/can-deactivate.interface';
import { StepOption } from '@osf/shared/models/step-option.model';
import { BrandService } from '@osf/shared/services/brand.service';
import { BrowserTabService } from '@osf/shared/services/browser-tab.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';

import { FileStepComponent, ReviewStepComponent } from '../../components';
import { createNewVersionStepsConst } from '../../constants';
import { PreprintSteps } from '../../enums';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';
import { FetchPreprintById, PreprintStepperSelectors, ResetPreprintStepperState } from '../../store/preprint-stepper';

@Component({
  selector: 'osf-create-new-version',
  imports: [Skeleton, StepperComponent, ReviewStepComponent, FileStepComponent, TranslatePipe],
  templateUrl: './create-new-version.component.html',
  styleUrl: './create-new-version.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewVersionComponent implements OnDestroy, CanDeactivateComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly brandService = inject(BrandService);
  private readonly headerStyleHelper = inject(HeaderStyleService);
  private readonly browserTabHelper = inject(BrowserTabService);

  private readonly providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])));
  private readonly preprintId = toSignal(this.route.params.pipe(map((params) => params['preprintId'])));

  private readonly actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    fetchPreprint: FetchPreprintById,
    resetState: ResetPreprintStepperState,
  });

  readonly preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  readonly isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  readonly hasBeenSubmitted = select(PreprintStepperSelectors.hasBeenSubmitted);

  currentStep = signal<StepOption>(createNewVersionStepsConst[0]);
  isWeb = toSignal(inject(IS_WEB));

  readonly PreprintSteps = PreprintSteps;
  readonly newVersionSteps = createNewVersionStepsConst;

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
    if (!this.hasBeenSubmitted()) {
      $event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.headerStyleHelper.resetToDefaults();
    this.brandService.resetBranding();
    this.browserTabHelper.resetToDefaults();
    this.actions.resetState();
  }

  canDeactivate(): boolean {
    return this.hasBeenSubmitted();
  }

  stepChange(step: StepOption): void {
    if (step.index >= this.currentStep().index) {
      return;
    }

    this.currentStep.set(step);
  }

  moveToNextStep(): void {
    const nextStep = this.newVersionSteps[this.currentStep().index + 1];

    if (nextStep) {
      this.currentStep.set(nextStep);
    }
  }

  navigateBack(): void {
    const id = this.preprintId()?.split('_')[0];

    if (id) {
      this.router.navigate([id]);
    }
  }
}
