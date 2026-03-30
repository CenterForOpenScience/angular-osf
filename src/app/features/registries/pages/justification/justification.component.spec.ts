import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { StepperComponent } from '@osf/shared/components/stepper/stepper.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { LoaderService } from '@osf/shared/services/loader.service';

import { ClearState, FetchSchemaBlocks, FetchSchemaResponse, RegistriesSelectors } from '../../store';

import { JustificationComponent } from './justification.component';

import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_SCHEMA_RESPONSE = createMockSchemaResponse('resp-1', RevisionReviewStates.RevisionInProgress);

const MOCK_PAGES: PageSchema[] = [
  { id: 'page-1', title: 'Page One', questions: [{ id: 'q1', displayText: 'Q1', required: true, responseKey: 'q1' }] },
  { id: 'page-2', title: 'Page Two', questions: [{ id: 'q2', displayText: 'Q2', required: false, responseKey: 'q2' }] },
];

interface SetupOptions {
  routeParams?: Record<string, any>;
  routerUrl?: string;
  schemaResponse?: SchemaResponse | null;
  pages?: PageSchema[];
  stepsState?: Record<string, { invalid: boolean; touched: boolean }>;
  revisionData?: Record<string, any>;
}

describe('JustificationComponent', () => {
  let component: JustificationComponent;
  let fixture: ComponentFixture<JustificationComponent>;
  let store: Store;
  let mockRouter: RouterMockType;
  let routerBuilder: RouterMockBuilder;
  let loaderService: LoaderServiceMock;

  function setup(options: SetupOptions = {}) {
    const {
      routeParams = { id: 'rev-1' },
      routerUrl = '/registries/revisions/rev-1/justification',
      schemaResponse = MOCK_SCHEMA_RESPONSE,
      pages = MOCK_PAGES,
      stepsState = {},
      revisionData = MOCK_SCHEMA_RESPONSE.revisionResponses,
    } = options;

    routerBuilder = RouterMockBuilder.create().withUrl(routerUrl);
    mockRouter = routerBuilder.build();
    loaderService = new LoaderServiceMock();

    const mockRoute = ActivatedRouteMockBuilder.create()
      .withFirstChild((child) => child.withParams(routeParams))
      .build();

    TestBed.configureTestingModule({
      imports: [JustificationComponent, ...MockComponents(StepperComponent, SubHeaderComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockRoute),
        MockProvider(Router, mockRouter),
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
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
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
    setup();
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
    setup();
    expect(component.currentStepIndex()).toBe(0);
  });

  it('should return the step at currentStepIndex', () => {
    setup();
    component.currentStepIndex.set(0);
    expect(component.currentStep().value).toBe('justification');
  });

  it('should update currentStepIndex and navigate on stepChange', () => {
    setup();
    component.stepChange({ index: 1, label: 'Page One', value: 'page-1' } as any);
    expect(component.currentStepIndex()).toBe(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/revisions/rev-1/', '1']);
  });

  it('should navigate to review route for last step', () => {
    setup();
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
    setup();
    expect(loaderService.show).toHaveBeenCalled();
  });

  it('should dispatch FetchSchemaResponse when not already loaded', () => {
    setup({ schemaResponse: null });
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSchemaResponse('rev-1'));
  });

  it('should not dispatch FetchSchemaResponse when already loaded', () => {
    setup();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchSchemaResponse));
  });

  it('should dispatch FetchSchemaBlocks when schemaResponse has registrationSchemaId', () => {
    setup();
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSchemaBlocks(MOCK_SCHEMA_RESPONSE.registrationSchemaId));
  });

  it('should dispatch clearState on destroy', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ClearState());
  });

  it('should detect review page from URL', () => {
    setup({ routerUrl: '/registries/revisions/rev-1/review' });
    expect(component['isReviewPage']).toBe(true);
  });

  it('should return false for isReviewPage when not on review', () => {
    setup();
    expect(component['isReviewPage']).toBe(false);
  });

  it('should set currentStepIndex to last step on NavigationEnd when on review page without step param', () => {
    setup({ routeParams: { id: 'rev-1' }, routerUrl: '/registries/revisions/rev-1/review' });
    component.currentStepIndex.set(0);
    routerBuilder.emit(new NavigationEnd(2, '/review', '/review'));
    expect(component.currentStepIndex()).toBe(MOCK_PAGES.length + 1);
  });

  it('should reset currentStepIndex to 0 on NavigationEnd when not on review and no step param', () => {
    setup({ routeParams: { id: 'rev-1' }, routerUrl: '/registries/revisions/rev-1/justification' });
    component.currentStepIndex.set(2);
    routerBuilder.emit(new NavigationEnd(2, '/justification', '/justification'));
    expect(component.currentStepIndex()).toBe(0);
  });
});
