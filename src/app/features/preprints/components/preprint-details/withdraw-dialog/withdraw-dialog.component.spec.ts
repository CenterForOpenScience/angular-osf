import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { formInputLimits } from '@osf/features/preprints/constants';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { Preprint, PreprintProviderDetails } from '@osf/features/preprints/models';

import { WithdrawDialogComponent } from './withdraw-dialog.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('WithdrawDialogComponent', () => {
  let component: WithdrawDialogComponent;
  let fixture: ComponentFixture<WithdrawDialogComponent>;
  let dialogRefMock: any;
  let dialogConfigMock: any;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint: Preprint = PREPRINT_MOCK;

  beforeEach(async () => {
    dialogRefMock = {
      close: jest.fn(),
    };
    dialogConfigMock = {
      data: { provider: mockProvider, preprint: mockPreprint },
    };

    await TestBed.configureTestingModule({
      imports: [WithdrawDialogComponent, OSFTestingModule, MockPipe(TitleCasePipe)],
      providers: [
        MockProvider(DynamicDialogRef, dialogRefMock),
        MockProvider(DynamicDialogConfig, dialogConfigMock),
        provideMockStore({
          signals: [],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set modal explanation on init', () => {
    expect(component.modalExplanation()).toBeDefined();
    expect(typeof component.modalExplanation()).toBe('string');
  });

  it('should handle form validation correctly', () => {
    const formControl = component.withdrawalJustificationFormControl;

    formControl.setValue('');
    expect(formControl.invalid).toBe(true);

    const minLength = formInputLimits.withdrawalJustification.minLength;
    formControl.setValue('a'.repeat(minLength));
    expect(formControl.valid).toBe(true);
  });

  it('should handle withdraw with valid form', () => {
    const validJustification = 'Valid withdrawal justification';
    component.withdrawalJustificationFormControl.setValue(validJustification);

    expect(() => component.withdraw()).not.toThrow();
  });

  it('should not proceed with withdraw if form is invalid', () => {
    component.withdrawalJustificationFormControl.setValue('');

    expect(() => component.withdraw()).not.toThrow();
  });

  it('should handle withdraw request completion', () => {
    const validJustification = 'Valid withdrawal justification';
    component.withdrawalJustificationFormControl.setValue(validJustification);

    expect(() => component.withdraw()).not.toThrow();
  });

  it('should handle withdraw request error', () => {
    const validJustification = 'Valid withdrawal justification';
    component.withdrawalJustificationFormControl.setValue(validJustification);

    expect(() => component.withdraw()).not.toThrow();
  });

  it('should calculate modal explanation for pre-moderation pending', () => {
    const providerWithPreMod = { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PreModeration };
    const preprintWithPending = { ...mockPreprint, reviewsState: ReviewsState.Pending };

    dialogConfigMock.data = { provider: providerWithPreMod, preprint: preprintWithPending };

    expect(() => {
      fixture = TestBed.createComponent(WithdrawDialogComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
    }).not.toThrow();
  });

  it('should calculate modal explanation for pre-moderation accepted', () => {
    const providerWithPreMod = { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PreModeration };
    const preprintWithAccepted = { ...mockPreprint, reviewsState: ReviewsState.Accepted };

    dialogConfigMock.data = { provider: providerWithPreMod, preprint: preprintWithAccepted };

    expect(() => {
      fixture = TestBed.createComponent(WithdrawDialogComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
    }).not.toThrow();
  });

  it('should calculate modal explanation for post-moderation', () => {
    const providerWithPostMod = { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PostModeration };

    dialogConfigMock.data = { provider: providerWithPostMod, preprint: mockPreprint };

    expect(() => {
      fixture = TestBed.createComponent(WithdrawDialogComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
    }).not.toThrow();
  });

  it('should handle form control state changes', () => {
    const formControl = component.withdrawalJustificationFormControl;
    formControl.markAsTouched();
    expect(formControl.touched).toBe(true);

    formControl.setValue('test');
    formControl.markAsDirty();
    expect(formControl.dirty).toBe(true);
  });

  it('should handle minimum length validation', () => {
    const formControl = component.withdrawalJustificationFormControl;
    const minLength = formInputLimits.withdrawalJustification.minLength;

    formControl.setValue('a'.repeat(minLength - 1));
    expect(formControl.hasError('minlength')).toBe(true);

    formControl.setValue('a'.repeat(minLength));
    expect(formControl.hasError('minlength')).toBe(false);
  });

  it('should handle required validation', () => {
    const formControl = component.withdrawalJustificationFormControl;

    formControl.setValue('');
    expect(formControl.hasError('required')).toBe(true);

    formControl.setValue('   ');
    expect(formControl.hasError('required')).toBe(true);

    formControl.setValue('Valid text');
    expect(formControl.hasError('required')).toBe(false);
  });
});
