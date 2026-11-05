import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  FetchPreprintProject,
  PreprintStepperSelectors,
  SubmitPreprint,
  UpdatePreprint,
  UpdatePrimaryFileRelationship,
} from '@osf/features/preprints/store/preprint-stepper';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
} from '@osf/shared/stores/contributors';
import { FetchResourceInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { FetchLicense, LicensesSelectors } from '@osf/shared/stores/licenses';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ReviewsState } from '../../../enums';

import { ReviewStepComponent } from './review-step.component';

interface SetupOverrides extends BaseSetupOverrides {
  provider?: PreprintProviderDetails;
  detectChanges?: boolean;
}

describe('ReviewStepComponent', () => {
  let component: ReviewStepComponent;
  let fixture: ComponentFixture<ReviewStepComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let toastMock: ToastServiceMockType;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint = PREPRINT_MOCK;
  const mockPreprintFile = OSF_FILE_MOCK;

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintStepperSelectors.getPreprint, value: mockPreprint },
    { selector: PreprintStepperSelectors.getPreprintFile, value: mockPreprintFile },
    { selector: PreprintStepperSelectors.isPreprintSubmitting, value: false },
    { selector: LicensesSelectors.getLicense, value: MOCK_LICENSE },
    { selector: PreprintStepperSelectors.getPreprintProject, value: { id: 'project-id', name: 'Test Project' } },
    { selector: ContributorsSelectors.getBibliographicContributors, value: [MOCK_CONTRIBUTOR] },
    { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
    { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
    { selector: SubjectsSelectors.getSelectedSubjects, value: SUBJECTS_MOCK },
    { selector: InstitutionsSelectors.getResourceInstitutions, value: [MOCK_INSTITUTION] },
    { selector: UserSelectors.isProjectCreationDisabled, value: false },
  ];

  function setup(overrides: SetupOverrides = {}) {
    routerMock = RouterMockBuilder.create().build();
    toastMock = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        ReviewStepComponent,
        ...MockComponents(
          AffiliatedInstitutionsViewComponent,
          ContributorsListComponent,
          LicenseDisplayComponent,
          TruncatedTextComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(ToastService, toastMock),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ReviewStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', 'provider' in overrides ? overrides.provider : mockProvider);
    if (overrides.detectChanges ?? true) {
      fixture.detectChanges();
    }
  }

  it('should dispatch initial fetch actions when preprint exists', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicense(mockPreprint.licenseId ?? undefined));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintProject());
    expect(store.dispatch).toHaveBeenCalledWith(
      new GetBibliographicContributors(mockPreprint.id, ResourceType.Preprint)
    );
    expect(store.dispatch).toHaveBeenCalledWith(new FetchSelectedSubjects(mockPreprint.id, ResourceType.Preprint));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchResourceInstitutions(mockPreprint.id, ResourceType.Preprint));
  });

  it('should skip fetches when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: null }],
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchLicense));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintProject));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetBibliographicContributors));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchSelectedSubjects));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchResourceInstitutions));
  });

  it('should expose license options record from preprint', () => {
    setup();
    expect(component.licenseOptionsRecord()).toEqual(mockPreprint.licenseOptions ?? {});
  });

  it('should expose empty license options record when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: null }],
      detectChanges: false,
    });
    expect(component.licenseOptionsRecord()).toEqual({});
  });

  it('should navigate to preprints list on cancel', () => {
    setup();

    component.cancelSubmission();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/preprints');
  });

  it('should return early in submitPreprint when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: null }],
      detectChanges: false,
    });

    component.submitPreprint();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdatePrimaryFileRelationship));
    expect(toastMock.showSuccess).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should return early in submitPreprint when no file id is available', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getPreprint, value: { ...mockPreprint, primaryFileId: null } },
        { selector: PreprintStepperSelectors.getPreprintFile, value: null },
      ],
    });
    (store.dispatch as Mock).mockClear();

    component.submitPreprint();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdatePrimaryFileRelationship));
    expect(toastMock.showSuccess).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should publish directly when provider has no reviews workflow', () => {
    setup({
      provider: { ...mockProvider, reviewsWorkflow: null },
    });
    (store.dispatch as Mock).mockClear();

    component.submitPreprint();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdatePrimaryFileRelationship(mockPreprintFile.id));
    expect(store.dispatch).toHaveBeenCalledWith(new UpdatePreprint(mockPreprint.id, { isPublished: true }));
    expect(toastMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSubmitted'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/preprints', mockProvider.id, mockPreprint.id]);
  });

  it('should submit preprint when workflow exists and reviews state is not accepted', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintStepperSelectors.getPreprint,
          value: { ...mockPreprint, reviewsState: ReviewsState.Pending },
        },
      ],
    });
    (store.dispatch as Mock).mockClear();

    component.submitPreprint();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdatePrimaryFileRelationship(mockPreprintFile.id));
    expect(store.dispatch).toHaveBeenCalledWith(new SubmitPreprint());
    expect(toastMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSubmitted'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/preprints', mockProvider.id, mockPreprint.id]);
  });

  it('should skip submit/update when reviews state is accepted and still navigate', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintStepperSelectors.getPreprint,
          value: { ...mockPreprint, reviewsState: ReviewsState.Accepted },
        },
      ],
    });
    (store.dispatch as Mock).mockClear();

    component.submitPreprint();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdatePrimaryFileRelationship(mockPreprintFile.id));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SubmitPreprint));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdatePreprint));
    expect(toastMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSubmitted'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/preprints', mockProvider.id, mockPreprint.id]);
  });

  it('should load more contributors', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.loadMoreContributors();

    expect(store.dispatch).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors(mockPreprint.id, ResourceType.Preprint)
    );
  });

  it('should emit deleteClicked when deletePreprint is called', () => {
    setup({ detectChanges: false });
    const emitSpy = vi.spyOn(component.deleteClicked, 'emit');

    component.deletePreprint();

    expect(emitSpy).toHaveBeenCalled();
  });
});
