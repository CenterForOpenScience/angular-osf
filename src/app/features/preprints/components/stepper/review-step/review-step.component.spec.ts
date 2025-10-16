import { MockPipe } from 'ng-mocks';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { InterpolatePipe } from '@shared/pipes';
import { ToastService } from '@shared/services';
import { ContributorsSelectors, InstitutionsSelectors, SubjectsSelectors } from '@shared/stores';

import { ReviewStepComponent } from './review-step.component';

import { MOCK_CONTRIBUTOR, MOCK_INSTITUTION, MOCK_LICENSE } from '@testing/mocks';
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
      imports: [ReviewStepComponent, OSFTestingModule, MockPipe(InterpolatePipe)],
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
            { selector: ContributorsSelectors.getContributors, value: mockContributors },
            { selector: SubjectsSelectors.getSelectedSubjects, value: mockSubjects },
            { selector: InstitutionsSelectors.getResourceInstitutions, value: mockInstitutions },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewStepComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    fixture.componentRef.setInput('provider', mockProvider);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have required provider input', () => {
    expect(component.provider()).toEqual(mockProvider);
  });

  it('should filter bibliographic contributors', () => {
    const bibliographicContributors = component.bibliographicContributors();
    expect(bibliographicContributors).toHaveLength(1);
    expect(bibliographicContributors.every((c) => c.isBibliographic)).toBe(true);
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
