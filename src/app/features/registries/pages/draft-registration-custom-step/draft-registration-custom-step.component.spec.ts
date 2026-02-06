import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { DraftRegistrationAttributesJsonApi } from '@osf/shared/models/registration/registration-json-api.model';

import { CustomStepComponent } from '../../components/custom-step/custom-step.component';
import { RegistriesSelectors, UpdateDraft } from '../../store';

import { DraftRegistrationCustomStepComponent } from './draft-registration-custom-step.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('DraftRegistrationCustomStepComponent', () => {
  let component: DraftRegistrationCustomStepComponent;
  let fixture: ComponentFixture<DraftRegistrationCustomStepComponent>;
  let store: Store;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockStepsData = { stepKey: { field: 'value' } };
  const mockDraftRegistration = {
    id: 'draft-1',
    providerId: 'prov-1',
    branchedFrom: { id: 'proj-1', filesLink: '/project/proj-1/files/' },
  };

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();

    await TestBed.configureTestingModule({
      imports: [DraftRegistrationCustomStepComponent, OSFTestingModule, MockComponent(CustomStepComponent)],
      providers: [
        MockProvider(Router, mockRouter),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getStepsData, value: mockStepsData },
            { selector: RegistriesSelectors.getDraftRegistration, value: mockDraftRegistration },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftRegistrationCustomStepComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    (store.dispatch as jest.Mock).mockReturnValue(of(void 0));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return stepsData and draftRegistration from store', () => {
    expect(component.stepsData()).toEqual(mockStepsData);
    expect(component.draftRegistration()).toEqual(mockDraftRegistration);
  });

  it('should compute filesLink from draftRegistration branchedFrom', () => {
    expect(component.filesLink()).toBe('/project/proj-1/files/');
  });

  it('should compute provider from draftRegistration providerId', () => {
    expect(component.provider()).toBe('prov-1');
  });

  it('should compute projectId from draftRegistration branchedFrom id', () => {
    expect(component.projectId()).toBe('proj-1');
  });

  it('should dispatch UpdateDraft with id and registration_responses payload on onUpdateAction', () => {
    const attributes: Partial<DraftRegistrationAttributesJsonApi> = {
      registration_responses: { field1: 'value1' },
    };
    (store.dispatch as jest.Mock).mockClear();

    component.onUpdateAction(attributes);

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(UpdateDraft));
    const call = (store.dispatch as jest.Mock).mock.calls.find((c) => c[0] instanceof UpdateDraft);
    expect(call[0].draftId).toBe('draft-1');
    expect(call[0].attributes).toEqual({ registration_responses: { registration_responses: { field1: 'value1' } } });
  });

  it('should navigate to ../metadata on onBack', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../', 'metadata'],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });

  it('should navigate to ../review on onNext', () => {
    component.onNext();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../', 'review'],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });
});

describe('DraftRegistrationCustomStepComponent when no draft registration', () => {
  let component: DraftRegistrationCustomStepComponent;
  let fixture: ComponentFixture<DraftRegistrationCustomStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftRegistrationCustomStepComponent, OSFTestingModule, MockComponent(CustomStepComponent)],
      providers: [
        MockProvider(Router, RouterMockBuilder.create().build()),
        MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build()),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getStepsData, value: {} },
            { selector: RegistriesSelectors.getDraftRegistration, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftRegistrationCustomStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute empty filesLink provider and projectId', () => {
    expect(component.filesLink()).toBe('');
    expect(component.provider()).toBe('');
    expect(component.projectId()).toBe('');
  });
});
