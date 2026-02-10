import { MockComponent, ngMocks } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';

import { CustomStepComponent } from '../../components/custom-step/custom-step.component';

import { DraftRegistrationCustomStepComponent } from './draft-registration-custom-step.component';

import { MOCK_REGISTRIES_PAGE } from '@testing/mocks/registries.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_DRAFT = { id: 'draft-1', providerId: 'prov-1', branchedFrom: { id: 'node-1', filesLink: '/files' } };
const MOCK_STEPS_DATA = { 'question-1': 'answer-1' };

describe('DraftRegistrationCustomStepComponent', () => {
  let component: DraftRegistrationCustomStepComponent;
  let fixture: ComponentFixture<DraftRegistrationCustomStepComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1', step: '1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/prov-1/draft/draft-1/custom').build();

    await TestBed.configureTestingModule({
      imports: [DraftRegistrationCustomStepComponent, OSFTestingModule, MockComponent(CustomStepComponent)],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getStepsData, value: MOCK_STEPS_DATA },
            { selector: RegistriesSelectors.getDraftRegistration, value: MOCK_DRAFT },
            { selector: RegistriesSelectors.getPagesSchema, value: [MOCK_REGISTRIES_PAGE] },
            { selector: RegistriesSelectors.getStepsState, value: { 1: { invalid: false } } },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftRegistrationCustomStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute inputs from draft registration', () => {
    expect(component.filesLink()).toBe('/files');
    expect(component.provider()).toBe('prov-1');
    expect(component.projectId()).toBe('node-1');
  });

  it('should dispatch updateDraft on onUpdateAction', () => {
    const actionsMock = { updateDraft: jest.fn() } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });

    component.onUpdateAction({ a: 1 } as any);
    expect(actionsMock.updateDraft).toHaveBeenCalledWith('draft-1', { registration_responses: { a: 1 } });
  });

  it('should navigate back to metadata on onBack', () => {
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.onBack();
    expect(navigateSpy).toHaveBeenCalledWith(['../', 'metadata'], { relativeTo: TestBed.inject(ActivatedRoute) });
  });

  it('should navigate to review on onNext', () => {
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.onNext();
    expect(navigateSpy).toHaveBeenCalledWith(['../', 'review'], { relativeTo: TestBed.inject(ActivatedRoute) });
  });

  it('should pass stepsData to custom step component', () => {
    const customStep = ngMocks.find(CustomStepComponent).componentInstance;
    expect(customStep.stepsData).toEqual(MOCK_STEPS_DATA);
  });

  it('should pass filesLink, projectId, and provider to custom step component', () => {
    const customStep = ngMocks.find(CustomStepComponent).componentInstance;
    expect(customStep.filesLink).toBe('/files');
    expect(customStep.projectId).toBe('node-1');
    expect(customStep.provider).toBe('prov-1');
  });

  it('should return empty strings when draftRegistration is null', async () => {
    TestBed.resetTestingModule();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1', step: '1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/prov-1/draft/draft-1/custom').build();

    await TestBed.configureTestingModule({
      imports: [DraftRegistrationCustomStepComponent, OSFTestingModule, MockComponent(CustomStepComponent)],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getStepsData, value: {} },
            { selector: RegistriesSelectors.getDraftRegistration, value: null },
            { selector: RegistriesSelectors.getPagesSchema, value: [MOCK_REGISTRIES_PAGE] },
            { selector: RegistriesSelectors.getStepsState, value: {} },
          ],
        }),
      ],
    }).compileComponents();

    const nullFixture = TestBed.createComponent(DraftRegistrationCustomStepComponent);
    const nullComponent = nullFixture.componentInstance;
    nullFixture.detectChanges();

    expect(nullComponent.filesLink()).toBe('');
    expect(nullComponent.provider()).toBe('');
    expect(nullComponent.projectId()).toBe('');
  });

  it('should wrap attributes in registration_responses on update', () => {
    const actionsMock = { updateDraft: jest.fn() } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });

    const attributes = { field1: 'value1', field2: ['a', 'b'] };
    component.onUpdateAction(attributes as any);

    expect(actionsMock.updateDraft).toHaveBeenCalledWith('draft-1', {
      registration_responses: { field1: 'value1', field2: ['a', 'b'] },
    });
  });
});
