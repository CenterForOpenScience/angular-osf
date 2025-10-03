import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { StepperComponent, SubHeaderComponent } from '@osf/shared/components';
import { ContributorsSelectors, SubjectsSelectors } from '@shared/stores';

import { DraftsComponent } from './drafts.component';

import { MOCK_DRAFT_REGISTRATION, MOCK_PAGES_SCHEMA } from '@testing/mocks/registries.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('DraftsComponent', () => {
  let component: DraftsComponent;
  let fixture: ComponentFixture<DraftsComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  const MOCK_PAGES = MOCK_PAGES_SCHEMA;
  const MOCK_DRAFT = MOCK_DRAFT_REGISTRATION;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'reg-1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/drafts/reg-1/1').build();
    mockRouter.events = of(new NavigationEnd(1, '/', '/'));

    await TestBed.configureTestingModule({
      imports: [DraftsComponent, OSFTestingModule, ...MockComponents(StepperComponent, SubHeaderComponent)],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getPagesSchema, value: MOCK_PAGES },
            { selector: RegistriesSelectors.getDraftRegistration, value: MOCK_DRAFT },
            { selector: RegistriesSelectors.getStepsState, value: {} },
            { selector: RegistriesSelectors.getStepsData, value: {} },
            { selector: ContributorsSelectors.getContributors, value: [] },
            { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute isReviewPage from router url', () => {
    expect(component.isReviewPage).toBe(false);
    const router = TestBed.inject(Router) as any;
    router.url = '/registries/drafts/reg-1/review';
    expect(component.isReviewPage).toBe(true);
  });

  it('should build steps from pages and defaults', () => {
    const steps = component.steps();
    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBe(3);
    expect(component.currentStep()).toBeDefined();
  });
});
