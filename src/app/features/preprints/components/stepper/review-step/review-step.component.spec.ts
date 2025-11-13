import { MockComponents, MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { LicenseDisplayComponent } from '@osf/shared/components/license-display/license-display.component';
import { ToastService } from '@osf/shared/services/toast.service';
import { InterpolatePipe } from '@shared/pipes/interpolate.pipe';
import { ContributorsSelectors } from '@shared/stores/contributors';
import { InstitutionsSelectors } from '@shared/stores/institutions';
import { SubjectsSelectors } from '@shared/stores/subjects';

import { ReviewStepComponent } from './review-step.component';

import { MOCK_CONTRIBUTOR } from '@testing/mocks/contributors.mock';
import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { SUBJECTS_MOCK } from '@testing/mocks/subject.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMock } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

describe('ReviewStepComponent', () => {
  let component: ReviewStepComponent;
  let fixture: ComponentFixture<ReviewStepComponent>;
  let router: jest.Mocked<Router>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint = PREPRINT_MOCK;
  const mockPreprintFile = OSF_FILE_MOCK;
  const mockContributors = [MOCK_CONTRIBUTOR];
  const mockSubjects = SUBJECTS_MOCK;
  const mockInstitutions = [MOCK_INSTITUTION];
  const mockLicense = MOCK_LICENSE;
  const mockPreprintProject = {
    id: 'project-id',
    name: 'Test Project',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReviewStepComponent,
        OSFTestingModule,
        ...MockComponents(AffiliatedInstitutionsViewComponent, ContributorsListComponent, LicenseDisplayComponent),
        MockPipe(InterpolatePipe),
      ],
      providers: [
        { provide: Router, useValue: RouterMock.create().build() },
        { provide: ToastService, useValue: ToastServiceMock.simple() },
        provideMockStore({
          signals: [
            { selector: PreprintStepperSelectors.getPreprint, value: mockPreprint },
            { selector: PreprintStepperSelectors.getPreprintFile, value: mockPreprintFile },
            { selector: PreprintStepperSelectors.isPreprintSubmitting, value: false },
            { selector: PreprintStepperSelectors.getPreprintLicense, value: mockLicense },
            { selector: PreprintStepperSelectors.getPreprintProject, value: mockPreprintProject },
            { selector: ContributorsSelectors.getBibliographicContributors, value: mockContributors },
            { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
            { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
            { selector: SubjectsSelectors.getSelectedSubjects, value: mockSubjects },
            { selector: InstitutionsSelectors.getResourceInstitutions, value: mockInstitutions },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewStepComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    fixture.componentRef.setInput('provider', mockProvider);
  });

  it('should have required provider input', () => {
    expect(component.provider()).toEqual(mockProvider);
  });

  it('should create license options record', () => {
    const licenseOptionsRecord = component.licenseOptionsRecord();
    expect(licenseOptionsRecord).toEqual({ copyrightHolders: 'John Doe', year: '2023' });
  });

  it('should handle cancelSubmission method', () => {
    component.cancelSubmission();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/preprints');
  });

  it('should handle submitting state', () => {
    expect(component.isPreprintSubmitting()).toBe(false);
  });

  it('should have proper method signatures', () => {
    expect(typeof component.submitPreprint).toBe('function');
    expect(typeof component.cancelSubmission).toBe('function');
  });
});
