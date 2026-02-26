import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsState } from '@osf/features/preprints/enums';
import { PreprintModel, PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintStepperSelectors, SetInstitutionsChanged } from '@osf/features/preprints/store/preprint-stepper';
import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import {
  FetchResourceInstitutions,
  FetchUserInstitutions,
  InstitutionsSelectors,
  UpdateResourceInstitutions,
} from '@shared/stores/institutions';

import { PreprintsAffiliatedInstitutionsComponent } from './preprints-affiliated-institutions.component';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

describe('PreprintsAffiliatedInstitutionsComponent', () => {
  let component: PreprintsAffiliatedInstitutionsComponent;
  let fixture: ComponentFixture<PreprintsAffiliatedInstitutionsComponent>;
  let store: Store;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint: PreprintModel = PREPRINT_MOCK;
  const mockUserInstitutions: Institution[] = [MOCK_INSTITUTION];
  const mockResourceInstitutions: Institution[] = [MOCK_INSTITUTION];

  const defaultSignals: SignalOverride[] = [
    { selector: InstitutionsSelectors.getUserInstitutions, value: mockUserInstitutions },
    { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
    { selector: InstitutionsSelectors.getResourceInstitutions, value: mockResourceInstitutions },
    { selector: InstitutionsSelectors.areResourceInstitutionsLoading, value: false },
    { selector: InstitutionsSelectors.areResourceInstitutionsSubmitting, value: false },
    { selector: PreprintStepperSelectors.getInstitutionsChanged, value: false },
  ];

  function setup(overrides?: {
    selectorOverrides?: SignalOverride[];
    preprint?: PreprintModel;
    detectChanges?: boolean;
  }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [PreprintsAffiliatedInstitutionsComponent, MockComponent(AffiliatedInstitutionSelectComponent)],
      providers: [provideOSFCore(), provideMockStore({ signals })],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintsAffiliatedInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.componentRef.setInput('preprint', overrides?.preprint ?? mockPreprint);
    if (overrides?.detectChanges ?? true) {
      fixture.detectChanges();
    }
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should compute loading state when any loading flag is true', () => {
    setup({
      selectorOverrides: [{ selector: InstitutionsSelectors.areResourceInstitutionsSubmitting, value: true }],
    });
    expect(component.isLoading()).toBe(true);
  });

  it('should initialize selected institutions from resource institutions effect', () => {
    setup();
    expect(component.selectedInstitutions()).toEqual(mockResourceInstitutions);
  });

  it('should keep selected institutions empty when resource institutions are empty', () => {
    setup({
      selectorOverrides: [{ selector: InstitutionsSelectors.getResourceInstitutions, value: [] }],
    });
    expect(component.selectedInstitutions()).toEqual([]);
  });

  it('should dispatch fetch actions on init lifecycle', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchUserInstitutions());
    expect(store.dispatch).toHaveBeenCalledWith(new FetchResourceInstitutions(mockPreprint.id, ResourceType.Preprint));
  });

  it('should auto-apply user institutions on create flow when institutions not changed', () => {
    setup({
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Initial },
    });

    expect(store.dispatch).toHaveBeenCalledWith(new SetInstitutionsChanged(true));
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateResourceInstitutions(mockPreprint.id, ResourceType.Preprint, mockUserInstitutions)
    );
  });

  it('should not auto-apply user institutions when not in create flow', () => {
    setup({
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Pending },
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SetInstitutionsChanged));
    expect(store.dispatch).not.toHaveBeenCalledWith(
      new UpdateResourceInstitutions(mockPreprint.id, ResourceType.Preprint, mockUserInstitutions)
    );
  });

  it('should not auto-apply user institutions when institutions already changed', () => {
    setup({
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Initial },
      selectorOverrides: [{ selector: PreprintStepperSelectors.getInstitutionsChanged, value: true }],
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SetInstitutionsChanged));
    expect(store.dispatch).not.toHaveBeenCalledWith(
      new UpdateResourceInstitutions(mockPreprint.id, ResourceType.Preprint, mockUserInstitutions)
    );
  });

  it('should dispatch update institutions on selection change', () => {
    setup();
    const updatedInstitutions = [MOCK_INSTITUTION];

    component.onInstitutionsChange(updatedInstitutions);

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateResourceInstitutions(mockPreprint.id, ResourceType.Preprint, updatedInstitutions)
    );
  });
});
