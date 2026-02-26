import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { formInputLimits } from '@osf/features/preprints/constants';
import { PreprintModel, PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  FetchLicenses,
  PreprintStepperSelectors,
  SaveLicense,
  UpdatePreprint,
} from '@osf/features/preprints/store/preprint-stepper';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LicenseComponent } from '@osf/shared/components/license/license.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { LicenseModel } from '@shared/models/license/license.model';

import { PreprintsAffiliatedInstitutionsComponent } from './preprints-affiliated-institutions/preprints-affiliated-institutions.component';
import { PreprintsContributorsComponent } from './preprints-contributors/preprints-contributors.component';
import { PreprintsSubjectsComponent } from './preprints-subjects/preprints-subjects.component';
import { PreprintsMetadataStepComponent } from './preprints-metadata-step.component';

import { MOCK_LICENSE } from '@testing/mocks/license.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('PreprintsMetadataStepComponent', () => {
  let component: PreprintsMetadataStepComponent;
  let fixture: ComponentFixture<PreprintsMetadataStepComponent>;
  let store: Store;
  let toastServiceMock: ToastServiceMockType;
  let customConfirmationServiceMock: CustomConfirmationServiceMockType;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint: PreprintModel = PREPRINT_MOCK;
  const mockLicenses: LicenseModel[] = [MOCK_LICENSE];

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintStepperSelectors.getLicenses, value: mockLicenses },
    { selector: PreprintStepperSelectors.getPreprint, value: mockPreprint },
    { selector: PreprintStepperSelectors.isPreprintSubmitting, value: false },
  ];

  function setup(overrides?: { selectorOverrides?: SignalOverride[]; detectChanges?: boolean }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);
    toastServiceMock = ToastServiceMock.simple();
    customConfirmationServiceMock = CustomConfirmationServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        PreprintsMetadataStepComponent,
        ...MockComponents(
          PreprintsContributorsComponent,
          IconComponent,
          TextInputComponent,
          LicenseComponent,
          PreprintsSubjectsComponent,
          PreprintsAffiliatedInstitutionsComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintsMetadataStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', mockProvider);
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

  it('should initialize defaults and form values', () => {
    setup();

    expect(component.inputLimits).toBe(formInputLimits);
    expect(component.INPUT_VALIDATION_MESSAGES).toBe(INPUT_VALIDATION_MESSAGES);
    expect(component.today).toBeInstanceOf(Date);
    expect(component.metadataForm.controls.doi.value).toBe(mockPreprint.doi);
    expect(component.metadataForm.controls.customPublicationCitation.value).toBe(
      mockPreprint.customPublicationCitation
    );
    expect(component.metadataForm.controls.tags.value).toEqual(mockPreprint.tags);
  });

  it('should dispatch fetch licenses on init', () => {
    setup();
    expect(store.dispatch).toHaveBeenCalledWith(new FetchLicenses(mockProvider.id));
  });

  it('should auto-select default license and dispatch save when license has no required fields', () => {
    const licenseWithoutFields = { ...MOCK_LICENSE, id: 'license-no-fields', requiredFields: [] };
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getLicenses, value: [licenseWithoutFields] },
        {
          selector: PreprintStepperSelectors.getPreprint,
          value: { ...mockPreprint, licenseId: null, defaultLicenseId: 'license-no-fields' },
        },
      ],
    });

    expect(component.defaultLicense()).toBe('license-no-fields');
    expect(store.dispatch).toHaveBeenCalledWith(new SaveLicense('license-no-fields', undefined));
  });

  it('should auto-select default license without dispatching save when license requires fields', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getLicenses, value: [MOCK_LICENSE] },
        {
          selector: PreprintStepperSelectors.getPreprint,
          value: { ...mockPreprint, licenseId: null, defaultLicenseId: MOCK_LICENSE.id },
        },
      ],
    });

    expect(component.defaultLicense()).toBe(MOCK_LICENSE.id);
    expect(store.dispatch).not.toHaveBeenCalledWith(new SaveLicense(MOCK_LICENSE.id, undefined));
  });

  it('should return early in nextButtonClicked when form is invalid', () => {
    setup();
    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');
    (store.dispatch as jest.Mock).mockClear();

    component.metadataForm.patchValue({ subjects: [] });
    component.nextButtonClicked();

    expect(nextClickedSpy).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdatePreprint));
  });

  it('should return early in nextButtonClicked when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: null }],
      detectChanges: false,
    });
    component.initForm();
    component.metadataForm.patchValue({ subjects: [{ id: 'subject-1', name: 'Subject 1' }] });
    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');
    (store.dispatch as jest.Mock).mockClear();

    component.nextButtonClicked();

    expect(nextClickedSpy).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdatePreprint));
  });

  it('should update preprint and emit success in nextButtonClicked', () => {
    setup();
    const nextClickedSpy = jest.spyOn(component.nextClicked, 'emit');
    component.metadataForm.patchValue({ subjects: [{ id: 'subject-1', name: 'Subject 1' }] });
    (store.dispatch as jest.Mock).mockClear();

    component.nextButtonClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(UpdatePreprint));
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSaved'
    );
    expect(nextClickedSpy).toHaveBeenCalled();
  });

  it('should dispatch save license from createLicense', () => {
    setup({ detectChanges: false });
    component.createLicense({ id: MOCK_LICENSE.id, licenseOptions: { year: '2024', copyrightHolders: 'A' } });
    expect(store.dispatch).toHaveBeenCalledWith(
      new SaveLicense(MOCK_LICENSE.id, { year: '2024', copyrightHolders: 'A' })
    );
  });

  it('should dispatch save license in selectLicense only when required fields are absent', () => {
    setup({ detectChanges: false });
    const noFields = { ...MOCK_LICENSE, id: 'no-fields', requiredFields: [] };
    (store.dispatch as jest.Mock).mockClear();

    component.selectLicense(noFields);
    expect(store.dispatch).toHaveBeenCalledWith(new SaveLicense('no-fields', undefined));

    (store.dispatch as jest.Mock).mockClear();
    component.selectLicense(MOCK_LICENSE);
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SaveLicense));
  });

  it('should update tags form control', () => {
    setup();
    component.updateTags(['alpha', 'beta']);
    expect(component.metadataForm.controls.tags.value).toEqual(['alpha', 'beta']);
  });

  it('should return early in backButtonClicked when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: null }],
      detectChanges: false,
    });
    component.initForm();
    const backClickedSpy = jest.spyOn(component.backClicked, 'emit');

    component.backButtonClicked();

    expect(backClickedSpy).not.toHaveBeenCalled();
    expect(customConfirmationServiceMock.confirmContinue).not.toHaveBeenCalled();
  });

  it('should emit back when there are no changes in backButtonClicked', () => {
    setup();
    const backClickedSpy = jest.spyOn(component.backClicked, 'emit');
    component.metadataForm.patchValue({ subjects: [{ id: 'subject-1', name: 'Subject 1' }] });

    component.backButtonClicked();

    expect(backClickedSpy).toHaveBeenCalled();
    expect(customConfirmationServiceMock.confirmContinue).not.toHaveBeenCalled();
  });

  it('should request confirmation and emit on confirm when there are changes in backButtonClicked', () => {
    setup();
    const backClickedSpy = jest.spyOn(component.backClicked, 'emit');
    component.metadataForm.patchValue({ doi: '10.9999/changed', subjects: [{ id: 'subject-1', name: 'Subject 1' }] });

    component.backButtonClicked();

    expect(customConfirmationServiceMock.confirmContinue).toHaveBeenCalledWith({
      headerKey: 'common.discardChanges.header',
      messageKey: 'common.discardChanges.message',
      onConfirm: expect.any(Function),
      onReject: expect.any(Function),
    });

    const { onConfirm } = customConfirmationServiceMock.confirmContinue.mock.calls[0][0];
    onConfirm();
    expect(backClickedSpy).toHaveBeenCalled();
  });

  it('should not emit on reject when there are changes in backButtonClicked', () => {
    setup();
    const backClickedSpy = jest.spyOn(component.backClicked, 'emit');
    component.metadataForm.patchValue({ doi: '10.9999/changed', subjects: [{ id: 'subject-1', name: 'Subject 1' }] });

    component.backButtonClicked();

    const { onReject } = customConfirmationServiceMock.confirmContinue.mock.calls[0][0];
    onReject();
    expect(backClickedSpy).not.toHaveBeenCalled();
  });
});
