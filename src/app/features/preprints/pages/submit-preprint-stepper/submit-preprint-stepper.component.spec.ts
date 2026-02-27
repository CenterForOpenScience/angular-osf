import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';
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
import { PreprintProviderDetails } from '../../models';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';
import { DeletePreprint, PreprintStepperSelectors, ResetPreprintStepperState } from '../../store/preprint-stepper';

import { SubmitPreprintStepperComponent } from './submit-preprint-stepper.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BrandServiceMock, BrandServiceMockType } from '@testing/providers/brand-service.mock';
import { BrowserTabServiceMock, BrowserTabServiceMockType } from '@testing/providers/browser-tab-service.mock';
import { HeaderStyleServiceMock, HeaderStyleServiceMockType } from '@testing/providers/header-style-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

describe('SubmitPreprintStepperComponent', () => {
  let component: SubmitPreprintStepperComponent;
  let fixture: ComponentFixture<SubmitPreprintStepperComponent>;
  let store: Store;
  let brandServiceMock: BrandServiceMockType;
  let headerStyleMock: HeaderStyleServiceMockType;
  let browserTabMock: BrowserTabServiceMockType;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockProviderId = 'osf';

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId), value: mockProvider },
    { selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading, value: false },
    { selector: PreprintStepperSelectors.hasBeenSubmitted, value: false },
  ];

  function setup(overrides?: { selectorOverrides?: SignalOverride[] }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);

    const routeMock = ActivatedRouteMockBuilder.create().withParams({ providerId: mockProviderId }).build();

    brandServiceMock = BrandServiceMock.simple();
    headerStyleMock = HeaderStyleServiceMock.simple();
    browserTabMock = BrowserTabServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        SubmitPreprintStepperComponent,
        ...MockComponents(
          StepperComponent,
          TitleAndAbstractStepComponent,
          FileStepComponent,
          PreprintsMetadataStepComponent,
          AuthorAssertionsStepComponent,
          SupplementsStepComponent,
          ReviewStepComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(BrandService, brandServiceMock),
        MockProvider(HeaderStyleService, headerStyleMock),
        MockProvider(BrowserTabService, browserTabMock),
        MockProvider(IS_WEB, of(true)),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SubmitPreprintStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should initialize with correct default values', () => {
    setup();

    expect(component.PreprintSteps).toBe(PreprintSteps);
    expect(component.classes).toBe('flex-1 flex flex-column w-full');
    expect(component.currentStep()).toEqual(submitPreprintSteps[0]);
  });

  it('should dispatch initial action on creation', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetPreprintProviderById(mockProviderId));
  });

  it('should apply branding when provider is available', () => {
    setup();

    expect(brandServiceMock.applyBranding).toHaveBeenCalledWith(mockProvider.brand);
    expect(headerStyleMock.applyHeaderStyles).toHaveBeenCalledWith(
      mockProvider.brand.primaryColor,
      mockProvider.brand.secondaryColor,
      mockProvider.brand.heroBackgroundImageUrl
    );
    expect(browserTabMock.updateTabStyles).toHaveBeenCalledWith(mockProvider.faviconUrl, mockProvider.name);
  });

  it('should reset services and delete preprint on destroy', () => {
    setup();

    component.ngOnDestroy();

    expect(headerStyleMock.resetToDefaults).toHaveBeenCalled();
    expect(brandServiceMock.resetBranding).toHaveBeenCalled();
    expect(browserTabMock.resetToDefaults).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new DeletePreprint());
    expect(store.dispatch).toHaveBeenCalledWith(new ResetPreprintStepperState());
  });

  it('should filter out AuthorAssertions step when assertions are disabled', () => {
    setup();

    const stepValues = component.steps().map((s) => s.value);

    expect(stepValues).not.toContain(PreprintSteps.AuthorAssertions);
    expect(stepValues).toContain(PreprintSteps.TitleAndAbstract);
    expect(stepValues).toContain(PreprintSteps.File);
    expect(stepValues).toContain(PreprintSteps.Metadata);
    expect(stepValues).toContain(PreprintSteps.Supplements);
    expect(stepValues).toContain(PreprintSteps.Review);
  });

  it('should include AuthorAssertions step when assertions are enabled', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId),
          value: { ...mockProvider, assertionsEnabled: true },
        },
      ],
    });

    const stepValues = component.steps().map((s) => s.value);
    expect(stepValues).toContain(PreprintSteps.AuthorAssertions);
  });

  it('should re-index steps sequentially', () => {
    setup();

    const steps = component.steps();
    steps.forEach((step, i) => expect(step.index).toBe(i));
  });

  it('should return empty steps when provider is unavailable', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId), value: null },
        { selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading, value: true },
      ],
    });

    expect(component.steps()).toEqual([]);
  });

  it('should prevent beforeunload when not submitted', () => {
    setup();
    const event = { preventDefault: jest.fn() } as unknown as BeforeUnloadEvent;

    component.onBeforeUnload(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent beforeunload when submitted', () => {
    setup({ selectorOverrides: [{ selector: PreprintStepperSelectors.hasBeenSubmitted, value: true }] });
    const event = { preventDefault: jest.fn() } as unknown as BeforeUnloadEvent;

    component.onBeforeUnload(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent deactivation when not submitted', () => {
    setup();

    expect(component.canDeactivate()).toBe(false);
  });

  it('should allow deactivation when submitted', () => {
    setup({ selectorOverrides: [{ selector: PreprintStepperSelectors.hasBeenSubmitted, value: true }] });

    expect(component.canDeactivate()).toBe(true);
  });

  it('should ignore stepping forward via stepper', () => {
    setup();

    component.stepChange(component.steps()[1]);

    expect(component.currentStep()).toEqual(submitPreprintSteps[0]);
  });

  it('should allow stepping back via stepper', () => {
    setup();
    component.moveToNextStep();

    component.stepChange(component.steps()[0]);

    expect(component.currentStep()).toEqual(component.steps()[0]);
  });

  it('should move to next step', () => {
    setup();
    const expectedNext = component.steps()[1];

    component.moveToNextStep();

    expect(component.currentStep()).toEqual(expectedNext);
  });

  it('should not move past the last step', () => {
    setup();
    const steps = component.steps();
    const lastStep = steps[steps.length - 1];
    component.currentStep.set(lastStep);

    component.moveToNextStep();

    expect(component.currentStep()).toEqual(lastStep);
  });

  it('should move to previous step', () => {
    setup();
    component.moveToNextStep();
    const firstStep = component.steps()[0];

    component.moveToPreviousStep();

    expect(component.currentStep()).toEqual(firstStep);
  });

  it('should not move before the first step', () => {
    setup();
    const firstStep = component.steps()[0];
    component.currentStep.set(firstStep);

    component.moveToPreviousStep();

    expect(component.currentStep()).toEqual(firstStep);
  });
});
