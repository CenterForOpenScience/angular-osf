import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { LoaderService } from '@osf/shared/services/loader.service';

import { RegistriesSelectors } from '../../store';

import { JustificationComponent } from './justification.component';

import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_SCHEMA_RESPONSE = createMockSchemaResponse('resp-1', RevisionReviewStates.RevisionInProgress);

const MOCK_PAGES: PageSchema[] = [
  { id: 'page-1', title: 'Page One', questions: [{ id: 'q1', displayText: 'Q1', required: true, responseKey: 'q1' }] },
  { id: 'page-2', title: 'Page Two', questions: [{ id: 'q2', displayText: 'Q2', required: false, responseKey: 'q2' }] },
];

function buildActivatedRoute(params: Record<string, any> = {}) {
  return {
    snapshot: { firstChild: { params } },
    firstChild: { snapshot: { params } },
  } as unknown as ActivatedRoute;
}

describe('JustificationComponent', () => {
  let component: JustificationComponent;
  let fixture: ComponentFixture<JustificationComponent>;
  let mockRouter: RouterMockType;
  let routerBuilder: RouterMockBuilder;
  let loaderService: jest.Mocked<LoaderService>;
  let actionsMock: {
    getSchemaBlocks: jest.Mock;
    clearState: jest.Mock;
    getSchemaResponse: jest.Mock;
    updateStepState: jest.Mock;
  };

  function setup(
    options: {
      routeParams?: Record<string, any>;
      routerUrl?: string;
      schemaResponse?: SchemaResponse | null;
      pages?: PageSchema[];
      stepsState?: Record<string, { invalid: boolean; touched: boolean }>;
      revisionData?: Record<string, any>;
    } = {}
  ) {
    const {
      routeParams = { id: 'rev-1' },
      routerUrl = '/registries/revisions/rev-1/justification',
      schemaResponse = MOCK_SCHEMA_RESPONSE,
      pages = MOCK_PAGES,
      stepsState = {},
      revisionData = MOCK_SCHEMA_RESPONSE.revisionResponses,
    } = options;

    fixture?.destroy();
    TestBed.resetTestingModule();

    routerBuilder = RouterMockBuilder.create().withUrl(routerUrl);
    mockRouter = routerBuilder.build();
    loaderService = { show: jest.fn(), hide: jest.fn() } as unknown as jest.Mocked<LoaderService>;

    TestBed.configureTestingModule({
      imports: [JustificationComponent, OSFTestingModule, ...MockComponents(StepperComponent, SubHeaderComponent)],
      providers: [
        { provide: ActivatedRoute, useValue: buildActivatedRoute(routeParams) },
        { provide: Router, useValue: mockRouter },
        MockProvider(LoaderService, loaderService),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getSchemaResponse, value: schemaResponse },
            { selector: RegistriesSelectors.getPagesSchema, value: pages },
            { selector: RegistriesSelectors.getStepsState, value: stepsState },
            { selector: RegistriesSelectors.getSchemaResponseRevisionData, value: revisionData },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(JustificationComponent);
    component = fixture.componentInstance;

    actionsMock = {
      getSchemaBlocks: jest.fn().mockReturnValue(of({})),
      clearState: jest.fn().mockReturnValue(of({})),
      getSchemaResponse: jest.fn().mockReturnValue(of({})),
      updateStepState: jest.fn().mockReturnValue(of({})),
    };
    Object.defineProperty(component, 'actions', { value: actionsMock, writable: true });

    fixture.detectChanges();
  }

  beforeEach(() => setup());

  afterEach(() => fixture?.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract revisionId from route params', () => {
    setup({ routeParams: { id: 'rev-42' } });
    expect(component.revisionId).toBe('rev-42');
  });

  it('should default revisionId to empty string when no id param', () => {
    setup({ routeParams: {} });
    expect(component.revisionId).toBe('');
  });

  it('should build justification as first and review as last step with custom steps in between', () => {
    const steps = component.steps();
    expect(steps.length).toBe(4);
    expect(steps[0]).toEqual(expect.objectContaining({ index: 0, value: 'justification', routeLink: 'justification' }));
    expect(steps[1]).toEqual(expect.objectContaining({ index: 1, label: 'Page One', value: 'page-1', routeLink: '1' }));
    expect(steps[2]).toEqual(expect.objectContaining({ index: 2, label: 'Page Two', value: 'page-2', routeLink: '2' }));
    expect(steps[3]).toEqual(
      expect.objectContaining({ index: 3, value: 'review', routeLink: 'review', invalid: false })
    );
  });

  it('should mark justification step as invalid when revisionJustification is empty', () => {
    setup({ schemaResponse: { ...MOCK_SCHEMA_RESPONSE, revisionJustification: '' } });
    const step = component.steps()[0];
    expect(step.invalid).toBe(true);
    expect(step.touched).toBe(false);
  });

  it('should disable steps when reviewsState is not RevisionInProgress', () => {
    setup({ schemaResponse: createMockSchemaResponse('resp-1', RevisionReviewStates.Approved) });
    const steps = component.steps();
    expect(steps[0].disabled).toBe(true);
    expect(steps[1].disabled).toBe(true);
  });

  it('should apply stepsState invalid/touched to custom steps', () => {
    setup({ stepsState: { 1: { invalid: true, touched: true }, 2: { invalid: false, touched: false } } });
    const steps = component.steps();
    expect(steps[1]).toEqual(expect.objectContaining({ invalid: true, touched: true }));
    expect(steps[2]).toEqual(expect.objectContaining({ invalid: false, touched: false }));
  });

  it('should handle null schemaResponse gracefully', () => {
    setup({ schemaResponse: null });
    const step = component.steps()[0];
    expect(step.invalid).toBe(true);
    expect(step.disabled).toBe(true);
  });

  it('should produce only justification and review when no pages', () => {
    setup({ pages: [] });
    const steps = component.steps();
    expect(steps.length).toBe(2);
    expect(steps[0].value).toBe('justification');
    expect(steps[1]).toEqual(expect.objectContaining({ index: 1, value: 'review' }));
  });

  it('should initialize currentStepIndex from route step param', () => {
    setup({ routeParams: { id: 'rev-1', step: '2' } });
    expect(component.currentStepIndex()).toBe(2);
  });

  it('should default currentStepIndex to 0 when no step param', () => {
    expect(component.currentStepIndex()).toBe(0);
  });

  it('should return the step at currentStepIndex', () => {
    component.currentStepIndex.set(0);
    expect(component.currentStep().value).toBe('justification');
  });

  it('should update currentStepIndex and navigate on stepChange', () => {
    component.stepChange({ index: 1, label: 'Page One', value: 'page-1' } as any);

    expect(component.currentStepIndex()).toBe(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/revisions/rev-1/', '1']);
  });

  it('should navigate to review route for last step', () => {
    const reviewIndex = component.steps().length - 1;
    component.stepChange({ index: reviewIndex, label: 'Review', value: 'review' } as any);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/revisions/rev-1/', 'review']);
  });

  it('should update currentStepIndex on NavigationEnd', () => {
    setup({ routeParams: { id: 'rev-1', step: '2' }, routerUrl: '/registries/revisions/rev-1/2' });

    routerBuilder.emit(new NavigationEnd(1, '/test', '/test'));

    expect(component.currentStepIndex()).toBe(2);
  });

  it('should show loader on init', () => {
    expect(loaderService.show).toHaveBeenCalled();
  });

  it('should dispatch FetchSchemaResponse when not already loaded', () => {
    setup({ schemaResponse: null });
    const store = TestBed.inject(Store);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should not dispatch FetchSchemaResponse when already loaded', () => {
    const store = TestBed.inject(Store);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch clearState on destroy', () => {
    component.ngOnDestroy();
    expect(actionsMock.clearState).toHaveBeenCalled();
  });

  it('should detect review page from URL', () => {
    setup({ routerUrl: '/registries/revisions/rev-1/review' });
    expect(component['isReviewPage']).toBe(true);
  });

  it('should return false for isReviewPage when not on review', () => {
    expect(component['isReviewPage']).toBe(false);
  });
});
