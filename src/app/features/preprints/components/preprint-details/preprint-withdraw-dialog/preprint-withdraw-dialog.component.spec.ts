import { Store } from '@ngxs/store';

import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, throwError } from 'rxjs';

import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { formInputLimits } from '@osf/features/preprints/constants';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintModel, PreprintProviderDetails } from '@osf/features/preprints/models';
import { WithdrawPreprint } from '@osf/features/preprints/store/preprint';

import { PreprintWithdrawDialogComponent } from './preprint-withdraw-dialog.component';

import { provideDynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintWithdrawDialogComponent', () => {
  let component: PreprintWithdrawDialogComponent;
  let fixture: ComponentFixture<PreprintWithdrawDialogComponent>;
  let dialogRefMock: { close: jest.Mock };
  let store: Store;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint: PreprintModel = PREPRINT_MOCK;

  interface SetupOverrides {
    provider?: PreprintProviderDetails | undefined;
    preprint?: PreprintModel | undefined;
  }

  function setup(overrides: SetupOverrides = {}) {
    const dialogConfigMock = {
      data: {
        provider: 'provider' in overrides ? overrides.provider : mockProvider,
        preprint: 'preprint' in overrides ? overrides.preprint : mockPreprint,
      },
    };

    TestBed.configureTestingModule({
      imports: [PreprintWithdrawDialogComponent, MockPipe(TitleCasePipe)],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, dialogConfigMock),
        provideMockStore(),
      ],
    });

    fixture = TestBed.createComponent(PreprintWithdrawDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dialogRefMock = TestBed.inject(DynamicDialogRef) as unknown as { close: jest.Mock };
    fixture.detectChanges();
    (store.dispatch as jest.Mock).mockClear();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should set modal explanation for pre-moderation pending', () => {
    setup({
      provider: { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PreModeration },
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Pending },
    });
    expect(component.modalExplanation()).toContain('preprints.details.withdrawDialog.preModerationNoticePending');
  });

  it('should set modal explanation for pre-moderation accepted', () => {
    setup({
      provider: { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PreModeration },
      preprint: { ...mockPreprint, reviewsState: ReviewsState.Accepted },
    });
    expect(component.modalExplanation()).toContain('preprints.details.withdrawDialog.preModerationNoticeAccepted');
  });

  it('should set modal explanation for post-moderation', () => {
    setup({
      provider: { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PostModeration },
    });
    expect(component.modalExplanation()).toContain('preprints.details.withdrawDialog.postModerationNotice');
  });

  it('should set modal explanation for no moderation by default', () => {
    setup({
      provider: { ...mockProvider, reviewsWorkflow: null },
    });
    expect(component.modalExplanation()).toContain('preprints.details.withdrawDialog.noModerationNotice');
  });

  it('should set empty explanation when dialog data is missing', () => {
    setup({
      provider: undefined,
      preprint: undefined,
    });
    expect(component.modalExplanation()).toBe('');
  });

  it('should keep invalid for empty and whitespace-only justification', () => {
    setup();
    component.withdrawalJustificationFormControl.setValue('');
    expect(component.withdrawalJustificationFormControl.hasError('required')).toBe(true);
    component.withdrawalJustificationFormControl.setValue('   ');
    expect(component.withdrawalJustificationFormControl.hasError('required')).toBe(true);
  });

  it('should enforce minimum length validation', () => {
    setup();
    const minLength = formInputLimits.withdrawalJustification.minLength;
    component.withdrawalJustificationFormControl.setValue('a'.repeat(minLength - 1));
    expect(component.withdrawalJustificationFormControl.hasError('minlength')).toBe(true);
    component.withdrawalJustificationFormControl.setValue('a'.repeat(minLength));
    expect(component.withdrawalJustificationFormControl.hasError('minlength')).toBe(false);
  });

  it('should not dispatch withdraw when form is invalid', () => {
    setup();
    component.withdrawalJustificationFormControl.setValue('');
    component.withdraw();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch withdraw and close dialog on success', () => {
    setup();
    component.withdrawalJustificationFormControl.setValue('Valid withdrawal justification');
    (store.dispatch as jest.Mock).mockReturnValue(of(true));
    component.withdraw();
    expect(store.dispatch).toHaveBeenCalledWith(
      new WithdrawPreprint(mockPreprint.id, 'Valid withdrawal justification')
    );
    expect(component.withdrawRequestInProgress()).toBe(false);
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should reset loading and not close dialog on withdraw error', () => {
    setup();
    component.withdrawalJustificationFormControl.setValue('Valid withdrawal justification');
    (store.dispatch as jest.Mock).mockReturnValue(throwError(() => new Error('withdraw failed')));
    component.withdraw();
    expect(component.withdrawRequestInProgress()).toBe(false);
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should not dispatch withdraw when preprint is missing', () => {
    setup({
      provider: mockProvider,
      preprint: undefined,
    });
    component.withdrawalJustificationFormControl.setValue('Valid withdrawal justification');
    component.withdraw();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
