import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayInputComponent } from '@osf/features/preprints/components/stepper/author-assertion-step/array-input/array-input.component';
import { ApplicabilityStatus } from '@osf/features/preprints/enums';
import { Preprint } from '@osf/features/preprints/models';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { FormSelectComponent } from '@shared/components';
import { CustomConfirmationService, ToastService } from '@shared/services';

import { AuthorAssertionsStepComponent } from './author-assertions-step.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('AuthorAssertionsStepComponent', () => {
  let component: AuthorAssertionsStepComponent;
  let fixture: ComponentFixture<AuthorAssertionsStepComponent>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

  const mockPreprint: Preprint = PREPRINT_MOCK;

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        AuthorAssertionsStepComponent,
        OSFTestingModule,
        MockComponents(ArrayInputComponent, FormSelectComponent),
      ],
      providers: [
        TranslationServiceMock,
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        provideMockStore({
          signals: [
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

    fixture = TestBed.createComponent(AuthorAssertionsStepComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with preprint data', () => {
    expect(component.authorAssertionsForm.get('hasCoi')?.value).toBe(false);
    expect(component.authorAssertionsForm.get('coiStatement')?.value).toBeNull();
    expect(component.authorAssertionsForm.get('hasDataLinks')?.value).toBe(ApplicabilityStatus.NotApplicable);
    expect(component.authorAssertionsForm.get('hasPreregLinks')?.value).toBe(ApplicabilityStatus.NotApplicable);
  });

  it('should emit nextClicked when nextButtonClicked is called', () => {
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');
    component.nextButtonClicked();

    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSaved'
    );
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should show confirmation dialog when backButtonClicked is called with changes', () => {
    component.authorAssertionsForm.patchValue({ hasCoi: true });

    component.backButtonClicked();

    expect(customConfirmationServiceMock.confirmContinue).toHaveBeenCalledWith({
      headerKey: 'common.discardChanges.header',
      messageKey: 'common.discardChanges.message',
      onConfirm: expect.any(Function),
      onReject: expect.any(Function),
    });
  });

  it('should expose readonly properties', () => {
    expect(component.CustomValidators).toBeDefined();
    expect(component.ApplicabilityStatus).toBe(ApplicabilityStatus);
    expect(component.inputLimits).toBeDefined();
    expect(component.INPUT_VALIDATION_MESSAGES).toBeDefined();
    expect(component.preregLinkOptions).toBeDefined();
    expect(component.linkValidators).toBeDefined();
  });

  it('should have correct signal values', () => {
    expect(component.hasCoiValue()).toBe(false);
    expect(component.hasDataLinks()).toBe(ApplicabilityStatus.NotApplicable);
    expect(component.hasPreregLinks()).toBe(ApplicabilityStatus.NotApplicable);
  });
});
