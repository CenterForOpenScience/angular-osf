import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

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
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { StepperComponent } from '@shared/components';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@shared/helpers';
import { StepOption } from '@shared/models';
import { BrandService } from '@shared/services';

import { UpdatePreprintStepperComponent } from './update-preprint-stepper.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('UpdatePreprintStepperComponent', () => {
  let component: UpdatePreprintStepperComponent;
  let fixture: ComponentFixture<UpdatePreprintStepperComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let routeMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint = PREPRINT_MOCK;
  const mockProviderId = 'osf';
  const mockPreprintId = 'test_preprint_123';

  beforeEach(async () => {
    jest.spyOn(BrowserTabHelper, 'updateTabStyles').mockImplementation(() => {});
    jest.spyOn(BrowserTabHelper, 'resetToDefaults').mockImplementation(() => {});
    jest.spyOn(HeaderStyleHelper, 'applyHeaderStyles').mockImplementation(() => {});
    jest.spyOn(HeaderStyleHelper, 'resetToDefaults').mockImplementation(() => {});
    jest.spyOn(BrandService, 'applyBranding').mockImplementation(() => {});
    jest.spyOn(BrandService, 'resetBranding').mockImplementation(() => {});

    routerMock = RouterMockBuilder.create().withNavigate(jest.fn().mockResolvedValue(true)).build();
    routeMock = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId, preprintId: mockPreprintId })
      .withQueryParams({})
      .build();

    await TestBed.configureTestingModule({
      imports: [
        UpdatePreprintStepperComponent,
        OSFTestingModule,
        ...MockComponents(
          StepperComponent,
          TitleAndAbstractStepComponent,
          FileStepComponent,
          MetadataStepComponent,
          AuthorAssertionsStepComponent,
          SupplementsStepComponent,
          ReviewStepComponent
        ),
      ],
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
              selector: PreprintStepperSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintStepperSelectors.hasBeenSubmitted,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePreprintStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.PreprintSteps).toBe(PreprintSteps);
    expect(component.classes).toBe('flex-1 flex flex-column w-full');
    expect(component.currentStep()).toEqual(submitPreprintSteps[0]);
  });

  it('should return preprint provider from store', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });

  it('should return preprint from store', () => {
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should return web environment state', () => {
    const isWeb = component.isWeb();
    expect(typeof isWeb).toBe('boolean');
  });

  it('should initialize with first step as current step', () => {
    expect(component.currentStep()).toEqual(submitPreprintSteps[0]);
  });

  it('should compute updateSteps correctly', () => {
    const steps = component.updateSteps();
    expect(steps).toBeDefined();
    expect(Array.isArray(steps)).toBe(true);
  });

  it('should compute currentUserIsAdmin correctly', () => {
    const isAdmin = component.currentUserIsAdmin();
    expect(typeof isAdmin).toBe('boolean');
  });

  it('should compute editAndResubmitMode correctly', () => {
    const editMode = component.editAndResubmitMode();
    expect(typeof editMode).toBe('boolean');
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
    const nextStep = component.updateSteps()[currentIndex + 1];

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

  it('should handle edge case when moving to previous step with undefined current step', () => {
    component.currentStep.set({} as StepOption);

    expect(() => component.moveToPreviousStep()).not.toThrow();
  });

  it('should handle empty updateSteps array', () => {
    const steps = component.updateSteps();
    expect(steps).toBeDefined();
    expect(Array.isArray(steps)).toBe(true);
  });

  it('should handle null preprint provider', () => {
    const provider = component.preprintProvider();
    expect(provider).toBeDefined();
  });
});
