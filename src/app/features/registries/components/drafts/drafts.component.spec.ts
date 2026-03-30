import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { ClearState, RegistriesSelectors } from '../../store';

import { DraftsComponent } from './drafts.component';

import {
  MOCK_DRAFT_REGISTRATION,
  MOCK_PAGES_SCHEMA,
  MOCK_REGISTRIES_PAGE_WITH_SECTIONS,
  MOCK_STEPS_DATA,
} from '@testing/mocks/registries.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

interface SetupOverrides {
  routeParams?: Record<string, string>;
  firstChildParams?: Record<string, string> | null;
  routerUrl?: string;
  routerEvents?: unknown;
  selectorOverrides?: { selector: unknown; value: unknown }[];
}

function setup(overrides: SetupOverrides = {}) {
  const routeBuilder = ActivatedRouteMockBuilder.create().withParams(overrides.routeParams ?? { id: 'reg-1' });
  const mockActivatedRoute = routeBuilder.build();

  if (overrides.firstChildParams === null) {
    (mockActivatedRoute as unknown as Record<string, unknown>)['firstChild'] = null;
    (mockActivatedRoute.snapshot as unknown as Record<string, unknown>)['firstChild'] = null;
  } else {
    const childParams = overrides.firstChildParams ?? { id: 'reg-1', step: '1' };
    (mockActivatedRoute.snapshot as unknown as Record<string, unknown>)['firstChild'] = { params: childParams };
    (mockActivatedRoute as unknown as Record<string, unknown>)['firstChild'] = { snapshot: { params: childParams } };
  }

  const mockRouter = RouterMockBuilder.create()
    .withUrl(overrides.routerUrl ?? '/registries/drafts/reg-1/1')
    .build();
  if (overrides.routerEvents !== undefined) {
    mockRouter.events = overrides.routerEvents as RouterMockType['events'];
  } else {
    mockRouter.events = of(new NavigationEnd(1, '/', '/'));
  }

  const defaultSignals: { selector: unknown; value: unknown }[] = [
    { selector: RegistriesSelectors.getPagesSchema, value: MOCK_PAGES_SCHEMA },
    { selector: RegistriesSelectors.getDraftRegistration, value: MOCK_DRAFT_REGISTRATION },
    { selector: RegistriesSelectors.getRegistrationLicense, value: { id: 'mit' } },
    { selector: RegistriesSelectors.getStepsState, value: {} },
    { selector: RegistriesSelectors.getStepsData, value: {} },
    { selector: ContributorsSelectors.getContributors, value: [{ id: 'c1' }] },
    { selector: SubjectsSelectors.getSelectedSubjects, value: [{ id: 's1' }] },
  ];

  const signals = overrides.selectorOverrides
    ? defaultSignals.map((s) => {
        const override = overrides.selectorOverrides!.find((o) => o.selector === s.selector);
        return override ? { ...s, value: override.value } : s;
      })
    : defaultSignals;

  TestBed.configureTestingModule({
    imports: [DraftsComponent, ...MockComponents(StepperComponent, SubHeaderComponent)],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, mockActivatedRoute),
      MockProvider(Router, mockRouter),
      MockProvider(LoaderService, new LoaderServiceMock()),
      provideMockStore({ signals }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(DraftsComponent);
  const component = fixture.componentInstance;

  return {
    fixture,
    component,
    store,
    mockRouter: TestBed.inject(Router) as unknown as RouterMockType,
    mockActivatedRoute,
  };
}

describe('DraftsComponent', () => {
  let component: DraftsComponent;
  let fixture: ComponentFixture<DraftsComponent>;
  let store: Store;
  let mockRouter: RouterMockType;

  beforeEach(() => {
    const result = setup();
    fixture = result.fixture;
    component = result.component;
    store = result.store;
    mockRouter = result.mockRouter;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve registrationId from route firstChild', () => {
    expect(component.registrationId).toBe('reg-1');
  });

  it('should compute isReviewPage from router url', () => {
    expect(component.isReviewPage).toBe(false);
    (mockRouter as unknown as Record<string, unknown>)['url'] = '/registries/drafts/reg-1/review';
    expect(component.isReviewPage).toBe(true);
  });

  it('should build steps from pages and defaults', () => {
    const steps = component.steps();
    expect(steps.length).toBe(3);
    expect(steps[0].routeLink).toBe('metadata');
    expect(steps[1].label).toBe('Page 1');
    expect(steps[2].routeLink).toBe('review');
  });

  it('should set currentStepIndex from route params', () => {
    expect(component.currentStepIndex()).toBe(1);
  });

  it('should compute currentStep from steps and currentStepIndex', () => {
    expect(component.currentStep()).toBeDefined();
    expect(component.currentStep().label).toBe('Page 1');
  });

  it('should compute isMetaDataInvalid as false when all fields present', () => {
    expect(component.isMetaDataInvalid()).toBe(false);
  });

  it('should navigate and update currentStepIndex on stepChange', () => {
    component.stepChange({ index: 0, label: 'Metadata', value: '' });

    expect(component.currentStepIndex()).toBe(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/drafts/reg-1/', 'metadata']);
  });

  it('should dispatch clearState on destroy', () => {
    (store.dispatch as jest.Mock).mockClear();

    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearState());
  });

  it('should compute isMetaDataInvalid as true when title is missing', () => {
    const { component: c } = setup({
      selectorOverrides: [
        { selector: RegistriesSelectors.getDraftRegistration, value: { ...MOCK_DRAFT_REGISTRATION, title: '' } },
      ],
    });

    expect(c.isMetaDataInvalid()).toBe(true);
  });

  it('should compute isMetaDataInvalid as true when subjects are empty', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: SubjectsSelectors.getSelectedSubjects, value: [] }],
    });

    expect(c.isMetaDataInvalid()).toBe(true);
  });

  it('should set metadata step as invalid when license is missing', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getRegistrationLicense, value: null }],
    });

    const steps = c.steps();
    expect(steps[0].invalid).toBe(true);
  });

  it('should dispatch getDraftRegistration when draftRegistration is null', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getDraftRegistration, value: null }],
    });

    expect(c).toBeTruthy();
  });

  it('should dispatch getContributors when contributors list is empty', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: ContributorsSelectors.getContributors, value: [] }],
    });

    expect(c).toBeTruthy();
  });

  it('should dispatch getSubjects when selectedSubjects list is empty', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: SubjectsSelectors.getSelectedSubjects, value: [] }],
    });

    expect(c).toBeTruthy();
  });

  it('should dispatch all actions when all initial data is missing', () => {
    const { component: c } = setup({
      selectorOverrides: [
        { selector: RegistriesSelectors.getDraftRegistration, value: null },
        { selector: ContributorsSelectors.getContributors, value: [] },
        { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
      ],
    });

    expect(c).toBeTruthy();
  });

  it('should hide loader after schema blocks are fetched', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const loaderService = TestBed.inject(LoaderService);
    expect(loaderService.hide).toHaveBeenCalled();
  }));

  it('should not fetch schema blocks when draft has no registrationSchemaId', () => {
    const { fixture: f } = setup({
      selectorOverrides: [
        {
          selector: RegistriesSelectors.getDraftRegistration,
          value: { ...MOCK_DRAFT_REGISTRATION, registrationSchemaId: '' },
        },
      ],
    });

    f.detectChanges();

    const loaderService = TestBed.inject(LoaderService);
    expect(loaderService.hide).not.toHaveBeenCalled();
  });

  it('should set currentStepIndex to pages.length + 1 on review navigation', () => {
    const { component: c } = setup({
      routerUrl: '/registries/drafts/reg-1/review',
      firstChildParams: null,
    });

    expect(c.currentStepIndex()).toBe(MOCK_PAGES_SCHEMA.length + 1);
  });

  it('should reset currentStepIndex to 0 when no step and not review', () => {
    const { component: c } = setup({
      routerUrl: '/registries/drafts/reg-1/metadata',
      firstChildParams: { id: 'reg-1' },
    });

    expect(c.currentStepIndex()).toBe(0);
  });

  it('should set currentStepIndex from step param on navigation', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '2' },
    });

    expect(c.currentStepIndex()).toBe(2);
  });

  it('should sync currentStepIndex to review step when on review page', () => {
    const { component: c } = setup({
      routerUrl: '/registries/drafts/reg-1/review',
      firstChildParams: null,
    });

    expect(c.currentStepIndex()).toBe(MOCK_PAGES_SCHEMA.length + 1);
  });

  it('should include questions from sections when building steps', () => {
    const pagesWithSections = [...MOCK_PAGES_SCHEMA, MOCK_REGISTRIES_PAGE_WITH_SECTIONS];

    const { component: c } = setup({
      selectorOverrides: [
        { selector: RegistriesSelectors.getPagesSchema, value: pagesWithSections },
        { selector: RegistriesSelectors.getStepsData, value: { field1: 'v1', field3: 'v3' } },
      ],
    });

    const steps = c.steps();
    expect(steps.length).toBe(4);
    expect(steps[2].label).toBe('Page 2');
    expect(steps[2].touched).toBe(true);
  });

  it('should not mark section step as touched when no data for section questions', () => {
    const pagesWithSections = [...MOCK_PAGES_SCHEMA, MOCK_REGISTRIES_PAGE_WITH_SECTIONS];

    const { component: c } = setup({
      selectorOverrides: [
        { selector: RegistriesSelectors.getPagesSchema, value: pagesWithSections },
        { selector: RegistriesSelectors.getStepsData, value: {} },
      ],
    });

    const steps = c.steps();
    expect(steps[2].touched).toBe(false);
  });

  it('should mark step as invalid when required field has empty array', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '2' },
      selectorOverrides: [
        { selector: RegistriesSelectors.getStepsData, value: { field1: [], field2: 'v2' } },
        { selector: RegistriesSelectors.getStepsState, value: { 1: { invalid: true, touched: true } } },
      ],
    });

    const steps = c.steps();
    expect(steps[1].invalid).toBe(true);
  });

  it('should not mark step as invalid when required field has non-empty array', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '2' },
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsData, value: { field1: ['item'], field2: 'v2' } }],
    });

    const steps = c.steps();
    expect(steps[1].invalid).toBe(false);
  });

  it('should not mark step as invalid when required field has truthy value', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '2' },
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsData, value: { field1: 'value', field2: '' } }],
    });

    const steps = c.steps();
    expect(steps[1].invalid).toBe(false);
  });

  it('should mark step as invalid when required field is falsy', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '2' },
      selectorOverrides: [
        { selector: RegistriesSelectors.getStepsData, value: { field1: '', field2: 'v2' } },
        { selector: RegistriesSelectors.getStepsState, value: { 1: { invalid: true, touched: true } } },
      ],
    });

    const steps = c.steps();
    expect(steps[1].invalid).toBe(true);
  });

  it('should detect hasStepData with array data', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsData, value: { field1: ['item1'] } }],
    });

    const steps = c.steps();
    expect(steps[1].touched).toBe(true);
  });

  it('should not detect hasStepData with empty array', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsData, value: { field1: [] } }],
    });

    const steps = c.steps();
    expect(steps[1].touched).toBe(false);
  });

  it('should validate previous steps when currentStepIndex > 0', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '1' },
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsData, value: { field1: 'v1' } }],
    });

    expect(c.currentStepIndex()).toBe(1);
    expect(c).toBeTruthy();
  });

  it('should not validate steps when currentStepIndex is 0', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '0' },
      routerUrl: '/registries/drafts/reg-1/metadata',
    });

    expect(c.currentStepIndex()).toBe(0);
  });

  it('should validate metadata step as invalid when license is missing', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '1' },
      selectorOverrides: [
        { selector: RegistriesSelectors.getRegistrationLicense, value: null },
        { selector: RegistriesSelectors.getStepsData, value: { field1: 'v1' } },
      ],
    });

    expect(c.isMetaDataInvalid()).toBe(true);
  });

  it('should validate metadata step as invalid when description is missing', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1', step: '1' },
      selectorOverrides: [
        { selector: RegistriesSelectors.getDraftRegistration, value: { ...MOCK_DRAFT_REGISTRATION, description: '' } },
        { selector: RegistriesSelectors.getStepsData, value: { field1: 'v1' } },
      ],
    });

    expect(c.isMetaDataInvalid()).toBe(true);
  });

  it('should default registrationId to empty string when no firstChild', () => {
    const { component: c } = setup({
      routerUrl: '/registries/drafts/',
      firstChildParams: null,
    });

    expect(c.registrationId).toBe('');
  });

  it('should default currentStepIndex to 0 when step param is absent', () => {
    const { component: c } = setup({
      firstChildParams: { id: 'reg-1' },
      routerUrl: '/registries/drafts/reg-1/metadata',
    });

    expect(c.currentStepIndex()).toBe(0);
  });

  it('should mark step as touched when stepsData has matching keys', () => {
    const { component: c } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getStepsData, value: MOCK_STEPS_DATA }],
    });

    const steps = c.steps();
    expect(steps[1].touched).toBe(true);
  });
});
