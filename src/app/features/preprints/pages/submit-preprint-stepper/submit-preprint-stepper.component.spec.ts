import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { submitPreprintSteps } from '@osf/features/preprints/constants';
import { PreprintSteps } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@shared/helpers';
import { StepOption } from '@shared/models';
import { BrandService } from '@shared/services';

import { SubmitPreprintStepperComponent } from './submit-preprint-stepper.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('SubmitPreprintStepperComponent', () => {
  let component: SubmitPreprintStepperComponent;
  let fixture: ComponentFixture<SubmitPreprintStepperComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let routeMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockProviderId = 'osf';

  beforeEach(async () => {
    jest.spyOn(BrowserTabHelper, 'updateTabStyles').mockImplementation(() => {});
    jest.spyOn(BrowserTabHelper, 'resetToDefaults').mockImplementation(() => {});
    jest.spyOn(HeaderStyleHelper, 'applyHeaderStyles').mockImplementation(() => {});
    jest.spyOn(HeaderStyleHelper, 'resetToDefaults').mockImplementation(() => {});
    jest.spyOn(BrandService, 'applyBranding').mockImplementation(() => {});
    jest.spyOn(BrandService, 'resetBranding').mockImplementation(() => {});

    routerMock = RouterMockBuilder.create().withNavigate(jest.fn().mockResolvedValue(true)).build();
    routeMock = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId })
      .withQueryParams({})
      .build();

    await TestBed.configureTestingModule({
      imports: [SubmitPreprintStepperComponent, OSFTestingModule],
      providers: [
        MockProvider(BrandService),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, routeMock),
        { provide: IS_WEB, useValue: of(true) },
        provideMockStore({
          signals: [
            {
              selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId),
              value: mockProvider,
            },
            {
              selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading,
              value: false,
            },
            {
              selector: PreprintStepperSelectors.hasBeenSubmitted,
              value: false,
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitPreprintStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.SubmitStepsEnum).toBe(PreprintSteps);
    expect(component.classes).toBe('flex-1 flex flex-column w-full');
    expect(component.currentStep()).toEqual(submitPreprintSteps[0]);
  });

  it('should return submission state from store', () => {
    const submitted = component.hasBeenSubmitted();
    expect(submitted).toBe(false);
  });

  it('should return web environment state', () => {
    const isWeb = component.isWeb();
    expect(typeof isWeb).toBe('boolean');
  });

  it('should initialize with first step as current step', () => {
    expect(component.currentStep()).toEqual(submitPreprintSteps[0]);
  });

  it('should compute submitPreprintSteps correctly', () => {
    const steps = component.submitPreprintSteps();
    expect(steps).toBeDefined();
    expect(Array.isArray(steps)).toBe(true);
  });

  it('should handle step change when moving to previous step', () => {
    const previousStep = submitPreprintSteps[0];

    component.stepChange(previousStep);

    expect(component.currentStep()).toEqual(previousStep);
  });

  it('should not change step when moving to next step', () => {
    const currentStep = component.currentStep();
    const nextStep = submitPreprintSteps[1];

    component.stepChange(nextStep);

    expect(component.currentStep()).toEqual(currentStep);
  });

  it('should move to next step', () => {
    const currentIndex = component.currentStep()?.index ?? 0;
    const nextStep = component.submitPreprintSteps()[currentIndex + 1];

    if (nextStep) {
      component.moveToNextStep();
      expect(component.currentStep()).toEqual(nextStep);
    }
  });

  it('should move to previous step', () => {
    component.moveToNextStep();
    const nextStep = component.currentStep();

    component.moveToPreviousStep();
    const previousStep = component.currentStep();

    expect(previousStep?.index).toBeLessThan(nextStep?.index ?? 0);
  });

  it('should handle beforeunload event', () => {
    const event = {
      preventDefault: jest.fn(),
    } as unknown as BeforeUnloadEvent;

    const result = component.onBeforeUnload(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should handle step navigation correctly', () => {
    component.moveToNextStep();
    const nextStep = component.currentStep();
    expect(nextStep).toBeDefined();

    component.moveToPreviousStep();
    const previousStep = component.currentStep();
    expect(previousStep).toBeDefined();
  });

  it('should handle edge case when moving to next step with undefined current step', () => {
    component.currentStep.set({} as StepOption);

    expect(() => component.moveToNextStep()).not.toThrow();
  });
});
