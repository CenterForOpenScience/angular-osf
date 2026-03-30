import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesSelectors, UpdateDraft } from '@osf/features/registries/store';
import { DraftRegistrationModel } from '@osf/shared/models/registration/draft-registration.model';

import { CustomStepComponent } from '../../components/custom-step/custom-step.component';

import { DraftRegistrationCustomStepComponent } from './draft-registration-custom-step.component';

import { MOCK_REGISTRIES_PAGE } from '@testing/mocks/registries.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_DRAFT: Partial<DraftRegistrationModel> = {
  id: 'draft-1',
  providerId: 'prov-1',
  branchedFrom: { id: 'node-1', filesLink: '/files' },
};
const MOCK_STEPS_DATA: Record<string, string> = { 'question-1': 'answer-1' };

describe('DraftRegistrationCustomStepComponent', () => {
  let component: DraftRegistrationCustomStepComponent;
  let fixture: ComponentFixture<DraftRegistrationCustomStepComponent>;
  let store: Store;
  let mockRouter: RouterMockType;

  function setup(
    draft: Partial<DraftRegistrationModel> | null = MOCK_DRAFT,
    stepsData: Record<string, string> = MOCK_STEPS_DATA
  ) {
    const mockRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1', step: '1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/prov-1/draft/draft-1/custom').build();

    TestBed.configureTestingModule({
      imports: [DraftRegistrationCustomStepComponent, MockComponent(CustomStepComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getStepsData, value: stepsData },
            { selector: RegistriesSelectors.getDraftRegistration, value: draft },
            { selector: RegistriesSelectors.getPagesSchema, value: [MOCK_REGISTRIES_PAGE] },
            { selector: RegistriesSelectors.getStepsState, value: { 1: { invalid: false } } },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(DraftRegistrationCustomStepComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should compute inputs from draft registration', () => {
    setup();
    expect(component.filesLink()).toBe('/files');
    expect(component.provider()).toBe('prov-1');
    expect(component.projectId()).toBe('node-1');
  });

  it('should return empty strings when draftRegistration is null', () => {
    setup(null, {});
    expect(component.filesLink()).toBe('');
    expect(component.provider()).toBe('');
    expect(component.projectId()).toBe('');
  });

  it('should dispatch updateDraft with wrapped registration_responses', () => {
    setup();
    component.onUpdateAction({ field1: 'value1', field2: ['a', 'b'] } as any);
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateDraft('draft-1', { registration_responses: { field1: 'value1', field2: ['a', 'b'] } })
    );
  });

  it('should navigate back to metadata on onBack', () => {
    setup();
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../', 'metadata'],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });

  it('should navigate to review on onNext', () => {
    setup();
    component.onNext();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../', 'review'],
      expect.objectContaining({ relativeTo: expect.anything() })
    );
  });
});
