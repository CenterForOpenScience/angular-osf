import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { map, Observable, of } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
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

import { FileStepComponent, ReviewStepComponent } from '@osf/features/preprints/components';
import { createNewVersionStepsConst } from '@osf/features/preprints/constants';
import { PreprintSteps } from '@osf/features/preprints/enums';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import {
  FetchPreprintById,
  PreprintStepperSelectors,
  ResetState,
  SetSelectedPreprintProviderId,
} from '@osf/features/preprints/store/preprint-stepper';
import { StepperComponent } from '@shared/components';
import { CanDeactivateComponent, StepOption } from '@shared/models';
import { BrandService } from '@shared/services';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@shared/utils';

@Component({
  selector: 'osf-create-new-version',
  imports: [Skeleton, StepperComponent, ReviewStepComponent, FileStepComponent, TranslatePipe],
  templateUrl: './create-new-version.component.html',
  styleUrl: './create-new-version.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewVersionComponent implements OnInit, OnDestroy, CanDeactivateComponent {
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

  readonly PreprintSteps = PreprintSteps;
  readonly newVersionSteps = createNewVersionStepsConst;

  preprint = select(PreprintStepperSelectors.getPreprint);
  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  hasBeenSubmitted = select(PreprintStepperSelectors.hasBeenSubmitted);
  currentStep = signal<StepOption>(createNewVersionStepsConst[0]);
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
    this.actions.fetchPreprint(this.preprintId());
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
    BrowserTabHelper.resetToDefaults();
    this.actions.resetState();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.hasBeenSubmitted();
  }

  stepChange(step: StepOption): void {
    const currentStepIndex = this.currentStep()?.index ?? 0;
    if (step.index >= currentStepIndex) {
      return;
    }

    this.currentStep.set(step);
  }

  moveToNextStep() {
    this.currentStep.set(this.newVersionSteps[this.currentStep()?.index + 1]);
  }

  moveToPreviousStep() {
    this.currentStep.set(this.newVersionSteps[this.currentStep()?.index - 1]);
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }
}
