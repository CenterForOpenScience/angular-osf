import { createDispatchMap, select } from '@ngxs/store';

import { Skeleton } from 'primeng/skeleton';

import { map, of } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import {
  FileStepComponent,
  MetadataComponent,
  TitleAndAbstractStepComponent,
} from '@osf/features/preprints/components';
import { submitPreprintSteps } from '@osf/features/preprints/constants';
import { SubmitSteps } from '@osf/features/preprints/enums';
import { GetPreprintProviderById, PreprintsSelectors } from '@osf/features/preprints/store/preprints';
import {
  ResetStateAndDeletePreprint,
  SetSelectedPreprintProviderId,
} from '@osf/features/preprints/store/submit-preprint';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { BrandService } from '@shared/services';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@shared/utils';

@Component({
  selector: 'osf-submit-preprint-stepper',
  imports: [Skeleton, StepperComponent, TitleAndAbstractStepComponent, FileStepComponent, MetadataComponent],
  templateUrl: './submit-preprint-stepper.component.html',
  styleUrl: './submit-preprint-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitPreprintStepperComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);

  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    setSelectedPreprintProviderId: SetSelectedPreprintProviderId,
    resetStateAndDeletePreprint: ResetStateAndDeletePreprint,
  });

  readonly SubmitStepsEnum = SubmitSteps;
  readonly submitPreprintSteps = submitPreprintSteps;

  preprintProvider = select(PreprintsSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintsSelectors.isPreprintProviderDetailsLoading);
  currentStep = signal<number>(0);
  isWeb = toSignal(inject(IS_WEB));

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

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId());
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
    BrowserTabHelper.resetToDefaults();
    this.actions.resetStateAndDeletePreprint();
  }

  stepChange(step: number) {
    if (step >= this.currentStep()) {
      return;
    }

    this.currentStep.set(step);
  }
}
