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
import { ActivatedRoute, Router } from '@angular/router';

import { ResetState } from '@osf/features/files/store';
import { StepperComponent } from '@osf/shared/components';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@osf/shared/helpers';
import { CanDeactivateComponent, StepOption } from '@osf/shared/models';
import { BrandService } from '@osf/shared/services';

import { FileStepComponent, ReviewStepComponent } from '../../components';
import { createNewVersionStepsConst } from '../../constants';
import { PreprintSteps } from '../../enums';
import { FetchPreprintById } from '../../store/preprint';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';
import { PreprintStepperSelectors, SetSelectedPreprintProviderId } from '../../store/preprint-stepper';

@Component({
  selector: 'osf-create-new-version',
  imports: [Skeleton, StepperComponent, ReviewStepComponent, FileStepComponent, TranslatePipe],
  templateUrl: './create-new-version.component.html',
  styleUrl: './create-new-version.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewVersionComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private route = inject(ActivatedRoute);
  private router = inject(Router);

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
    const id = this.preprintId().split('_')[0];
    this.router.navigate([id]);
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    $event.preventDefault();
    return false;
  }
}
