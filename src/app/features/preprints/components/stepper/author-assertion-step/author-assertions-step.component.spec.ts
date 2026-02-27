import { Store } from '@ngxs/store';

import { MockComponents, MockDirective, MockProvider } from 'ng-mocks';

import { Textarea } from 'primeng/textarea';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { PreprintModel } from '@osf/features/preprints/models';
import { PreprintStepperSelectors, UpdatePreprint } from '@osf/features/preprints/store/preprint-stepper';
import { FormSelectComponent } from '@osf/shared/components/form-select/form-select.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { ArrayInputComponent } from './array-input/array-input.component';
import { AuthorAssertionsStepComponent } from './author-assertions-step.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('AuthorAssertionsStepComponent', () => {
  let component: AuthorAssertionsStepComponent;
  let fixture: ComponentFixture<AuthorAssertionsStepComponent>;
  let store: Store;
  let toastServiceMock: ToastServiceMockType;
  let customConfirmationServiceMock: CustomConfirmationServiceMockType;

  const mockPreprint: PreprintModel = PREPRINT_MOCK;

  const populatedPreprint: PreprintModel = {
    ...mockPreprint,
    hasCoi: true,
    coiStatement: 'Author is a board member of the funder.',
    hasDataLinks: ApplicabilityStatus.Applicable,
    dataLinks: ['https://data.example/ds1', 'https://data.example/ds2'],
    whyNoData: null,
    hasPreregLinks: ApplicabilityStatus.Applicable,
    preregLinks: ['https://prereg.example/reg1'],
    whyNoPrereg: null,
    preregLinkInfo: PreregLinkInfo.Both,
  };

  const cleanPreprint: PreprintModel = {
    ...mockPreprint,
    hasCoi: false,
    coiStatement: null,
    hasDataLinks: ApplicabilityStatus.NotApplicable,
    dataLinks: [],
    whyNoData: null,
    hasPreregLinks: ApplicabilityStatus.NotApplicable,
    preregLinks: [],
    whyNoPrereg: null,
    preregLinkInfo: null,
  };

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintStepperSelectors.getPreprint, value: mockPreprint },
    { selector: PreprintStepperSelectors.isPreprintSubmitting, value: false },
  ];

  function setup(overrides?: { selectorOverrides?: SignalOverride[]; detectChanges?: boolean }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);
    toastServiceMock = ToastServiceMock.simple();
    customConfirmationServiceMock = CustomConfirmationServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        AuthorAssertionsStepComponent,
        ...MockComponents(ArrayInputComponent, FormSelectComponent),
        MockDirective(Textarea),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AuthorAssertionsStepComponent);
    component = fixture.componentInstance;
    if (overrides?.detectChanges ?? false) {
      fixture.detectChanges();
    }
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should create and initialize form with preprint defaults', () => {
    setup();

    expect(component).toBeTruthy();
    expect(component.authorAssertionsForm.controls.hasCoi.value).toBe(false);
    expect(component.authorAssertionsForm.controls.coiStatement.value).toBeNull();
    expect(component.authorAssertionsForm.controls.hasDataLinks.value).toBe(ApplicabilityStatus.NotApplicable);
    expect(component.authorAssertionsForm.controls.hasPreregLinks.value).toBe(ApplicabilityStatus.NotApplicable);
    expect(component.hasCoiValue()).toBe(false);
    expect(component.hasDataLinks()).toBe(ApplicabilityStatus.NotApplicable);
    expect(component.hasPreregLinks()).toBe(ApplicabilityStatus.NotApplicable);
  });

  it('should hydrate form from a preprint that has real data', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: populatedPreprint }],
    });

    const controls = component.authorAssertionsForm.controls;
    expect(controls.hasCoi.value).toBe(true);
    expect(controls.coiStatement.value).toBe('Author is a board member of the funder.');
    expect(controls.hasDataLinks.value).toBe(ApplicabilityStatus.Applicable);
    expect(controls.dataLinks.length).toBe(2);
    expect(controls.hasPreregLinks.value).toBe(ApplicabilityStatus.Applicable);
    expect(controls.preregLinks.length).toBe(1);
    expect(controls.preregLinkInfo.value).toBe(PreregLinkInfo.Both);
  });

  it('should enable coiStatement control when hasCoi becomes true', () => {
    setup({ detectChanges: true });
    component.authorAssertionsForm.controls.hasCoi.setValue(true);
    fixture.detectChanges();

    expect(component.authorAssertionsForm.controls.coiStatement.enabled).toBe(true);
  });

  it('should disable and clear coiStatement control when hasCoi becomes false', () => {
    setup({ detectChanges: true });
    const { hasCoi, coiStatement } = component.authorAssertionsForm.controls;
    hasCoi.setValue(true);
    coiStatement.setValue('Some statement');
    fixture.detectChanges();

    hasCoi.setValue(false);
    fixture.detectChanges();

    expect(coiStatement.value).toBeNull();
    expect(coiStatement.disabled).toBe(true);
  });

  it('should enable whyNoData and clear dataLinks when hasDataLinks is Unavailable', () => {
    setup({ detectChanges: true });
    const { hasDataLinks, whyNoData, dataLinks } = component.authorAssertionsForm.controls;
    dataLinks.push(new FormControl('https://existing.example'));

    hasDataLinks.setValue(ApplicabilityStatus.Unavailable);
    fixture.detectChanges();

    expect(whyNoData.enabled).toBe(true);
    expect(dataLinks.length).toBe(0);
  });

  it('should add an empty dataLinks entry and clear whyNoData when hasDataLinks is Applicable', () => {
    setup({ detectChanges: true });
    const { hasDataLinks, whyNoData, dataLinks } = component.authorAssertionsForm.controls;
    hasDataLinks.setValue(ApplicabilityStatus.Unavailable);
    whyNoData.setValue('No data available');
    fixture.detectChanges();

    hasDataLinks.setValue(ApplicabilityStatus.Applicable);
    fixture.detectChanges();

    expect(dataLinks.length).toBe(1);
    expect(whyNoData.value).toBeNull();
  });

  it('should enable whyNoPrereg and clear preregLinks/preregLinkInfo when hasPreregLinks is Unavailable', () => {
    setup({ detectChanges: true });
    const { hasPreregLinks, whyNoPrereg, preregLinkInfo, preregLinks } = component.authorAssertionsForm.controls;
    preregLinks.push(new FormControl('https://existing.example'));
    preregLinkInfo.setValue(PreregLinkInfo.Both);

    hasPreregLinks.setValue(ApplicabilityStatus.Unavailable);
    fixture.detectChanges();

    expect(whyNoPrereg.enabled).toBe(true);
    expect(preregLinks.length).toBe(0);
    expect(preregLinkInfo.value).toBeNull();
  });

  it('should add an empty preregLinks entry and enable preregLinkInfo when hasPreregLinks is Applicable', () => {
    setup({ detectChanges: true });
    const { hasPreregLinks, preregLinks, preregLinkInfo } = component.authorAssertionsForm.controls;
    hasPreregLinks.setValue(ApplicabilityStatus.Unavailable);
    fixture.detectChanges();

    hasPreregLinks.setValue(ApplicabilityStatus.Applicable);
    fixture.detectChanges();

    expect(preregLinks.length).toBe(1);
    expect(preregLinkInfo.enabled).toBe(true);
  });

  it('should return early in nextButtonClicked when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: null }],
    });
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');
    (store.dispatch as jest.Mock).mockClear();

    component.nextButtonClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdatePreprint));
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should dispatch UpdatePreprint, show success toast, and emit next on valid submission', () => {
    setup();
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');
    component.authorAssertionsForm.patchValue({
      hasCoi: true,
      coiStatement: 'COI',
      hasDataLinks: ApplicabilityStatus.Applicable,
      hasPreregLinks: ApplicabilityStatus.Applicable,
      preregLinkInfo: PreregLinkInfo.Both,
    });
    component.authorAssertionsForm.controls.dataLinks.push(new FormControl('https://data.example'));
    component.authorAssertionsForm.controls.preregLinks.push(new FormControl('https://prereg.example'));
    (store.dispatch as jest.Mock).mockClear();

    component.nextButtonClicked();

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdatePreprint(mockPreprint.id, {
        hasCoi: true,
        coiStatement: 'COI',
        hasDataLinks: ApplicabilityStatus.Applicable,
        whyNoData: null,
        dataLinks: ['https://data.example'],
        hasPreregLinks: ApplicabilityStatus.Applicable,
        whyNoPrereg: null,
        preregLinks: ['https://prereg.example'],
        preregLinkInfo: PreregLinkInfo.Both,
      })
    );
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSaved'
    );
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should omit preregLinkInfo from the UpdatePreprint payload when it is empty', () => {
    setup();
    component.authorAssertionsForm.patchValue({
      hasPreregLinks: ApplicabilityStatus.Applicable,
      preregLinkInfo: null,
    });
    component.authorAssertionsForm.controls.preregLinks.push(new FormControl('https://prereg.example'));
    (store.dispatch as jest.Mock).mockClear();

    component.nextButtonClicked();

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdatePreprint(mockPreprint.id, expect.objectContaining({ preregLinkInfo: undefined }))
    );
  });

  it('should return early in backButtonClicked when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: null }],
    });
    const emitSpy = jest.spyOn(component.backClicked, 'emit');

    component.backButtonClicked();

    expect(customConfirmationServiceMock.confirmContinue).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit back immediately when there are no unsaved changes', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: cleanPreprint }],
    });
    const emitSpy = jest.spyOn(component.backClicked, 'emit');

    component.backButtonClicked();

    expect(customConfirmationServiceMock.confirmContinue).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle discard confirmation callbacks when there are unsaved changes', () => {
    setup();
    const emitSpy = jest.spyOn(component.backClicked, 'emit');
    component.authorAssertionsForm.patchValue({ hasCoi: true });

    component.backButtonClicked();

    expect(customConfirmationServiceMock.confirmContinue).toHaveBeenCalledWith({
      headerKey: 'common.discardChanges.header',
      messageKey: 'common.discardChanges.message',
      onConfirm: expect.any(Function),
      onReject: expect.any(Function),
    });

    const { onReject } = customConfirmationServiceMock.confirmContinue.mock.calls[0][0];
    onReject();
    expect(emitSpy).not.toHaveBeenCalled();

    const { onConfirm } = customConfirmationServiceMock.confirmContinue.mock.calls[0][0];
    onConfirm();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
