import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { FileStepComponent, ReviewStepComponent } from '@osf/features/preprints/components';
import { createNewVersionStepsConst } from '@osf/features/preprints/constants';
import { PreprintSteps } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { StepperComponent } from '@shared/components';
import { BrowserTabHelper, HeaderStyleHelper, IS_WEB } from '@shared/helpers';
import { StepOption } from '@shared/models';
import { BrandService } from '@shared/services';

import { CreateNewVersionComponent } from './create-new-version.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('CreateNewVersionComponent', () => {
  let component: CreateNewVersionComponent;
  let fixture: ComponentFixture<CreateNewVersionComponent>;
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
        CreateNewVersionComponent,
        OSFTestingModule,
        ...MockComponents(StepperComponent, FileStepComponent, ReviewStepComponent),
      ],
      providers: [
        TranslationServiceMock,
        MockProvider(BrandService),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, routeMock),
        { provide: IS_WEB, useValue: of(true) },
        provideMockStore({
          signals: [
            {
              selector: PreprintStepperSelectors.getPreprint,
              value: mockPreprint,
            },
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
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.PreprintSteps).toBe(PreprintSteps);
    expect(component.newVersionSteps).toBe(createNewVersionStepsConst);
    expect(component.currentStep()).toEqual(createNewVersionStepsConst[0]);
    expect(component.classes).toBe('flex-1 flex flex-column w-full');
  });

  it('should return preprint from store', () => {
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should return preprint provider from store', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });

  it('should return loading state from store', () => {
    const loading = component.isPreprintProviderLoading();
    expect(loading).toBe(false);
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
    expect(component.currentStep()).toEqual(createNewVersionStepsConst[0]);
  });

  it('should handle step change when moving to previous step', () => {
    const previousStep = createNewVersionStepsConst[0];

    component.stepChange(previousStep);

    expect(component.currentStep()).toEqual(previousStep);
  });

  it('should not change step when moving to next step', () => {
    const currentStep = component.currentStep();
    const nextStep = createNewVersionStepsConst[1];

    component.stepChange(nextStep);

    expect(component.currentStep()).toEqual(currentStep);
  });

  it('should move to next step', () => {
    const currentIndex = component.currentStep()?.index ?? 0;
    const nextStep = createNewVersionStepsConst[currentIndex + 1];

    component.moveToNextStep();

    expect(component.currentStep()).toEqual(nextStep);
  });

  it('should navigate to previous step (preprint page)', () => {
    component.moveToPreviousStep();

    expect(routerMock.navigate).toHaveBeenCalledWith([mockPreprintId.split('_')[0]]);
  });

  it('should return canDeactivate state', () => {
    const canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBe(false);
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
    expect(component.currentStep()).toEqual(createNewVersionStepsConst[1]);

    component.stepChange(createNewVersionStepsConst[0]);
    expect(component.currentStep()).toEqual(createNewVersionStepsConst[0]);
  });

  it('should handle edge case when moving to next step with undefined current step', () => {
    component.currentStep.set({} as StepOption);

    expect(() => component.moveToNextStep()).not.toThrow();
  });
});
