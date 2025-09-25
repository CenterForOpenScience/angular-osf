import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { formInputLimits } from '@osf/features/preprints/constants';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { IconComponent, LicenseComponent, TextInputComponent } from '@shared/components';
import { INPUT_VALIDATION_MESSAGES } from '@shared/constants';
import { MOCK_LICENSE } from '@shared/mocks';
import { LicenseModel } from '@shared/models';
import { CustomConfirmationService, ToastService } from '@shared/services';

import { PreprintsAffiliatedInstitutionsComponent } from './preprints-affiliated-institutions/preprints-affiliated-institutions.component';
import { PreprintsContributorsComponent } from './preprints-contributors/preprints-contributors.component';
import { PreprintsSubjectsComponent } from './preprints-subjects/preprints-subjects.component';
import { PreprintsMetadataStepComponent } from './preprints-metadata-step.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('PreprintsMetadataStepComponent', () => {
  let component: PreprintsMetadataStepComponent;
  let fixture: ComponentFixture<PreprintsMetadataStepComponent>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint = PREPRINT_MOCK;
  const mockLicenses: LicenseModel[] = [MOCK_LICENSE];

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().withShowSuccess(jest.fn()).build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create()
      .withConfirmContinue(jest.fn())
      .build();

    await TestBed.configureTestingModule({
      imports: [
        PreprintsMetadataStepComponent,
        OSFTestingModule,
        ...MockComponents(
          PreprintsContributorsComponent,
          PreprintsAffiliatedInstitutionsComponent,
          PreprintsSubjectsComponent,
          IconComponent,
          LicenseComponent,
          TextInputComponent
        ),
      ],
      providers: [
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        provideNoopAnimations(),
        provideMockStore({
          signals: [
            {
              selector: PreprintStepperSelectors.getLicenses,
              value: mockLicenses,
            },
            {
              selector: PreprintStepperSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintStepperSelectors.isPreprintSubmitting,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsMetadataStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.inputLimits).toBe(formInputLimits);
    expect(component.INPUT_VALIDATION_MESSAGES).toBe(INPUT_VALIDATION_MESSAGES);
    expect(component.today).toBeInstanceOf(Date);
  });

  it('should initialize form with correct structure', () => {
    fixture.detectChanges();
    expect(component.metadataForm).toBeInstanceOf(FormGroup);
    expect(component.metadataForm.controls['doi']).toBeInstanceOf(FormControl);
    expect(component.metadataForm.controls['originalPublicationDate']).toBeInstanceOf(FormControl);
    expect(component.metadataForm.controls['customPublicationCitation']).toBeInstanceOf(FormControl);
    expect(component.metadataForm.controls['tags']).toBeInstanceOf(FormControl);
    expect(component.metadataForm.controls['subjects']).toBeInstanceOf(FormControl);
  });

  it('should return licenses from store', () => {
    const licenses = component.licenses();
    expect(licenses).toBe(mockLicenses);
  });

  it('should return created preprint from store', () => {
    const preprint = component.createdPreprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should return submission state from store', () => {
    const isSubmitting = component.isUpdatingPreprint();
    expect(isSubmitting).toBe(false);
  });

  it('should return provider input', () => {
    const provider = component.provider();
    expect(provider).toBe(mockProvider);
  });

  it('should handle next button click with valid form', () => {
    fixture.detectChanges();
    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');

    component.metadataForm.patchValue({
      subjects: [{ id: 'subject1', name: 'Test Subject' }],
    });

    component.nextButtonClicked();

    expect(nextClickedSpy).toHaveBeenCalled();
  });

  it('should not proceed with next button click when form is invalid', () => {
    fixture.detectChanges();
    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');

    component.metadataForm.patchValue({
      subjects: [],
    });

    component.nextButtonClicked();

    expect(nextClickedSpy).not.toHaveBeenCalled();
  });

  it('should handle back button click with changes', () => {
    component.metadataForm.patchValue({
      doi: 'new-doi',
    });

    component.backButtonClicked();

    expect(customConfirmationServiceMock.confirmContinue).toHaveBeenCalled();
  });

  it('should handle select license without required fields', () => {
    const license = mockLicenses[0];

    expect(() => component.selectLicense(license)).not.toThrow();
  });

  it('should handle select license with required fields', () => {
    const license = mockLicenses[0];

    expect(() => component.selectLicense(license)).not.toThrow();
  });

  it('should handle edge case with empty licenses', () => {
    const licenses = component.licenses();
    expect(licenses).toBeDefined();
    expect(Array.isArray(licenses)).toBe(true);
  });
});
