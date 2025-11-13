import { MockComponent } from 'ng-mocks';

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

describe.skip('DraftRegistrationCustomStepComponent', () => {
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
            { selector: RegistriesSelectors.getStepsData, value: {} },
            {
              selector: RegistriesSelectors.getDraftRegistration,
              value: { id: 'draft-1', providerId: 'prov-1', branchedFrom: { id: 'node-1', filesLink: '/files' } },
            },
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
});
